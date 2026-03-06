"use client"

import { useState, memo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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

interface EditPlaceDialogProps {
    place: { id: string; name: string; emoji: string } | null
    onOpenChange: (open: boolean) => void
    onUpdate: (id: string, updates: { name: string, emoji: string }) => void
}

export const EditPlaceDialog = memo(function EditPlaceDialog({ place, onOpenChange, onUpdate }: EditPlaceDialogProps) {
    const [name, setName] = useState('')
    const [emoji, setEmoji] = useState('')

    useEffect(() => {
        if (place) {
            setName(place.name)
            setEmoji(place.emoji)
        }
    }, [place])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !place) return

        onUpdate(place.id, { name, emoji })
        onOpenChange(false)
    }

    return (
        <Dialog open={!!place} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-background border-primary/20 shadow-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Edit Place</DialogTitle>
                        <DialogDescription>
                            Update the name or emoji for this location.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Place Name
                            </Label>
                            <Input
                                id="edit-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Whispering Woods"
                                className="bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-emoji" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex justify-between items-center">
                                <span>Select Emoji</span>
                                <span className="text-[8px] font-bold text-primary/60 lowercase italic">Press Win + . for more</span>
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="edit-emoji"
                                    value={emoji}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val.length > 0) {
                                            const chars = Array.from(val);
                                            setEmoji(chars[chars.length - 1]);
                                        }
                                    }}
                                    className="text-2xl h-14 text-center bg-background/50 border-primary/10 transition-all focus:border-primary/40 focus:ring-primary/20 hover:border-primary/20"
                                    placeholder="Click and press Win + ."
                                />
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                                    <span className="text-[10px] font-black border border-current rounded px-1">⊞ + .</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full font-black uppercase tracking-widest">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
})
