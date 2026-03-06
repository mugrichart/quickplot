"use client"

import { useState, memo } from 'react'
import { Plus, UserPlus } from 'lucide-react'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AddCharacterDialogProps {
    places: { id: string, name: string }[]
    onAdd: (name: string, color: string, initialPlaceId: string, initialFortune: number, initialEvolution: number) => void
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

export const AddCharacterDialog = memo(function AddCharacterDialog({ places, onAdd }: AddCharacterDialogProps) {
    const [name, setName] = useState('')
    const [color, setColor] = useState(PRESET_COLORS[0].value)
    const [placeId, setPlaceId] = useState(places[0]?.id || '')
    const [fortune, setFortune] = useState(0)
    const [evolution, setEvolution] = useState(0)
    const [open, setOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !placeId) return

        onAdd(name, color, placeId, fortune, evolution)

        // Reset
        setName('')
        setColor(PRESET_COLORS[0].value)
        setPlaceId(places[0]?.id || '')
        setFortune(0)
        setEvolution(0)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 w-full justify-start hover:bg-primary/10 hover:text-primary transition-none">
                    <UserPlus className="size-4" />
                    <span>Add Character</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background border-primary/20 shadow-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Add New Character</DialogTitle>
                        <DialogDescription>
                            Introduce a new personality into your story world.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="char-name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Character Name
                            </Label>
                            <Input
                                id="char-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Sir Galahad"
                                className="bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="char-fortune" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    Starting Fortune
                                </Label>
                                <Input
                                    id="char-fortune"
                                    type="number"
                                    value={fortune}
                                    onChange={(e) => setFortune(parseInt(e.target.value) || 0)}
                                    className="bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="char-evolution" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    Starting Evolution
                                </Label>
                                <Input
                                    id="char-evolution"
                                    type="number"
                                    value={evolution}
                                    onChange={(e) => setEvolution(parseInt(e.target.value) || 0)}
                                    className="bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Initial Place
                            </Label>
                            <Select value={placeId} onValueChange={setPlaceId} required>
                                <SelectTrigger className="bg-background/50 border-primary/10">
                                    <SelectValue placeholder="Select a place" />
                                </SelectTrigger>
                                <SelectContent>
                                    {places.map(p => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            Spawn Character
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
})
