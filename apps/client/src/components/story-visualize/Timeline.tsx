"use client"

import { memo } from 'react'
import { StoryData } from '@/types/story'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
    data: StoryData
    currentEventIndex: number
    onEventSelect: (index: number) => void
    onEditEvent?: (index: number) => void
}

export const Timeline = memo(function Timeline({ data, currentEventIndex, onEventSelect, onEditEvent }: Props) {
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
                                onClick={() => {
                                    if (currentEventIndex === index) {
                                        onEditEvent?.(index)
                                    } else {
                                        onEventSelect(index)
                                    }
                                }}
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
                        <TooltipContent className="flex flex-col gap-1 max-w-[200px] bg-background/95 backdrop-blur border border-primary/20 text-foreground shadow-2xl p-3 z-50">
                            <p className="text-xs font-black uppercase tracking-tight text-primary drop-shadow-sm">{event.label}</p>
                            {event.summary && (
                                <p className="text-[10px] text-muted-foreground whitespace-pre-wrap leading-relaxed">{event.summary}</p>
                            )}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </div>
    )
})
