"use client"

import { useState, memo, useEffect } from 'react'
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

interface EditCharacterDialogProps {
    character: { id: string; name: string; color: string } | null
    onOpenChange: (open: boolean) => void
    onUpdate: (id: string, updates: { name: string; color: string }) => void
}

const PRESET_COLORS = [
    { name: 'Sky Blue', value: '#3b82f6' },
    { name: 'Rose Red', value: '#ef4444' },
    { name: 'Emerald Green', value: '#10b981' },
    { name: 'Amber Glow', value: '#f59e0b' },
    { name: 'Mystic Purple', value: '#a855f7' },
    { name: 'Pink Frost', value: '#ec4899' },
    { name: 'Cyan Wave', value: '#06b6d4' },
    { name: 'Slate Gray', value: '#64748b' },
]

export const EditCharacterDialog = memo(function EditCharacterDialog({ character, onOpenChange, onUpdate }: EditCharacterDialogProps) {
    const [name, setName] = useState('')
    const [color, setColor] = useState('')

    useEffect(() => {
        if (character) {
            setName(character.name)
            setColor(character.color)
        }
    }, [character])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!character || !name.trim() || !color.trim()) return

        onUpdate(character.id, { name, color })
    }

    return (
        <Dialog open={!!character} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-background border-primary/20 shadow-2xl z-100">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Edit Character</DialogTitle>
                        <DialogDescription>
                            Modify character details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-char-name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Character Name
                            </Label>
                            <Input
                                id="edit-char-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Character Color Theme
                            </Label>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {PRESET_COLORS.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setColor(c.value)}
                                        className={`size-8 rounded-full border-2 transition-all hover:scale-110 ${color === c.value ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-lg' : 'border-transparent opacity-60'
                                            }`}
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    />
                                ))}
                                <div className="relative size-8 rounded-full border-2 border-primary/10 overflow-hidden ring-offset-2 hover:scale-110 transition-transform">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="absolute inset-[-50%] size-[200%] cursor-pointer"
                                    />
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
