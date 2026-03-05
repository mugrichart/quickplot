"use client"

import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

interface Props {
    isPlaying: boolean
    speed: number
    onTogglePlay: () => void
    onToggleSpeed: () => void
    onPrev: () => void
    onNext: () => void
}

export function PlaybackControls({ isPlaying, speed, onTogglePlay, onToggleSpeed, onPrev, onNext }: Props) {
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
                <Button variant="ghost" size="icon" onClick={onPrev} className="h-8 w-8">
                    <SkipBack className="h-3 w-3" />
                </Button>
                <Button variant="default" size="icon" onClick={onTogglePlay} className="h-9 w-9">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8">
                    <SkipForward className="h-3 w-3" />
                </Button>
            </div>
        </div>
    )
}
