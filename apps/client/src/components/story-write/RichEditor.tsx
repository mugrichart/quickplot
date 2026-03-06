"use client"

import { useState } from 'react'
import {
    Bold, Italic, Underline, List, ListOrdered, AlignLeft,
    AlignCenter, AlignRight, FileText, ChevronDown,
    Search, MessageSquare, Video, Lock, Share2, CornerUpLeft,
    CornerUpRight, Printer, SpellCheck, ZoomIn,
    Type, Highlighter, Link2, Image as ImageIcon,
    MoreVertical, CloudCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function RichEditor() {
    const [content, setContent] = useState(`The shadows of the old empire grew longer as the sun dipped below the jagged peaks of Valoria. Elena clutched the crystal, its faint resonance vibrating through her armor. The path lay open, yet the silence was more deafening than the roar of battle she expected.

Elena checked the perimeter. There was no sign of the watchers. The Hidden Legacy, she thought, finally within reach. This ancient artifact would either save her people or destroy everything she ever loved.`)

    return (
        <div className="flex flex-col h-screen w-full bg-[#F9FBFD] dark:bg-black overflow-hidden font-sans">
            {/* 1. TOP HEADER (GDocs Style) */}
            <header className="flex items-center justify-between px-4 py-2 bg-background border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="size-10 flex items-center justify-center text-[#4285F4]">
                        <FileText className="size-8" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-[18px] font-medium leading-tight">The Hidden Legacy</span>
                            <CloudCheck className="size-4 text-muted-foreground opacity-50" />
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-medium">
                            <span className="hover:bg-accent px-1 rounded cursor-pointer">File</span>
                            <span className="hover:bg-accent px-1 rounded cursor-pointer">Edit</span>
                            <span className="hover:bg-accent px-1 rounded cursor-pointer">View</span>
                            <span className="hover:bg-accent px-1 rounded cursor-pointer">Insert</span>
                            <span className="hover:bg-accent px-1 rounded cursor-pointer">Format</span>
                            <span className="hover:bg-accent px-1 rounded cursor-pointer">Tools</span>
                            <span className="hover:bg-accent px-1 rounded cursor-pointer">Extensions</span>
                            <span className="hover:bg-accent px-1 rounded cursor-pointer">Help</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="rounded-full size-10">
                            <MessageSquare className="size-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full size-10">
                            <Video className="size-5" />
                        </Button>
                    </div>
                    <Button className="bg-[#C2E7FF] text-[#001D35] hover:bg-[#B1D8F4] rounded-full px-6 flex items-center gap-2 font-black shadow-none border-none">
                        <Lock className="size-4" />
                        <span>Share</span>
                    </Button>
                    <div className="size-9 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                        M
                    </div>
                </div>
            </header>

            {/* 2. TOOLBAR */}
            <div className="mx-4 my-2 px-4 py-1.5 bg-[#EDF2FA] dark:bg-zinc-900 rounded-full flex items-center gap-0.5 overflow-x-auto scrollbar-none shadow-sm">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><CornerUpLeft className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><CornerUpRight className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Printer className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><SpellCheck className="size-4" /></Button>
                </div>
                <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-300 dark:bg-zinc-700" />
                <Button variant="ghost" size="sm" className="gap-2 text-[13px] hover:bg-zinc-200 dark:hover:bg-zinc-800">100% <ChevronDown className="size-3" /></Button>
                <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-300 dark:bg-zinc-700" />
                <Button variant="ghost" size="sm" className="gap-2 text-[13px] hover:bg-zinc-200 dark:hover:bg-zinc-800">Normal text <ChevronDown className="size-3" /></Button>
                <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-300 dark:bg-zinc-700" />
                <Button variant="ghost" size="sm" className="gap-2 text-[13px] hover:bg-zinc-200 dark:hover:bg-zinc-800 font-serif">Merriweather <ChevronDown className="size-3" /></Button>
                <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center gap-1 px-1">
                    <Button variant="ghost" size="icon-xs" className="size-7 hover:bg-zinc-200 dark:hover:bg-zinc-800">-</Button>
                    <div className="px-2 text-[13px] font-bold">11</div>
                    <Button variant="ghost" size="icon-xs" className="size-7 hover:bg-zinc-200 dark:hover:bg-zinc-800">+</Button>
                </div>
                <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center">
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Bold className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Italic className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Underline className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Type className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Highlighter className="size-4 text-yellow-500" /></Button>
                </div>
                <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center">
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Link2 className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><ImageIcon className="size-4" /></Button>
                </div>
                <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center">
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><AlignLeft className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><AlignCenter className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><AlignRight className="size-4" /></Button>
                </div>
                <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center">
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><List className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><ListOrdered className="size-4" /></Button>
                </div>
            </div>

            {/* 3. EDITOR BODY */}
            <div className="flex-1 overflow-y-auto pt-8 pb-16 px-4 flex justify-center scrollbar-thin">
                {/* The "Paper" container */}
                <div className="w-[816px] min-h-[1056px] bg-background shadow-lg border border-white/5 p-[96px] relative">
                    {/* Ruler Simulation (Optional but adds to vibe) */}
                    <div className="absolute top-0 left-0 right-0 h-8 border-b border-zinc-100 flex items-center px-[96px] text-[10px] text-zinc-400 select-none">
                        <div className="flex-1 flex justify-between">
                            <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
                        </div>
                    </div>

                    <div
                        contentEditable
                        suppressContentEditableWarning
                        className="w-full h-full outline-hidden text-[16px] leading-normal text-foreground font-serif"
                        onInput={(e) => setContent(e.currentTarget.innerText)}
                    >
                        {content}
                    </div>
                </div>
            </div>

            {/* 4. FOOTER STATUS BAR */}
            <div className="h-8 bg-background border-t border-white/5 px-6 flex items-center justify-between text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="opacity-60">Words:</span>
                        <span className="text-primary font-black">{content.trim().split(/\s+/).length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="opacity-60">Chars:</span>
                        <span className="text-primary font-black">{content.length}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="opacity-60">Last edit 2 mins ago</span>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
            </div>
        </div>
    )
}
