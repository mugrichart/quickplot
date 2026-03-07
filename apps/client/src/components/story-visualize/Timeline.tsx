"use client"

import { memo } from 'react'
import { StoryData } from '@/types/story'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
    data: StoryData
    currentEventIndex: number
    onEventSelect: (index: number) => void
}

export const Timeline = memo(function Timeline({ data, currentEventIndex, onEventSelect }: Props) {
    return (
        <div className="relative w-full py-4 px-2">
            {/* The Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-muted/30 -translate-y-1/2" />

            {/* Active Line Progress */}
            <div
                className="absolute top-1/2 left-0 h-px bg-primary/30 -translate-y-1/2 transition-all duration-300"
                style={{ width: `${data.events.length > 1 ? (currentEventIndex / (data.events.length - 1)) * 100 : 0}%` }}
            />

            <div className="relative flex justify-between items-center w-full px-1">
                {data.events.map((event, index) => (
                    <Tooltip key={event.id} delayDuration={0}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => onEventSelect(index)}
                                className={cn(
                                    "w-2 h-2 rounded-full border transition-all duration-200 hover:scale-125 z-10",
                                    index === currentEventIndex
                                        ? "bg-primary border-primary scale-150 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                        : index < currentEventIndex
                                            ? "bg-primary/40 border-primary/40"
                                            : "bg-background border-muted/40"
                                )}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs font-bold">{event.label}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </div>
    )
})
