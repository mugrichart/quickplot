import { useRef, memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StoryData } from '@/types/story'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Pencil, Trash2 } from 'lucide-react'
import { EditPlaceDialog } from './EditPlaceDialog'

interface Props {
    data: StoryData
    selectedCharacterIds: string[]
    currentEventIndex: number
    mapImageUrl: string | null
    opacity: number
    onPlaceMove: (id: string, x: number, y: number) => void
    onPlaceUpdate?: (id: string, updates: { name: string, emoji: string }) => void
    onPlaceDelete?: (id: string) => void
}

export const StoryWorld = memo(function StoryWorld({
    data,
    selectedCharacterIds,
    currentEventIndex,
    mapImageUrl,
    opacity,
    onPlaceMove,
    onPlaceUpdate,
    onPlaceDelete
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [editingPlace, setEditingPlace] = useState<{ id: string; name: string; emoji: string } | null>(null)
    const currentEvent = data.events[currentEventIndex]

    const selectedCharacters = data.characters.filter(c => selectedCharacterIds.includes(c.id))

    return (
        <div
            ref={containerRef}
            className="h-full w-full relative overflow-hidden bg-background"
        >
            {/* Layer 0: World Map Image */}
            <AnimatePresence mode="wait">
                {mapImageUrl && (
                    <motion.div
                        key={mapImageUrl}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0 bg-transparent flex items-center justify-center p-12"
                    >
                        <div
                            className="w-full h-full bg-contain bg-center bg-no-repeat transition-all duration-700"
                            style={{
                                backgroundImage: `url(${mapImageUrl})`,
                                opacity: opacity
                            }}
                        />
                        {/* Subtle vignette/gradient to keep UI readable */}
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/5 to-background/20 pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)] pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Layer 1: Places & Nested Characters */}
            {data.places.map((place) => {
                const charsInPlace = selectedCharacters.filter(c => currentEvent.characterLocations[c.id] === place.id)

                return (
                    <ContextMenu key={place.id}>
                        <ContextMenuTrigger asChild>
                            <motion.div
                                key={place.id}
                                data-place-id={place.id}
                                drag
                                dragMomentum={false}
                                dragElastic={0}
                                dragConstraints={containerRef}
                                onDragEnd={(event) => {
                                    if (!containerRef.current) return
                                    const containerRect = containerRef.current.getBoundingClientRect()

                                    // Find the dragged element (could be nested target)
                                    const target = event.target as HTMLElement
                                    const el = target.closest('[data-place-id]') as HTMLElement
                                    if (!el) return

                                    const elRect = el.getBoundingClientRect()

                                    // Calculate the exact center of the element in the viewport
                                    const centerX = elRect.left + elRect.width / 2
                                    const centerY = elRect.top + elRect.height / 2

                                    // Map that center to the container percentages
                                    const x = ((centerX - containerRect.left) / containerRect.width) * 100
                                    const y = ((centerY - containerRect.top) / containerRect.height) * 100

                                    onPlaceMove(place.id, x, y)
                                }}
                                className="absolute flex flex-col items-center z-10 cursor-grab active:cursor-grabbing group pointer-events-auto"
                                animate={{
                                    left: `${place.x}%`,
                                    top: `${place.y}%`,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 40,
                                    mass: 0.5
                                }}
                                style={{
                                    x: "-50%",
                                    y: "-50%"
                                }}
                            >
                                <div className="text-4xl mb-1 filter drop-shadow-xl select-none transition-transform group-hover:scale-110">
                                    {place.emoji}
                                </div>
                                <span className="text-[10px] font-black text-foreground/80 uppercase tracking-widest drop-shadow-sm bg-background/20 backdrop-blur-[1px] px-1.5 rounded pointer-events-none whitespace-nowrap">
                                    {place.name}
                                </span>

                                {/* Relative container for the characters, sitting exactly below the label */}
                                <div className="absolute top-full mt-4 w-0 h-0 flex items-center justify-center pointer-events-none">
                                    {charsInPlace.map((char, index) => {
                                        const offset = (index * 14) - ((charsInPlace.length - 1) * 7)

                                        return (
                                            <Tooltip key={char.id} delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <motion.div
                                                        initial={false}
                                                        animate={{ x: offset }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 500,
                                                            damping: 35
                                                        }}
                                                        className="absolute w-5 h-5 rounded-full border-2 border-white dark:border-background shadow-2xl pointer-events-auto cursor-pointer flex items-center justify-center z-20"
                                                        style={{
                                                            backgroundColor: char.color,
                                                        }}
                                                    >
                                                        <div className="w-full h-full rounded-full animate-pulse opacity-40 bg-white" />
                                                    </motion.div>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-background/95 backdrop-blur border-primary/20">
                                                    <p className="text-xs font-black uppercase tracking-tight">{char.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="min-w-32 bg-background/90 backdrop-blur-md border-primary/20">
                            <ContextMenuItem
                                onClick={() => setEditingPlace({ id: place.id, name: place.name, emoji: place.emoji })}
                                className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider"
                            >
                                <Pencil className="size-3.5 text-primary" />
                                Edit Place
                            </ContextMenuItem>
                            <ContextMenuSeparator className="bg-primary/10" />
                            <ContextMenuItem
                                onClick={() => onPlaceDelete?.(place.id)}
                                className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                            >
                                <Trash2 className="size-3.5" />
                                Delete Place
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                )
            })}

            <EditPlaceDialog
                place={editingPlace}
                onOpenChange={(open) => !open && setEditingPlace(null)}
                onUpdate={(id, updates) => {
                    onPlaceUpdate?.(id, updates)
                    setEditingPlace(null)
                }}
            />
        </div>
    )
})
