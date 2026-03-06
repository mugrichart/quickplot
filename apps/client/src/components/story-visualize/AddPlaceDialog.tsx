"use client"

import { useState, memo } from 'react'
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

interface AddPlaceDialogProps {
    onAdd: (name: string, emoji: string) => void
}

export const AddPlaceDialog = memo(function AddPlaceDialog({ onAdd }: AddPlaceDialogProps) {
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
                <Button variant="ghost" size="sm" className="gap-2 w-full justify-start hover:bg-primary/10 hover:text-primary transition-none">
                    <Plus className="size-4" />
                    <span>Add Place</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background border-primary/20 shadow-2xl">
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
                            <Label htmlFor="emoji" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex justify-between items-center">
                                <span>Select Emoji</span>
                                <span className="text-[8px] font-bold text-primary/60 lowercase italic">Press Win + . for more</span>
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="emoji"
                                    value={emoji}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Take the last character/emoji entered
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
                            Create Place
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
})
