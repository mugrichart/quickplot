"use client"

import { Checkbox } from '@/components/ui/checkbox'
import { StoryData } from '@/types/story'
import { cn } from '@/lib/utils'

interface Props {
    data: StoryData
    selectedIds: string[]
    onToggle: (id: string) => void
    onToggleAll: (select: boolean) => void
}

export function CharacterControls({ data, selectedIds, onToggle, onToggleAll }: Props) {
    const allSelected = selectedIds.length === data.characters.length

    return (
        <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between border-b border-primary/10 pb-1.5 px-1">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-primary/50">Character Focus</h3>
                <div className="flex items-center gap-2 pr-1">
                    <span className="text-[8px] text-muted-foreground uppercase font-black">All</span>
                    <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => onToggleAll(!allSelected)}
                        className="h-3 w-3 border-primary/30 data-[state=checked]:bg-primary"
                    />
                </div>
            </div>

            <div className="grid grid-cols-10 gap-1">
                {data.characters.map((char) => (
                    <div
                        key={char.id}
                        className={cn(
                            "flex items-center gap-1 p-1 rounded transition-all border",
                            selectedIds.includes(char.id)
                                ? "bg-primary/5 border-primary/20 shadow-sm"
                                : "bg-muted/5 border-transparent opacity-40 grayscale-[0.5]"
                        )}
                    >
                        <Checkbox
                            id={`char-${char.id}`}
                            checked={selectedIds.includes(char.id)}
                            onCheckedChange={() => onToggle(char.id)}
                            className="h-2.5 w-2.5 border-primary/40 data-[state=checked]:bg-primary"
                        />
                        <label
                            htmlFor={`char-${char.id}`}
                            className="text-[8px] font-bold cursor-pointer truncate flex items-center gap-1 min-w-0"
                            title={char.name}
                        >
                            <div
                                className="w-1.5 h-1.5 rounded-full shrink-0 shadow-sm"
                                style={{ backgroundColor: char.color }}
                            />
                            <span className="truncate">{char.name}</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}
