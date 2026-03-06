"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { StoryData } from '@/types/story'
import { CharacterEvolutionChart } from './CharacterEvolutionChart'
import { EventsChart } from './EventsChart'
import { StoryWorld } from './StoryWorld'
import { Timeline } from './Timeline'
import { PlaybackControls } from './PlaybackControls'
import { CharacterControls } from './CharacterControls'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Maximize2, Minimize2, PanelBottomClose, PanelTopClose } from 'lucide-react'

import { PlaceStatesChart } from './PlaceStatesChart'
import { MapImageUpload } from './MapImageUpload'
import { StoryReference } from './StoryReference'
import { AnimatePresence, motion } from 'framer-motion'

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

    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
    const [isFooterCollapsed, setIsFooterCollapsed] = useState(false)

    const handleNext = useCallback(() => {
        setCurrentEventIndex(prev => (prev + 1) % initialData.events.length)
    }, [initialData.events.length])

    const handlePrev = useCallback(() => {
        setCurrentEventIndex(prev => (prev - 1 + initialData.events.length) % initialData.events.length)
    }, [initialData.events.length])

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

    const currentEvent = initialData.events[currentEventIndex]

    return (
        <div className="h-screen w-screen overflow-hidden bg-background relative selection:bg-primary/20">
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
                                filter: `blur(${bgBlur * 4}px) saturate(1.8)`,
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
                    data={initialData}
                    selectedCharacterIds={selectedCharacterIds}
                    currentEventIndex={currentEventIndex}
                    mapImageUrl={mapImageUrl}
                    opacity={bgOpacity}
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
                <div className="flex items-center gap-4 bg-background/60 backdrop-blur-xl border-b border-primary/10 px-8 py-3 h-[100px] shadow-2xl">
                    {/* Left: Branding */}
                    <div className="flex flex-col min-w-[200px]">
                        <h1 className="text-[16px] font-black uppercase tracking-tighter text-primary leading-tight">
                            QuickPlot Story Map
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">The Hidden Legacy</span>
                            <span className="text-[9px] text-primary/60 font-black">// {currentEvent.label}</span>
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
                            />
                            <div className="h-4 w-px bg-white/10 mx-1" />
                            <Badge variant="outline" className="text-[11px] py-0 border-none bg-transparent font-mono tabular-nums h-6 font-bold text-primary">
                                {currentEventIndex + 1} <span className="opacity-30 px-0.5">/</span> {initialData.events.length}
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
                        <CharacterControls
                            data={initialData}
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
                            data={initialData}
                            selectedCharacterIds={selectedCharacterIds}
                            currentEventIndex={currentEventIndex}
                        />
                    </div>
                    <div className="bg-background/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-background/70 transition-colors shadow-2xl p-0 relative">
                        <EventsChart
                            data={initialData}
                            selectedCharacterIds={selectedCharacterIds}
                            currentEventIndex={currentEventIndex}
                        />
                    </div>
                    <div className="bg-background/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-background/70 transition-colors shadow-2xl p-0">
                        <PlaceStatesChart
                            data={initialData}
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
                <div className="bg-background/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 shadow-2xl flex flex-col gap-0.5 pointer-events-none">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">Current Focus</span>
                    <span className="text-[12px] font-black text-foreground drop-shadow-sm">{currentEvent.label}</span>
                </div>
            </div>
        </div>
    )
}
