"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { StoryData, Character, Place } from '@/types/story'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
    data: StoryData
    selectedCharacterIds: string[]
    currentEventIndex: number
}

export function StoryWorld({ data, selectedCharacterIds, currentEventIndex }: Props) {
    const currentEvent = data.events[currentEventIndex]

    // Calculate character clusters in places
    const placeContents: Record<string, string[]> = {}

    Object.entries(currentEvent.characterLocations).forEach(([charId, placeId]) => {
        if (selectedCharacterIds.includes(charId)) {
            if (!placeContents[placeId]) placeContents[placeId] = []
            placeContents[placeId].push(charId)
        }
    })

    return (
        <Card className="h-full relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 border-dashed">
            <CardContent className="h-full p-0 relative">
                {/* Render Places */}
                {data.places.map((place) => (
                    <div
                        key={place.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                        style={{ left: `${place.x}%`, top: `${place.y}%` }}
                    >
                        <div className="text-3xl mb-1 filter drop-shadow-md select-none">
                            {place.emoji}
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            {place.name}
                        </span>

                        {/* Render Characters in this place */}
                        <div className="flex -space-x-1 mt-2">
                            <AnimatePresence mode="popLayout">
                                {placeContents[place.id]?.map((charId) => {
                                    const char = data.characters.find(c => c.id === charId)
                                    if (!char) return null
                                    return (
                                        <TooltipProvider key={charId}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <motion.div
                                                        layoutId={`char-${charId}`}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                        className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                                                        style={{ backgroundColor: char.color }}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-xs font-bold">{char.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
