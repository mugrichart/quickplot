"use client"

import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

interface Props {
    isPlaying: boolean
    onTogglePlay: () => void
    onPrev: () => void
    onNext: () => void
}

export function PlaybackControls({ isPlaying, onTogglePlay, onPrev, onNext }: Props) {
    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onPrev}>
                <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" onClick={onTogglePlay} className="h-10 w-10">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
            </Button>
            <Button variant="outline" size="icon" onClick={onNext}>
                <SkipForward className="h-4 w-4" />
            </Button>
        </div>
    )
}
