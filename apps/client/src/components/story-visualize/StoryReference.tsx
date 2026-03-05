"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import referenceData from "@/data/story-reference.json"

export function StoryReference() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border">
                    <HelpCircle className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <ScrollArea className="h-96">
                    <div className="p-4 space-y-6">
                        <h3 className="font-bold text-sm tracking-tight border-b pb-2">Reference Guide</h3>

                        {referenceData.scales.map((scale) => (
                            <div key={scale.id} className="space-y-3">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold uppercase text-primary">{scale.name}</h4>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        {scale.description}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {scale.levels.map((level, i) => (
                                        <div key={i} className="flex gap-2 items-start text-[10px]">
                                            <div
                                                className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                                                style={{ backgroundColor: level.color }}
                                            />
                                            <div className="space-y-0.5">
                                                <div className="flex justify-between w-full font-semibold">
                                                    <span>{level.label}</span>
                                                    <span className="text-muted-foreground opacity-70">
                                                        {level.min} to {level.max}
                                                    </span>
                                                </div>
                                                <p className="text-muted-foreground line-clamp-2">
                                                    {level.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
