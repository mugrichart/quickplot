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
            }, 2000)
        }
        return () => clearInterval(interval)
    }, [isPlaying, handleNext])

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
        <div className="flex flex-col gap-6 max-w-7xl mx-auto p-6 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Story Visualize</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] py-0">{currentEventIndex + 1} / {initialData.events.length}</Badge>
                        Exploration of &quot;{currentEvent.label}&quot;
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <PlaybackControls
                        isPlaying={isPlaying}
                        onTogglePlay={() => setIsPlaying(!isPlaying)}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                </div>
            </div>

            {/* Grid: 2 at the top, and one spanning the two at the bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
                {/* Box 1: Character Evolution */}
                <CharacterEvolutionChart
                    data={initialData}
                    selectedCharacterIds={selectedCharacterIds}
                    currentEventIndex={currentEventIndex}
                />
                {/* Box 2: Opportunity vs Bad */}
                <EventsChart
                    data={initialData}
                    currentEventIndex={currentEventIndex}
                />
            </div>

            {/* Box 3: Story World (Spanning bottom) */}
            <Card className="min-h-[600px] flex flex-col">
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider">Story World</h2>
                    <div className="flex items-center gap-4">
                        <CharacterControls
                            data={initialData}
                            selectedIds={selectedCharacterIds}
                            onToggle={toggleCharacter}
                            onToggleAll={toggleAllCharacters}
                        />
                    </div>
                </div>
                <div className="flex-1 relative">
                    <StoryWorld
                        data={initialData}
                        selectedCharacterIds={selectedCharacterIds}
                        currentEventIndex={currentEventIndex}
                    />

                    {/* Legend/Intel Overlay */}
                    <div className="absolute bottom-4 left-4 max-w-xs space-y-4 pointer-events-none">
                        <Card className="bg-background/80 backdrop-blur pointer-events-auto">
                            <CardContent className="p-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Observation</h4>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    Narrative focus: <span className="font-semibold text-foreground">{currentEvent.label}</span>.
                                    Observe character alignments and presence in {Object.keys(currentEvent.characterLocations).length} locations.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Card>

            {/* Bottom Section: Timeline */}
            <Card className="mt-2">
                <CardContent className="p-2">
                    <Timeline
                        data={initialData}
                        currentEventIndex={currentEventIndex}
                        onEventSelect={setCurrentEventIndex}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
