"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { StoryData } from '@/types/story'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
    data: StoryData
    selectedCharacterIds: string[]
    currentEventIndex: number
    mapImageUrl: string | null
    opacity: number
}

export function StoryWorld({ data, selectedCharacterIds, currentEventIndex, mapImageUrl, opacity }: Props) {
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
        <div className="h-full w-full relative overflow-hidden transition-all duration-700">
            {/* Layer 0: World Map Image */}
            <AnimatePresence mode="wait">
                {mapImageUrl && (
                    <motion.div
                        key={mapImageUrl}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0 bg-transparent flex items-center justify-center p-12"
                    >
                        <div
                            className="w-full h-full bg-contain bg-center bg-no-repeat transition-all duration-700"
                            style={{
                                backgroundImage: `url(${mapImageUrl})`,
                                opacity: opacity
                            }}
                        />
                        {/* Subtle vignette/gradient to keep UI readable */}
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/5 to-background/20 pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)] pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Layer 1: Places (Static Background) */}
            {data.places.map((place) => (
                <div
                    key={place.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                    style={{ left: `${place.x}%`, top: `${place.y}%` }}
                >
                    <div className="text-4xl mb-1 filter drop-shadow-xl select-none transition-transform hover:scale-110">
                        {place.emoji}
                    </div>
                    <span className="text-[10px] font-black text-foreground/80 uppercase tracking-widest drop-shadow-sm bg-background/20 backdrop-blur-[1px] px-1.5 rounded">
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
                                    animate={{
                                        left: `${char.x}%`,
                                        top: `${char.y}%`,
                                    }}
                                    transition={{
                                        type: "tween",
                                        ease: "easeInOut",
                                        duration: 0.8
                                    }}
                                    className="absolute w-5 h-5 rounded-full border-2 border-white dark:border-background shadow-2xl pointer-events-auto cursor-pointer flex items-center justify-center z-20"
                                    style={{
                                        backgroundColor: char.color,
                                        transform: `translate(calc(-50% + ${char.offset - (char.placeCount - 1) * 6}px), 30px)`
                                    }}
                                >
                                    <div className="w-full h-full rounded-full animate-pulse opacity-40 bg-white" />
                                </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-background/95 backdrop-blur border-primary/20">
                                <p className="text-xs font-black uppercase tracking-tight">{char.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
        </div>
    )
}
