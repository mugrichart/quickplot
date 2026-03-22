"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { StoryData, StoryEvent } from '@/types/story'
import { CharacterEvolutionChart } from './CharacterEvolutionChart'
import { EventsChart } from './EventsChart'
import { StoryWorld } from './StoryWorld'
import { Timeline } from './Timeline'
import { PlaybackControls } from './PlaybackControls'
import { CharacterControls } from './CharacterControls'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Maximize2, Minimize2, PanelBottomClose, PanelTopClose, Plus, Pencil, Sparkles, Navigation } from 'lucide-react'

import { PlaceStatesChart } from './PlaceStatesChart'
import { MapImageUpload } from './MapImageUpload'
import { StoryReference } from './StoryReference'
import { SceneSuggestionsCard } from './SceneSuggestionsCard'
import { SceneFlowCard } from './SceneFlowCard'
import { AddPlaceDialog } from './AddPlaceDialog'
import { AddCharacterDialog } from './AddCharacterDialog'
import { EditBeatDialog } from './EditBeatDialog'
import { AnimatePresence, motion } from 'framer-motion'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { storySteps, SCENES_PER_BEAT, heroJourneyDetails } from '@/lib/constants'

interface Props {
    initialData: StoryData
}

export function VisualizeOrchestrator({ initialData }: Props) {
    const [currentEventIndex, setCurrentEventIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1)
    const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
        initialData.characters.map(c => c.id)
    )

    // Aesthetic & UI State
    const [mapImageUrl, setMapImageUrl] = useState<string | null>(null)
    const [bgOpacity, setBgOpacity] = useState(0.6)
    const [bgBlur, setBgBlur] = useState(8)
    const [uiOpacity, setUiOpacity] = useState(0.85)

    const [places, setPlaces] = useState(initialData.places)
    const [characters, setCharacters] = useState(initialData.characters)
    const [events, setEvents] = useState(initialData.events)

    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
    const [isFooterCollapsed, setIsFooterCollapsed] = useState(false)

    const [isEditingFocus, setIsEditingFocus] = useState(false)
    const [editFocusValue, setEditFocusValue] = useState("")

    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
    const [isSceneFlowOpen, setIsSceneFlowOpen] = useState(false)
    const [editingEventIndex, setEditingEventIndex] = useState<number | null>(null)

    const [currentStructure, setCurrentStructure] = useState<keyof typeof storySteps>("heroJourney")

    const saveStory = useCallback((updatedStory: Partial<StoryData>) => {
        // We'll use the generic story-update route eventually, 
        // but for now we need a generic way to save characters/events too.
        // Let's assume we'll create /api/story/update soon or just use the whole thing.
        fetch('/api/story/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedStory)
        }).then(() => {
            console.log('Permanently saved story data')
        }).catch(err => {
            console.error('Failed to save story data:', err)
        })
    }, [])

    const handleNext = useCallback(() => {
        if (currentEventIndex + 1 >= events.length) {
            // Generate chaos
            const newEventIndex = events.length
            const steps = storySteps[currentStructure]
            const beatIndex = Math.floor(newEventIndex / SCENES_PER_BEAT) % steps.length
            const beatWeight = steps[beatIndex]
            const isNewBeat = newEventIndex % SCENES_PER_BEAT === 0

            const newEvent: StoryEvent = {
                id: `event-${Date.now()}`,
                label: isNewBeat ? heroJourneyDetails[beatIndex].name : `Scene ${newEventIndex % SCENES_PER_BEAT + 1}`,
                timestamp: Date.now(),
                occurrences: { good: 0, bad: 0 },
                placeStates: {} as Record<string, string>,
                placeFortunes: {} as Record<string, number>,
                characterLocations: {} as Record<string, string>,
                characterFortunes: {} as Record<string, number>,
                characterEvolution: {} as Record<string, number>
            }

            places.forEach(p => {
                newEvent.placeFortunes[p.id] = Math.floor(Math.random() * 201) - 100
                newEvent.placeStates[p.id] = "Chaotic Anomaly" 
            })

            characters.forEach(c => {
                const randomPlace = places[Math.floor(Math.random() * places.length)]
                newEvent.characterLocations[c.id] = randomPlace ? randomPlace.id : ''

                // Chaos around the beat
                const variationCap = 15 // +/- 15 variation
                const variation = (Math.random() * (variationCap * 2)) - variationCap

                const fortuneRoll = Math.random() * 5 
                let fortune: number
                if (fortuneRoll <= 4.8) {
                    fortune = Math.max(-100, Math.min(100, beatWeight + variation))
                } else {
                    fortune = Math.floor(Math.random() * 201) - 100
                }

                const evolutionRoll = Math.random() * 5 
                let evolution: number
                if (evolutionRoll <= 4.8) {
                    evolution = Math.max(-100, Math.min(100, beatWeight + variation))
                } else {
                    evolution = Math.floor(Math.random() * 201) - 100
                }

                newEvent.characterFortunes[c.id] = fortune
                newEvent.characterEvolution[c.id] = evolution

                if (fortune > 0) newEvent.occurrences.good++
                else newEvent.occurrences.bad++
            })

            const updatedEvents = [...events, newEvent]
            setEvents(updatedEvents)
            saveStory({ ...initialData, places, characters, events: updatedEvents })
            setCurrentEventIndex(events.length)
        } else {
            setCurrentEventIndex(prev => prev + 1)
        }
    }, [currentEventIndex, events, places, characters, initialData, saveStory, currentStructure])

    const handlePrev = useCallback(() => {
        if (events.length === 0) return
        setCurrentEventIndex(prev => prev > 0 ? prev - 1 : events.length - 1)
    }, [events.length])

    const handleNextBeat = useCallback(() => {
        // Go to start of next beat
        const currentBeatStart = Math.floor(currentEventIndex / SCENES_PER_BEAT) * SCENES_PER_BEAT
        const nextBeatStart = currentBeatStart + SCENES_PER_BEAT
        
        if (nextBeatStart < events.length) {
            setCurrentEventIndex(nextBeatStart)
        } else if (events.length > 0) {
            // Generate scenes until we hit the next beat? Or just go to next and it will generate.
            // For simplicity, let's just go one by one or we might need to generate 5 at once.
            // The user wants navigation to next beat. If we generate 5, they'll be there.
            handleNext()
        }
    }, [currentEventIndex, events.length, handleNext])

    const handlePrevBeat = useCallback(() => {
        const isCurrentlyAtBeatStart = currentEventIndex % SCENES_PER_BEAT === 0
        const currentBeatIndex = Math.floor(currentEventIndex / SCENES_PER_BEAT)
        
        let targetIndex: number
        if (isCurrentlyAtBeatStart) {
            targetIndex = Math.max(0, (currentBeatIndex - 1) * SCENES_PER_BEAT)
        } else {
            targetIndex = currentBeatIndex * SCENES_PER_BEAT
        }
        setCurrentEventIndex(targetIndex)
    }, [currentEventIndex])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPlaying) {
            interval = setInterval(() => {
                handleNext()
            }, 2000 / speed)
        }
        return () => clearInterval(interval)
    }, [isPlaying, speed, handleNext])

    const toggleSpeed = () => {
        const speeds = [0.5, 1, 1.5, 2]
        setSpeed(prev => {
            const idx = speeds.indexOf(prev)
            return speeds[(idx + 1) % speeds.length]
        })
    }

    const toggleCharacter = (id: string) => {
        setSelectedCharacterIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleAllCharacters = (select: boolean) => {
        setSelectedCharacterIds(select ? initialData.characters.map(c => c.id) : [])
    }

    const saveEditingFocus = useCallback(() => {
        setIsEditingFocus(false)
        if (editFocusValue.trim() && events[currentEventIndex] && editFocusValue !== events[currentEventIndex].label) {
            setEvents(prev => {
                const updated = [...prev]
                updated[currentEventIndex] = { ...updated[currentEventIndex], label: editFocusValue.trim() }
                saveStory({ ...initialData, places, characters, events: updated })
                return updated
            })
        }
    }, [editFocusValue, currentEventIndex, events, saveStory, initialData, places, characters])

    const handleUpdateEvent = useCallback((eventId: string, updates: { label: string; summary?: string }) => {
        setEvents(prev => {
            const updated = prev.map(ev =>
                ev.id === eventId ? { ...ev, label: updates.label, summary: updates.summary } : ev
            )
            saveStory({ ...initialData, places, characters, events: updated })
            return updated
        })
    }, [saveStory, initialData, places, characters])

    const handlePlaceMove = useCallback((placeId: string, x: number, y: number) => {
        const roundedX = Math.round(x * 10) / 10
        const roundedY = Math.round(y * 10) / 10

        setPlaces(prev => {
            const updatedPlaces = prev.map(p =>
                p.id === placeId ? { ...p, x: roundedX, y: roundedY } : p
            )
            saveStory({ ...initialData, places: updatedPlaces, characters, events })
            return updatedPlaces
        })
    }, [saveStory, initialData, characters, events])

    const handleAddPlace = useCallback((name: string, emoji: string) => {
        const newPlace = {
            id: `place-${Date.now()}`,
            name,
            emoji,
            type: 'location',
            x: 50 + (Math.random() * 10 - 5),
            y: 50 + (Math.random() * 10 - 5)
        }

        setPlaces(prev => {
            const updatedPlaces = [...prev, newPlace]
            saveStory({ ...initialData, places: updatedPlaces, characters, events })
            return updatedPlaces
        })
    }, [saveStory, initialData, characters, events])

    const handleUpdatePlace = useCallback((placeId: string, updates: { name: string, emoji: string }) => {
        setPlaces(prev => {
            const updatedPlaces = prev.map(p =>
                p.id === placeId ? { ...p, ...updates } : p
            )
            saveStory({ ...initialData, places: updatedPlaces, characters, events })
            return updatedPlaces
        })
    }, [saveStory, initialData, characters, events])

    const handleDeletePlace = useCallback((placeId: string) => {
        if (!confirm('Are you sure you want to delete this place?')) return
        setPlaces(prev => {
            const updatedPlaces = prev.filter(p => p.id !== placeId)
            saveStory({ ...initialData, places: updatedPlaces, characters, events })
            return updatedPlaces
        })
    }, [saveStory, initialData, characters, events])

    const handleAddCharacter = useCallback((name: string, color: string, initialPlaceId: string, initialFortune: number, initialEvolution: number) => {
        const newId = `char-${Date.now()}`
        const newChar = { id: newId, name, color }

        setCharacters(prev => {
            const updatedChars = [...prev, newChar]
            setSelectedCharacterIds(ids => [...ids, newId])

            setEvents(prevEvents => {
                const updatedEvents = prevEvents.map(ev => ({
                    ...ev,
                    characterEvolution: { ...ev.characterEvolution, [newId]: initialEvolution },
                    characterFortunes: { ...ev.characterFortunes, [newId]: initialFortune },
                    characterLocations: { ...ev.characterLocations, [newId]: initialPlaceId }
                }))

                saveStory({
                    ...initialData,
                    places,
                    characters: updatedChars,
                    events: updatedEvents
                })
                return updatedEvents
            })
            return updatedChars
        })
    }, [saveStory, initialData, places])
    const handleUpdateCharacter = useCallback((characterId: string, updates: { name: string, color: string }) => {
        setCharacters(prev => {
            const updatedChars = prev.map(c =>
                c.id === characterId ? { ...c, ...updates } : c
            )
            saveStory({ ...initialData, places, characters: updatedChars, events })
            return updatedChars
        })
    }, [saveStory, initialData, places, events])

    const handleDeleteCharacter = useCallback((characterId: string) => {
        if (!confirm('Are you sure you want to delete this character?')) return

        setCharacters(prev => {
            const updatedChars = prev.filter(c => c.id !== characterId)
            setSelectedCharacterIds(ids => ids.filter(id => id !== characterId))

            setEvents(prevEvents => {
                const updatedEvents = prevEvents.map(ev => {
                    const newEv = { ...ev }
                    const charLocs = { ...newEv.characterLocations }
                    delete charLocs[characterId]
                    newEv.characterLocations = charLocs

                    const charEvol = { ...newEv.characterEvolution }
                    delete charEvol[characterId]
                    newEv.characterEvolution = charEvol

                    const charFort = { ...newEv.characterFortunes }
                    delete charFort[characterId]
                    newEv.characterFortunes = charFort

                    return newEv
                })

                saveStory({
                    ...initialData,
                    places,
                    characters: updatedChars,
                    events: updatedEvents
                })
                return updatedEvents
            })
            return updatedChars
        })
    }, [saveStory, initialData, places])


    const storyData = useMemo(() => ({
        ...initialData,
        places,
        characters,
        events
    }), [initialData, places, characters, events])

    const currentEvent = storyData.events[currentEventIndex] || { label: 'The Void', id: 'void', characterLocations: {}, characterEvolution: {}, characterFortunes: {}, occurrences: { good: 0, bad: 0 }, placeStates: {}, placeFortunes: {}, timestamp: Date.now() } as StoryEvent

    return (
        <TooltipProvider>
            <div className="h-screen w-full overflow-hidden bg-background relative selection:bg-primary/20">
                {/* 1. Global Background Residue (Full Screen) */}
                <AnimatePresence>
                    {mapImageUrl && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
                        >
                            <motion.div
                                className="absolute inset-[-5%] bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${mapImageUrl})`,
                                    filter: `blur(${bgBlur * 3}px) saturate(1.8)`,
                                    opacity: bgOpacity * 0.3
                                }}
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-background/40 via-background/20 to-background/80" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 2. THE MAIN STAGE: Story World (Full Screen Background Layer) */}
                <div className="absolute inset-0 z-0">
                    <StoryWorld
                        data={storyData}
                        selectedCharacterIds={selectedCharacterIds}
                        currentEventIndex={currentEventIndex}
                        mapImageUrl={mapImageUrl}
                        opacity={bgOpacity}
                        onPlaceMove={handlePlaceMove}
                        onPlaceUpdate={handleUpdatePlace}
                        onPlaceDelete={handleDeletePlace}
                        onCharacterUpdate={handleUpdateCharacter}
                        onCharacterDelete={handleDeleteCharacter}
                    />
                </div>

                {/* 3. OVERLAYS: Top Navigation & Control */}
                <motion.header
                    initial={false}
                    animate={{
                        y: isHeaderCollapsed ? -110 : 0,
                        opacity: isHeaderCollapsed ? 0 : 1
                    }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    style={{ opacity: uiOpacity }}
                    className="absolute top-0 left-0 right-0 z-40"
                >
                    <div className="flex items-center gap-4 bg-background/80 backdrop-blur-lg border-b border-primary/10 px-8 py-3 h-[100px] shadow-2xl">
                        {/* Left: Branding */}
                        <div className="flex flex-col min-w-[200px]">
                            <h1 className="text-[16px] font-black uppercase tracking-tighter text-primary leading-tight">
                                QuickPlot Story Map
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">The Hidden Legacy</span>
                                <span className="text-[9px] text-primary/60 font-black">// {currentEvent?.label || 'Not Started'}</span>
                            </div>
                        </div>

                        {/* Center: Playback */}
                        <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-4 bg-background/40 px-6 py-2 rounded-full border border-white/5 shadow-inner scale-110">
                                <PlaybackControls
                                    isPlaying={isPlaying}
                                    speed={speed}
                                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                                    onToggleSpeed={toggleSpeed}
                                    onPrev={handlePrev}
                                    onNext={handleNext}
                                    onPrevBeat={handlePrevBeat}
                                    onNextBeat={handleNextBeat}
                                />
                                <div className="h-4 w-px bg-white/10 mx-1" />
                                <Badge variant="outline" className="text-[11px] py-0 border-none bg-transparent font-mono tabular-nums h-6 font-bold text-primary">
                                    {currentEventIndex + 1} <span className="opacity-30 px-0.5">/</span> {events.length}
                                </Badge>
                            </div>
                        </div>

                        {/* Right: Tools */}
                        <div className="flex items-center gap-4 min-w-[420px] justify-end border-l border-white/5 pl-6">
                            <MapImageUpload
                                onImageUpload={setMapImageUrl}
                                currentImageUrl={mapImageUrl}
                                opacity={bgOpacity}
                                onOpacityChange={setBgOpacity}
                                uiOpacity={uiOpacity}
                                onUiOpacityChange={setUiOpacity}
                                blur={bgBlur}
                                onBlurChange={setBgBlur}
                            />
                            <div className="h-10 w-px bg-white/5" />
                            <Button
                                variant={isSuggestionsOpen ? "secondary" : "outline"}
                                size="sm"
                                className="gap-2 border-primary/20 hover:bg-primary/10 transition-none"
                                onClick={() => {
                                    setIsSuggestionsOpen(prev => !prev)
                                    if (!isSuggestionsOpen) setIsSceneFlowOpen(false)
                                }}
                            >
                                <Sparkles className="size-4 text-primary" />
                                <span>Beats</span>
                            </Button>
                            <Button
                                variant={isSceneFlowOpen ? "secondary" : "outline"}
                                size="sm"
                                className="gap-2 border-primary/20 hover:bg-primary/10 transition-none"
                                onClick={() => {
                                    setIsSceneFlowOpen(prev => !prev)
                                    if (!isSceneFlowOpen) setIsSuggestionsOpen(false)
                                }}
                            >
                                <Navigation className="size-4 text-primary" />
                                <span>Flow</span>
                            </Button>
                            <div className="h-10 w-px bg-white/5" />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-none">
                                        <Plus className="size-4" />
                                        <span>Add Details</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2 flex flex-col gap-1 bg-background/95 backdrop-blur-md border-primary/20" align="start">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5 opacity-60">Spawn Entity</div>
                                    <AddCharacterDialog
                                        places={places.map(p => ({ id: p.id, name: p.name }))}
                                        onAdd={handleAddCharacter}
                                    />
                                    <AddPlaceDialog onAdd={handleAddPlace} />
                                </PopoverContent>
                            </Popover>
                            <div className="h-10 w-px bg-white/5" />
                            <CharacterControls
                                data={storyData}
                                selectedIds={selectedCharacterIds}
                                onToggle={toggleCharacter}
                                onToggleAll={toggleAllCharacters}
                            />
                            <div className="h-10 w-px bg-white/5" />
                            <StoryReference />
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => setIsHeaderCollapsed(true)}
                                className="ml-2 hover:bg-primary/10"
                            >
                                <ChevronUp className="size-4" />
                            </Button>
                        </div>
                    </div>
                </motion.header>

                {/* Header Restore Button */}
                <AnimatePresence>
                    {isHeaderCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
                        >
                            <Button
                                variant="secondary"
                                size="xs"
                                onClick={() => setIsHeaderCollapsed(false)}
                                className="rounded-full shadow-lg bg-background/80 backdrop-blur border border-primary/20 gap-2 px-4 uppercase font-black tracking-widest text-[8px]"
                            >
                                <ChevronDown className="size-3" />
                                Expand Controls
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 4. OVERLAYS: Bottom Analytics & Timeline */}
                <motion.footer
                    initial={false}
                    animate={{
                        y: isFooterCollapsed ? 200 : 0,
                        opacity: isFooterCollapsed ? 0 : 1
                    }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    style={{ opacity: uiOpacity }}
                    className="absolute bottom-4 left-4 right-4 z-40 space-y-3"
                >
                    {/* Timeline Layer */}
                    <div className="h-[40px] px-8 flex items-center bg-background/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                        <Timeline
                            data={initialData}
                            currentEventIndex={currentEventIndex}
                            onEventSelect={setCurrentEventIndex}
                            onEditEvent={setEditingEventIndex}
                        />
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setIsFooterCollapsed(true)}
                            className="ml-4 hover:bg-primary/10 shrink-0"
                        >
                            <ChevronDown className="size-4" />
                        </Button>
                    </div>

                    {/* Charts Layer */}
                    <div className="grid grid-cols-3 gap-3 h-[200px]">
                        <div className="bg-background/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-background/70 transition-colors shadow-2xl p-0">
                            <CharacterEvolutionChart
                                data={storyData}
                                selectedCharacterIds={selectedCharacterIds}
                                currentEventIndex={currentEventIndex}
                            />
                        </div>
                        <div className="bg-background/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-background/70 transition-colors shadow-2xl p-0 relative">
                            <EventsChart
                                data={storyData}
                                selectedCharacterIds={selectedCharacterIds}
                                currentEventIndex={currentEventIndex}
                            />
                        </div>
                        <div className="bg-background/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-background/70 transition-colors shadow-2xl p-0">
                            <PlaceStatesChart
                                data={storyData}
                                currentEventIndex={currentEventIndex}
                            />
                        </div>
                    </div>
                </motion.footer>

                {/* Footer Restore Button */}
                <AnimatePresence>
                    {isFooterCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50"
                        >
                            <Button
                                variant="secondary"
                                size="xs"
                                onClick={() => setIsFooterCollapsed(false)}
                                className="rounded-full shadow-lg bg-background/80 backdrop-blur border border-primary/20 gap-2 px-4 uppercase font-black tracking-widest text-[8px]"
                            >
                                <ChevronUp className="size-3" />
                                Expand Analytics
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 5. Floating HUD (Always visible info) */}
                <div className={`absolute left-6 z-30 transition-all duration-500`}
                    style={{
                        top: isHeaderCollapsed ? '2rem' : '120px',
                    }}
                >
                    <div className="bg-background/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 shadow-2xl flex flex-col gap-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">Current Focus</span>
                        {isEditingFocus ? (
                            <input
                                type="text"
                                value={editFocusValue}
                                onChange={(e) => setEditFocusValue(e.target.value)}
                                onBlur={saveEditingFocus}
                                onKeyDown={(e) => e.key === 'Enter' && saveEditingFocus()}
                                className="text-[12px] font-black text-foreground drop-shadow-sm bg-transparent border-b border-primary/50 outline-hidden w-48"
                                autoFocus
                            />
                        ) : (
                            <div className="group flex items-center gap-2 cursor-pointer" onClick={() => {
                                if (currentEvent) {
                                    setEditFocusValue(currentEvent.label)
                                    setIsEditingFocus(true)
                                }
                            }}>
                                <span className="text-[12px] font-black text-foreground drop-shadow-sm">{currentEvent?.label || 'The Beginning'}</span>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary">
                                    <Pencil className="size-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 6. Suggestions Card Panel */}
                <AnimatePresence>
                    {isSuggestionsOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute z-40 right-6 pointer-events-none"
                            style={{
                                top: isHeaderCollapsed ? '2rem' : '120px',
                            }}
                        >
                            <SceneSuggestionsCard
                                data={storyData}
                                currentEventIndex={currentEventIndex}
                                onClose={() => setIsSuggestionsOpen(false)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 7. Scene Flow Card Panel */}
                <AnimatePresence>
                    {isSceneFlowOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute z-40 right-6 pointer-events-none"
                            style={{
                                top: isHeaderCollapsed ? '2rem' : '120px',
                            }}
                        >
                            <SceneFlowCard
                                data={storyData}
                                currentEventIndex={currentEventIndex}
                                onClose={() => setIsSceneFlowOpen(false)}
                                onWrite={setEditingEventIndex}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <EditBeatDialog
                    event={editingEventIndex !== null ? storyData.events[editingEventIndex] : null}
                    onOpenChange={(open) => !open && setEditingEventIndex(null)}
                    onUpdate={(id, updates) => {
                        handleUpdateEvent(id, updates)
                        setEditingEventIndex(null)
                    }}
                />
            </div>
        </TooltipProvider>
    )
}
