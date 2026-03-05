"use client"

import { Checkbox } from '@/components/ui/checkbox'
import { StoryData } from '@/types/story'
import { Badge } from '@/components/ui/badge'

interface Props {
    data: StoryData
    selectedIds: string[]
    onToggle: (id: string) => void
    onToggleAll: (select: boolean) => void
}

export function CharacterControls({ data, selectedIds, onToggle, onToggleAll }: Props) {
    const allSelected = selectedIds.length === data.characters.length

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors">Characters</h3>
                <button
                    onClick={() => onToggleAll(!allSelected)}
                    className="text-[10px] font-medium text-primary hover:underline"
                >
                    {allSelected ? 'Deselect All' : 'Select All'}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {data.characters.map((char) => (
                    <div
                        key={char.id}
                        className="flex items-center gap-2 p-2 rounded-md border bg-card/50 hover:bg-accent/50 transition-colors"
                    >
                        <Checkbox
                            id={`char-${char.id}`}
                            checked={selectedIds.includes(char.id)}
                            onCheckedChange={() => onToggle(char.id)}
                            className="border-primary data-[state=checked]:bg-primary"
                        />
                        <label
                            htmlFor={`char-${char.id}`}
                            className="text-xs font-medium cursor-pointer flex items-center gap-2"
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: char.color }}
                            />
                            {char.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}
