"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { StoryData } from '@/types/story'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
    data: StoryData
    selectedCharacterIds: string[]
    currentEventIndex: number
}

export function StoryWorld({ data, selectedCharacterIds, currentEventIndex }: Props) {
    const currentEvent = data.events[currentEventIndex]

    // Calculate character positions based on their place
    const charactersToRender = data.characters
        .filter(c => selectedCharacterIds.includes(c.id))
        .map(char => {
            const placeId = currentEvent.characterLocations[char.id]
            const place = data.places.find(p => p.id === placeId)

            // Calculate offset for overlapping characters
            const charsInThisPlace = Object.entries(currentEvent.characterLocations)
                .filter(([cid, pid]) => pid === placeId && selectedCharacterIds.includes(cid))
                .map(([cid]) => cid)

            const charIndex = charsInThisPlace.indexOf(char.id)
            const offset = charIndex * 12

            return {
                ...char,
                x: place ? place.x : 0,
                y: place ? place.y : 0,
                offset,
                placeCount: charsInThisPlace.length
            }
        })

    return (
        <Card className="h-full relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 border-dashed">
            <CardContent className="h-full p-0 relative">
                {/* Layer 1: Places (Static Background) */}
                {data.places.map((place) => (
                    <div
                        key={place.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                        style={{ left: `${place.x}%`, top: `${place.y}%` }}
                    >
                        <div className="text-3xl mb-1 filter drop-shadow-md select-none">
                            {place.emoji}
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            {place.name}
                        </span>
                    </div>
                ))}

                {/* Layer 2: Characters (Animated Layer) */}
                <div className="absolute inset-0">
                    {charactersToRender.map((char) => (
                        <TooltipProvider key={char.id}>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <motion.div
                                        // Simple animate block for x/y percentages
                                        animate={{
                                            left: `${char.x}%`,
                                            top: `${char.y}%`,
                                        }}
                                        // Tween transition for a smooth, purposeful path movement
                                        transition={{
                                            type: "tween",
                                            ease: "easeInOut",
                                            duration: 0.8 // Nearly a second to clearly see the travel path
                                        }}
                                        className="absolute w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-xl pointer-events-auto cursor-pointer flex items-center justify-center"
                                        style={{
                                            backgroundColor: char.color,
                                            // Combine centering with the overlap offset
                                            transform: `translate(calc(-50% + ${char.offset - (char.placeCount - 1) * 6}px), 25px)`
                                        }}
                                    >
                                        {/* Add a tiny pulse to show movement */}
                                        <div className="w-full h-full rounded-full animate-pulse opacity-30 bg-white" />
                                    </motion.div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs font-bold">{char.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
