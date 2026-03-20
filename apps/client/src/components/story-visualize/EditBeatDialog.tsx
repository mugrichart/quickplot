"use client"

import { useState, memo, useEffect } from 'react'
import { StoryEvent } from '@/types/story'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface EditBeatDialogProps {
    event: StoryEvent | null
    onOpenChange: (open: boolean) => void
    onUpdate: (id: string, updates: { label: string; summary?: string }) => void
}

export const EditBeatDialog = memo(function EditBeatDialog({ event, onOpenChange, onUpdate }: EditBeatDialogProps) {
    const [label, setLabel] = useState('')
    const [summary, setSummary] = useState('')

    useEffect(() => {
        if (event) {
            setLabel(event.label)
            setSummary(event.summary || '')
        }
    }, [event])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!event || !label.trim()) return

        onUpdate(event.id, { label: label.trim(), summary: summary.trim() || undefined })
    }

    return (
        <Dialog open={!!event} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-background border-primary/20 shadow-2xl z-100">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Edit Story Beat</DialogTitle>
                        <DialogDescription>
                            Document the significance of this pivotal moment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="beat-label" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Beat Title
                            </Label>
                            <Input
                                id="beat-label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20"
                                required
                                autoFocus
                            />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="beat-summary" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Beat Summary
                            </Label>
                            <Textarea
                                id="beat-summary"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                className="min-h-[100px] resize-none bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20"
                                placeholder="What profound shift occurs during this exact event?"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full font-black uppercase tracking-widest">
                            Save Beat
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
})
