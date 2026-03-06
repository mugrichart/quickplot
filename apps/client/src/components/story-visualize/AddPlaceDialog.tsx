"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const EMOJI_OPTIONS = [
    "🏠", "🏰", "🏙️", "🌲", "🏔️", "🌊", "🌋", "🛖", "🏫", "🏭",
    "🛤️", "🏴‍☠️", "🛸", "🪐", "⛩️", "🏛️", "🏟️", "🏜️", "🏝️", "🏕️"
]

interface AddPlaceDialogProps {
    onAdd: (name: string, emoji: string) => void
}

export function AddPlaceDialog({ onAdd }: AddPlaceDialogProps) {
    const [name, setName] = useState('')
    const [emoji, setEmoji] = useState('🏠')
    const [open, setOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        onAdd(name, emoji)
        setName('')
        setEmoji('🏠')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary">
                    <Plus className="size-4" />
                    <span>Add New Place</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-primary/20">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Add New Place</DialogTitle>
                        <DialogDescription>
                            Create a new location in your story world. It will be placed near the center.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Place Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Whispering Woods"
                                className="bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Select Emoji
                            </Label>
                            <div className="grid grid-cols-5 gap-2">
                                {EMOJI_OPTIONS.map((e) => (
                                    <button
                                        key={e}
                                        type="button"
                                        onClick={() => setEmoji(e)}
                                        className={`text-2xl p-2 rounded-lg transition-all ${emoji === e
                                                ? 'bg-primary/20 scale-110 border border-primary/40'
                                                : 'hover:bg-primary/5 border border-transparent'
                                            }`}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full font-black uppercase tracking-widest">
                            Create Place
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
