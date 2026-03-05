"use client"

import { StoryData } from '@/types/story'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
    data: StoryData
    currentEventIndex: number
    onEventSelect: (index: number) => void
}

export function Timeline({ data, currentEventIndex, onEventSelect }: Props) {
    return (
        <div className="relative w-full py-4 px-2">
            {/* The Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2" />

            {/* Active Line Progress */}
            <div
                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300"
                style={{ width: `${(currentEventIndex / (data.events.length - 1)) * 100}%` }}
            />

            <div className="relative flex justify-between items-center w-full px-1">
                {data.events.map((event, index) => (
                    <TooltipProvider key={event.id}>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => onEventSelect(index)}
                                    className={cn(
                                        "w-3 h-3 rounded-full border-2 transition-all duration-200 hover:scale-125 z-10",
                                        index <= currentEventIndex
                                            ? "bg-primary border-primary scale-110"
                                            : "bg-background border-muted"
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs font-bold">{event.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
        </div>
    )
}
