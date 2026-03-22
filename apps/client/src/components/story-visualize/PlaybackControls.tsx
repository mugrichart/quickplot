"use client"

import { Button } from '@/components/ui/button'
import { Play, Pause, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface Props {
    isPlaying: boolean
    speed: number
    onTogglePlay: () => void
    onToggleSpeed: () => void
    onPrev: () => void
    onNext: () => void
    onPrevBeat: () => void
    onNextBeat: () => void
}

export function PlaybackControls({ 
    isPlaying, 
    speed, 
    onTogglePlay, 
    onToggleSpeed, 
    onPrev, 
    onNext,
    onPrevBeat,
    onNextBeat
}: Props) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSpeed}
                className="text-[10px] h-8 w-12 font-bold bg-muted/50 hover:bg-muted"
            >
                {speed}x
            </Button>
            <div className="flex items-center gap-1 border-l pl-2">
                <Button variant="ghost" size="icon" onClick={onPrevBeat} className="h-8 w-8" title="Previous Beat (Shift+Left)">
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onPrev} className="h-8 w-8" title="Previous Scene (Left)">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="default" size="icon" onClick={onTogglePlay} className="h-9 w-9">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8" title="Next Scene (Right)">
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onNextBeat} className="h-8 w-8" title="Next Beat (Shift+Right)">
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
