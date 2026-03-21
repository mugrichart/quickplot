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
            <DialogContent className="sm:max-w-[800px] h-[85vh] flex flex-col bg-background border-primary/20 shadow-2xl z-100 p-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <DialogHeader className="px-6 py-4 border-b border-primary/10 bg-muted/5">
                        <DialogTitle className="text-xl font-bold tracking-tight">Draft Story Beat</DialogTitle>
                        <DialogDescription className="text-muted-foreground/60 text-xs italic">
                            Transform your visualization into narrative reality.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-hidden p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="beat-label" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Working Title
                            </Label>
                            <Input
                                id="beat-label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="text-lg font-bold bg-muted/20 border-primary/10 px-3 placeholder:text-muted-foreground/20"
                                placeholder="The Midnight Encounter..."
                                required
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-2 min-h-0">
                            <Label htmlFor="beat-summary" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Narrative Summary / Scene Draft
                            </Label>
                            <Textarea
                                id="beat-summary"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                className="flex-1 w-full text-lg leading-relaxed bg-muted/20 border-primary/10 focus-visible:ring-primary/20 resize-none p-4 overflow-y-auto custom-scrollbar"
                                placeholder="Describe the profound shifts, sensory details, and narrative weight of this moment..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t border-primary/10 bg-muted/5 flex items-center gap-3">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => onOpenChange(false)}
                            className="font-bold uppercase tracking-widest text-[10px] opacity-60 hover:opacity-100"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="min-w-[140px] font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20 active:scale-95 transition-all h-11">
                            Save Beat
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
})
