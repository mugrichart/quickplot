"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import {
    Bold, Italic, Underline, List, ListOrdered, AlignLeft,
    AlignCenter, AlignRight, FileText, ChevronDown,
    Search, MessageSquare, Video, Lock, Share2, CornerUpLeft,
    CornerUpRight, Printer, SpellCheck, ZoomIn,
    Type, Highlighter, Link2, Image as ImageIcon,
    MoreVertical, CloudCheck, Minus, Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'

const INITIAL_CONTENT = `The shadows of the old empire grew longer as the sun dipped below the jagged peaks of Valoria. Elena clutched the crystal, its faint resonance vibrating through her armor. The path lay open, yet the silence was more deafening than the roar of battle she expected.

Elena checked the perimeter. There was no sign of the watchers. The Hidden Legacy, she thought, finally within reach. This ancient artifact would either save her people or destroy everything she ever loved.`

const FONTS = [
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
]

export function RichEditor() {
    const editorRef = useRef<HTMLDivElement>(null)
    const [stats, setStats] = useState({ words: 0, chars: 0 })
    const [fontSize, setFontSize] = useState(11)
    const [fontFamily, setFontFamily] = useState('Merriweather, serif')
    const [activeStyles, setActiveStyles] = useState({
        bold: false,
        italic: false,
        underline: false,
        alignLeft: true,
        alignCenter: false,
        alignRight: false,
    })

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerText = INITIAL_CONTENT
            updateStats(INITIAL_CONTENT)
            // Enable CSS styles instead of HTML tags for execCommand
            document.execCommand('styleWithCSS', false, 'true')
        }
    }, [])

    const updateStats = (text: string) => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0
        setStats({ words, chars: text.length })
    }

    const checkActiveStyles = useCallback(() => {
        setActiveStyles({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            alignLeft: document.queryCommandState('justifyLeft'),
            alignCenter: document.queryCommandState('justifyCenter'),
            alignRight: document.queryCommandState('justifyRight'),
        })

        const currentFont = document.queryCommandValue('fontName').replace(/"/g, '')
        if (currentFont) setFontFamily(currentFont)
    }, [])

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        updateStats(e.currentTarget.innerText)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault()
            document.execCommand('insertText', false, '\t')
        }
    }

    const exec = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value)
        checkActiveStyles()
        editorRef.current?.focus()
    }

    const changeFontSize = (delta: number) => {
        const newSize = Math.max(8, Math.min(72, fontSize + delta))
        setFontSize(newSize)
        // Note: document.execCommand('fontSize') uses 1-7, which is limited.
        // For a more robust solution we'd use span with style, but this mimics GDocs simple toggle.
        document.execCommand('fontSize', false, "3") // Placeholder for native scale
        // Direct style adjustment for the selection is tricky with execCommand, 
        // usually requiring a library like Tiptap. 
        // For now we'll maintain the UI state.
    }

    return (
        <div className="flex flex-col h-screen w-full bg-[#F9FBFD] dark:bg-zinc-950 overflow-hidden font-sans">
            {/* 1. TOP HEADER (GDocs Style) */}
            <header className="flex items-center justify-between px-4 py-2 bg-background border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="size-10 flex items-center justify-center text-[#4285F4]">
                        <FileText className="size-8" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-[18px] font-medium leading-tight select-none">The Hidden Legacy</span>
                            <CloudCheck className="size-4 text-muted-foreground opacity-50" />
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-medium select-none">
                            {['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Extensions', 'Help'].map(item => (
                                <span key={item} className="hover:bg-accent px-1.5 py-0.5 rounded cursor-pointer transition-colors whitespace-nowrap">{item}</span>
                            ))}
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
            <div className="mx-4 my-2 px-4 py-1.5 bg-[#EDF2FA] dark:bg-zinc-900 rounded-full flex items-center gap-0.5 overflow-x-auto scrollbar-none shadow-sm border border-white/5">
                <div className="flex items-center shrink-0">
                    <Button variant="ghost" size="icon-xs" onClick={() => exec('undo')} className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><CornerUpLeft className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon-xs" onClick={() => exec('redo')} className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><CornerUpRight className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Printer className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><SpellCheck className="size-4" /></Button>
                </div>
                <Separator orientation="vertical" className="h-4 mx-1.5 bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                <Select defaultValue="100%">
                    <SelectTrigger className="w-[80px] h-8 border-none bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[13px] gap-1 px-2 focus:ring-0">
                        <SelectValue placeholder="100%" />
                    </SelectTrigger>
                    <SelectContent>
                        {['50%', '75%', '100%', '125%', '150%', '200%'].map(z => (
                            <SelectItem key={z} value={z}>{z}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Separator orientation="vertical" className="h-4 mx-1.5 bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                <Select defaultValue="normal">
                    <SelectTrigger className="w-[110px] h-8 border-none bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[13px] gap-1 px-2 focus:ring-0">
                        <SelectValue placeholder="Normal text" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Normal text</SelectItem>
                        <SelectItem value="h1">Heading 1</SelectItem>
                        <SelectItem value="h2">Heading 2</SelectItem>
                        <SelectItem value="h3">Heading 3</SelectItem>
                    </SelectContent>
                </Select>
                <Separator orientation="vertical" className="h-4 mx-1.5 bg-zinc-300 dark:bg-zinc-700 shrink-0" />

                <Select value={fontFamily} onValueChange={(val) => exec('fontName', val)}>
                    <SelectTrigger className="w-[140px] h-8 border-none bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[13px] gap-1 px-2 focus:ring-0 font-medium">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {FONTS.map(f => (
                            <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                {f.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-4 mx-1.5 bg-zinc-300 dark:bg-zinc-700 shrink-0" />

                <div className="flex items-center gap-0.5 px-1 shrink-0">
                    <Button variant="ghost" size="icon-xs" onClick={() => changeFontSize(-1)} className="size-7 hover:bg-zinc-200 dark:hover:bg-zinc-800"><Minus className="size-3" /></Button>
                    <div className="px-2 text-[13px] font-bold min-w-[24px] text-center">{fontSize}</div>
                    <Button variant="ghost" size="icon-xs" onClick={() => changeFontSize(1)} className="size-7 hover:bg-zinc-200 dark:hover:bg-zinc-800"><Plus className="size-3" /></Button>
                </div>

                <Separator orientation="vertical" className="h-4 mx-1.5 bg-zinc-300 dark:bg-zinc-700 shrink-0" />

                <div className="flex items-center shrink-0">
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => exec('bold')}
                        className={cn("hover:bg-zinc-200 dark:hover:bg-zinc-800", activeStyles.bold && "bg-zinc-300 dark:bg-zinc-700")}
                    ><Bold className="size-4" /></Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => exec('italic')}
                        className={cn("hover:bg-zinc-200 dark:hover:bg-zinc-800", activeStyles.italic && "bg-zinc-300 dark:bg-zinc-700")}
                    ><Italic className="size-4" /></Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => exec('underline')}
                        className={cn("hover:bg-zinc-200 dark:hover:bg-zinc-800", activeStyles.underline && "bg-zinc-300 dark:bg-zinc-700")}
                    ><Underline className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Type className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Highlighter className="size-4 text-yellow-500" /></Button>
                </div>

                <Separator orientation="vertical" className="h-4 mx-1.5 bg-zinc-300 dark:bg-zinc-700 shrink-0" />

                <div className="flex items-center shrink-0">
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><Link2 className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><ImageIcon className="size-4" /></Button>
                </div>

                <Separator orientation="vertical" className="h-4 mx-1.5 bg-zinc-300 dark:bg-zinc-700 shrink-0" />

                <div className="flex items-center shrink-0">
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => exec('justifyLeft')}
                        className={cn("hover:bg-zinc-200 dark:hover:bg-zinc-800", activeStyles.alignLeft && "bg-zinc-300 dark:bg-zinc-700")}
                    ><AlignLeft className="size-4" /></Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => exec('justifyCenter')}
                        className={cn("hover:bg-zinc-200 dark:hover:bg-zinc-800", activeStyles.alignCenter && "bg-zinc-300 dark:bg-zinc-700")}
                    ><AlignCenter className="size-4" /></Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => exec('justifyRight')}
                        className={cn("hover:bg-zinc-200 dark:hover:bg-zinc-800", activeStyles.alignRight && "bg-zinc-300 dark:bg-zinc-700")}
                    ><AlignRight className="size-4" /></Button>
                </div>

                <Separator orientation="vertical" className="h-4 mx-1.5 bg-zinc-300 dark:bg-zinc-700 shrink-0" />

                <div className="flex items-center shrink-0">
                    <Button variant="ghost" size="icon-xs" onClick={() => exec('insertUnorderedList')} className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><List className="size-4" /></Button>
                    <Button variant="ghost" size="icon-xs" onClick={() => exec('insertOrderedList')} className="hover:bg-zinc-200 dark:hover:bg-zinc-800"><ListOrdered className="size-4" /></Button>
                </div>
            </div>

            {/* 3. EDITOR BODY */}
            <div className="flex-1 overflow-y-auto pt-8 pb-16 px-4 flex justify-center scrollbar-thin" onMouseUp={checkActiveStyles} onKeyUp={checkActiveStyles}>
                {/* The "Paper" container */}
                <div className="w-[816px] min-h-[1056px] bg-background shadow-lg border border-white/5 p-[96px] relative text-left">
                    {/* Ruler Simulation */}
                    <div className="absolute top-0 left-0 right-0 h-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center px-[96px] text-[10px] text-zinc-400 select-none">
                        <div className="flex-1 flex justify-between">
                            {Array.from({ length: 7 }).map((_, i) => <span key={i}>|</span>)}
                        </div>
                    </div>

                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        className="w-full h-full outline-hidden text-[16px] leading-normal text-foreground whitespace-pre-wrap text-left"
                        style={{ fontFamily, fontSize: `${fontSize}pt` }}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            {/* 4. FOOTER STATUS BAR */}
            <div className="h-8 bg-background border-t border-white/5 px-6 flex items-center justify-between text-[11px] text-muted-foreground font-medium uppercase tracking-tighter shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="opacity-60">Words:</span>
                        <span className="text-primary font-black">{stats.words}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="opacity-60">Chars:</span>
                        <span className="text-primary font-black">{stats.chars}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="opacity-60">Last edit just now</span>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
            </div>
        </div>
    )
}
