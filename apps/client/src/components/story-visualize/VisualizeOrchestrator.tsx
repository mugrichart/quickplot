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
        <div className="h-screen flex flex-col bg-background overflow-hidden p-4 gap-4">
            {/* Top Section: Timeline + Playback (approx 8%) */}
            <div className="flex items-center gap-6 h-[8%] border rounded-lg px-4 bg-muted/10">
                <div className="flex-1">
                    <Timeline
                        data={initialData}
                        currentEventIndex={currentEventIndex}
                        onEventSelect={setCurrentEventIndex}
                    />
                </div>
                <div className="flex items-center gap-4 border-l pl-6">
                    <Badge variant="outline" className="text-[10px] py-0 whitespace-nowrap">
                        Step {currentEventIndex + 1} / {initialData.events.length}
                    </Badge>
                    <PlaybackControls
                        isPlaying={isPlaying}
                        speed={speed}
                        onTogglePlay={() => setIsPlaying(!isPlaying)}
                        onToggleSpeed={toggleSpeed}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                </div>
            </div>

            {/* Middle Section: Charts (approx 22%) */}
            <div className="grid grid-cols-2 gap-4 h-[22%]">
                {/* Box 1: Character Evolution */}
                <div className="border rounded-lg bg-card/30">
                    <CharacterEvolutionChart
                        data={initialData}
                        selectedCharacterIds={selectedCharacterIds}
                        currentEventIndex={currentEventIndex}
                    />
                </div>
                {/* Box 2: Opportunity vs Bad */}
                <div className="border rounded-lg bg-card/30">
                    <EventsChart
                        data={initialData}
                        selectedCharacterIds={selectedCharacterIds}
                        currentEventIndex={currentEventIndex}
                    />
                </div>
            </div>

            {/* Bottom Section: Story World (approx 68% - spans the rest) */}
            <div className="flex-1 min-h-0 relative">
                <Card className="h-full flex flex-col overflow-hidden">
                    <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
                        <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            Story World <span className="text-foreground">— {currentEvent.label}</span>
                        </h2>
                        <div className="flex items-center gap-4">
                            <CharacterControls
                                data={initialData}
                                selectedIds={selectedCharacterIds}
                                onToggle={toggleCharacter}
                                onToggleAll={toggleAllCharacters}
                            />
                        </div>
                    </div>
                    <div className="flex-1 relative bg-slate-50/30 dark:bg-slate-900/10">
                        <StoryWorld
                            data={initialData}
                            selectedCharacterIds={selectedCharacterIds}
                            currentEventIndex={currentEventIndex}
                        />

                        {/* Context Tooltip/Badge instead of full card to save space */}
                        <div className="absolute top-4 left-4 pointer-events-none">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur px-3 py-1 text-[10px] border">
                                Focus: {currentEvent.label}
                            </Badge>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
