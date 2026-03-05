"use client"

import { useState, useEffect, useCallback } from 'react'
import { StoryData } from '@/types/story'
import { CharacterEvolutionChart } from './CharacterEvolutionChart'
import { EventsChart } from './EventsChart'
import { StoryWorld } from './StoryWorld'
import { Timeline } from './Timeline'
import { PlaybackControls } from './PlaybackControls'
import { CharacterControls } from './CharacterControls'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'

import { StoryReference } from './StoryReference'

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
        <div className="h-screen flex flex-col bg-background overflow-hidden p-3 gap-3">
            {/* 1. Global Navbar (Story Info + Central Playback + Character Focus) */}
            <header className="flex items-center border rounded-xl px-6 py-2 bg-muted/10 h-[90px] shrink-0 shadow-sm backdrop-blur-sm relative">
                {/* Left: Branding & Story Info */}
                <div className="flex flex-col min-w-[220px]">
                    <h1 className="text-[18px] font-black uppercase tracking-tight text-primary leading-tight">
                        QuickPlot Story Map
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                            The Hidden Legacy
                        </span>
                        <span className="text-[10px] text-primary/40 font-black">
                            // {currentEvent.label}
                        </span>
                    </div>
                </div>

                {/* Center: Playback Controls (The Main Command) */}
                <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-4 bg-background border px-6 py-2 rounded-full shadow-md border-primary/20 scale-110">
                        <PlaybackControls
                            isPlaying={isPlaying}
                            speed={speed}
                            onTogglePlay={() => setIsPlaying(!isPlaying)}
                            onToggleSpeed={toggleSpeed}
                            onPrev={handlePrev}
                            onNext={handleNext}
                        />
                        <div className="h-4 w-px bg-border/50 mx-1" />
                        <Badge variant="outline" className="text-[11px] py-0 border-none bg-transparent font-mono tabular-nums h-6 font-bold">
                            {currentEventIndex + 1} <span className="opacity-40 px-0.5">/</span> {initialData.events.length}
                        </Badge>
                    </div>
                </div>

                {/* Right: Character Focus Grid & Reference */}
                <div className="flex items-center gap-6 min-w-[420px] justify-end border-l border-primary/5 pl-6">
                    <CharacterControls
                        data={initialData}
                        selectedIds={selectedCharacterIds}
                        onToggle={toggleCharacter}
                        onToggleAll={toggleAllCharacters}
                    />
                    <div className="h-12 w-px bg-border/30" />
                    <StoryReference />
                </div>
            </header>

            {/* 2. Story World (Full Color, No Dimming) */}
            <main className="flex-3 min-h-0 relative">
                <Card className="h-full border border-primary/10 shadow-sm bg-background overflow-hidden rounded-xl">
                    <div className="absolute inset-0 z-0">
                        <StoryWorld
                            data={initialData}
                            selectedCharacterIds={selectedCharacterIds}
                            currentEventIndex={currentEventIndex}
                        />
                    </div>
                    {/* Floating HUD info */}
                    <div className="absolute bottom-4 left-4 pointer-events-none z-10">
                        <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/10 shadow-sm flex flex-col gap-0.5">
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">Current Focus</span>
                            <span className="text-[10px] font-bold text-foreground">{currentEvent.label}</span>
                        </div>
                    </div>
                </Card>
            </main>

            {/* 3. Timeline (Transition layer) */}
            <div className="h-[40px] px-8 flex items-center bg-muted/5 rounded-xl border border-transparent shrink-0">
                <Timeline
                    data={initialData}
                    currentEventIndex={currentEventIndex}
                    onEventSelect={setCurrentEventIndex}
                />
            </div>

            {/* 4. Bottom Section: Analytics */}
            <footer className="flex-[1.2] grid grid-cols-2 gap-3 min-h-0">
                <div className="border border-primary/5 rounded-xl bg-card/10 backdrop-blur-[2px] overflow-hidden hover:bg-card/20 transition-colors">
                    <CharacterEvolutionChart
                        data={initialData}
                        selectedCharacterIds={selectedCharacterIds}
                        currentEventIndex={currentEventIndex}
                    />
                </div>
                <div className="border border-primary/5 rounded-xl bg-card/10 backdrop-blur-[2px] overflow-hidden hover:bg-card/20 transition-colors">
                    <EventsChart
                        data={initialData}
                        selectedCharacterIds={selectedCharacterIds}
                        currentEventIndex={currentEventIndex}
                    />
                </div>
            </footer>
        </div>
    )
}
