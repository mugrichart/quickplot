import { useState, useMemo } from 'react'
import { StoryData } from '@/types/story'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight, Activity, MapPin, Navigation, Orbit, ArrowRight } from 'lucide-react'
import { heroJourneyDetails, getFortuneInterpretation, getEvolutionInterpretation } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence, Variants } from 'framer-motion'

interface Props {
    data: StoryData
    currentEventIndex: number
    onClose: () => void
}

type FlowItem =
    | { type: 'intro'; beatName: string; beatDesc: string }
    | { type: 'place'; place: StoryData['places'][0]; state: string; fortune: number }
    | { 
        type: 'character'; 
        character: StoryData['characters'][0]; 
        fortune: number; 
        evolution: number; 
        location: StoryData['places'][0] | undefined; 
        prevLocation: StoryData['places'][0] | undefined;
        moved: boolean; 
        timingTypeFortune: 'prev' | 'trip' | 'next'; 
        timingTypeEvolution: 'prev' | 'trip' | 'next'; 
        prevFortune: number;
        prevEvolution: number;
        deltaFortune: number; 
        deltaEvolution: number 
    };

export function SceneFlowCard({ data, currentEventIndex, onClose }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(1)

    const currentEvent = data.events[currentEventIndex]
    
    const items = useMemo<FlowItem[]>(() => {
        if (!currentEvent) return []
        
        const stepIndex = currentEventIndex % heroJourneyDetails.length
        const beat = heroJourneyDetails[stepIndex]

        const introItems: FlowItem[] = [
            { type: 'intro', beatName: beat.name, beatDesc: beat.description }
        ]
        
        const entityItems: FlowItem[] = []

        // Add places first to set the scene
        data.places.forEach(p => {
            const fortune = currentEvent.placeFortunes?.[p.id] ?? 0
            const state = currentEvent.placeStates?.[p.id] ?? "Unknown"
            entityItems.push({ type: 'place', place: p, state, fortune })
        })

        const prevEvent = currentEventIndex > 0 ? data.events[currentEventIndex - 1] : null;

        // Add characters
        data.characters.forEach(c => {
            const fortuneVal = currentEvent.characterFortunes?.[c.id] ?? 0
            const evolutionVal = currentEvent.characterEvolution?.[c.id] ?? 0
            const locId = currentEvent.characterLocations?.[c.id]
            const loc = data.places.find(p => p.id === locId)
            
            const prevLocId = prevEvent?.characterLocations?.[c.id]
            const prevLoc = data.places.find(p => p.id === prevLocId)
            // If they had a previous location and it's different from the current one, they moved
            const moved = prevEvent !== null && prevLocId !== undefined && prevLocId !== locId

            const prevFortune = prevEvent?.characterFortunes?.[c.id] ?? fortuneVal
            const deltaFortune = fortuneVal - prevFortune

            const prevEvolution = prevEvent?.characterEvolution?.[c.id] ?? evolutionVal
            const deltaEvolution = evolutionVal - prevEvolution
            
            let timingTypeFortune: 'prev' | 'trip' | 'next' = 'next'
            let timingTypeEvolution: 'prev' | 'trip' | 'next' = 'next'

            if (moved && prevLoc && loc) {
                const types: ('prev' | 'trip' | 'next')[] = ['prev', 'trip', 'next'];
                timingTypeFortune = types[Math.floor(Math.random() * types.length)];
                timingTypeEvolution = types[Math.floor(Math.random() * types.length)];
            } else if (loc) {
                timingTypeFortune = 'next';
                timingTypeEvolution = 'next';
            }
            
            entityItems.push({
                type: 'character',
                character: c,
                fortune: fortuneVal,
                evolution: evolutionVal,
                location: loc,
                prevLocation: prevLoc,
                moved,
                prevFortune,
                prevEvolution,
                deltaFortune,
                deltaEvolution,
                timingTypeFortune,
                timingTypeEvolution
            })
        })
        
        // Shuffle entity items
        for (let i = entityItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [entityItems[i], entityItems[j]] = [entityItems[j], entityItems[i]];
        }

        return [...introItems, ...entityItems]
    }, [data, currentEvent, currentEventIndex])

    if (!currentEvent || items.length === 0) return null

    const handleNext = () => {
        if (currentIndex < items.length - 1) {
            setDirection(1)
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setDirection(-1)
            setCurrentIndex(prev => prev - 1)
        }
    }

    const currentItem = items[currentIndex]

    const slideVariants: Variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, type: "spring", bounce: 0.2 }
        },
        exit: (dir: number) => ({
            x: dir < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2 }
        })
    }

    const dragHandlers = {
        drag: "x" as const,
        dragConstraints: { left: 0, right: 0 },
        dragElastic: 0.2,
        onDragEnd: (e: any, { offset, velocity }: any) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
                handleNext();
            } else if (swipe > swipeConfidenceThreshold) {
                handlePrev();
            }
        }
    }

    return (
        <Card className="w-[480px] bg-background/95 backdrop-blur-2xl border-primary/30 shadow-2xl pointer-events-auto flex flex-col h-[520px] overflow-hidden rounded-3xl">
            <CardHeader className="p-4 border-b border-white/5 shrink-0 flex flex-row items-center justify-between space-y-0 bg-primary/5">
                <div className="flex items-center gap-2">
                    <Navigation className="size-4 text-primary" />
                    <CardTitle className="text-sm font-black uppercase tracking-wider text-foreground">
                        Beat Flow
                    </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] tabular-nums bg-transparent border-primary/20">
                        {currentIndex + 1} / {items.length}
                    </Badge>
                    <Button variant="ghost" size="icon-xs" onClick={onClose} className="hover:bg-primary/20 rounded-full">
                        <X className="size-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative flex flex-col justify-center items-center overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        {...dragHandlers}
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 cursor-grab active:cursor-grabbing"
                    >
                        {currentItem.type === 'intro' && (
                            <div className="text-center space-y-6">
                                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                                    <Orbit className="size-8 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Current Beat</h2>
                                    <h3 className="text-3xl font-black text-foreground drop-shadow-md leading-tight">{currentItem.beatName}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed px-4">{currentItem.beatDesc}</p>
                            </div>
                        )}

                        {currentItem.type === 'place' && (
                            <div className="w-full h-full flex flex-col">
                                <div className="flex flex-col items-center text-center space-y-2 mb-8 mt-4">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Setting the Scene</div>
                                    <div className="text-6xl drop-shadow-lg mb-2">{currentItem.place.emoji}</div>
                                    <h3 className="text-2xl font-black">{currentItem.place.name}</h3>
                                </div>
                                
                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex flex-col gap-4">
                                    <div className="space-y-1 text-center">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current State</div>
                                        <div className="text-lg font-bold text-primary">{currentItem.state}</div>
                                    </div>
                                    <div className="h-px bg-primary/10 w-full" />
                                    <div className="space-y-1 text-center">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Aura / Fortune ({currentItem.fortune})</div>
                                        <div className="text-sm">{getFortuneInterpretation(currentItem.fortune).label}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentItem.type === 'character' && (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                {/* Character Identity Header */}
                                <div className="flex flex-col items-center mb-8">
                                    <div 
                                        className="size-16 rounded-full shadow-2xl border-4 border-background ring-2 ring-primary/20 mb-3 relative overflow-hidden"
                                        style={{ backgroundColor: currentItem.character.color }}
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10" />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-foreground">{currentItem.character.name}</h3>
                                </div>

                                {/* The "Table" Structure */}
                                <div className="w-full max-w-[440px] space-y-3 px-4 mt-2">
                                    {/* Row 1: Location */}
                                    <div className="grid grid-cols-[90px_1fr_80px_1fr] items-center gap-2 bg-muted/20 hover:bg-muted/30 p-3 rounded-2xl border border-white/5 transition-colors shadow-sm">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 px-2 select-none">Location</div>
                                        <div className="text-right pr-6 border-r border-white/5">
                                            <span className="text-2xl drop-shadow-sm">{currentItem.prevLocation?.emoji || '📍'}</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center relative">
                                            <ArrowRight className={`size-4 ${currentItem.moved ? 'text-primary animate-pulse' : 'text-muted-foreground/10'}`} />
                                            {currentItem.moved && (
                                                <span className="text-[7px] font-black text-primary/40 uppercase tracking-tighter mt-1">Travel</span>
                                            )}
                                        </div>
                                        <div className="text-left pl-6 border-l border-white/5">
                                            <span className="text-2xl drop-shadow-sm">{currentItem.location?.emoji || '📍'}</span>
                                        </div>
                                    </div>

                                    {/* Row 2: Fortune */}
                                    <div className="grid grid-cols-[90px_1fr_80px_1fr] items-center gap-2 bg-muted/20 hover:bg-muted/30 p-3 rounded-2xl border border-white/5 transition-colors shadow-sm relative overflow-hidden">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 px-2 select-none">Fortune</div>
                                        <div className="text-right flex items-center justify-end gap-3 pr-6 border-r border-white/5 relative">
                                            <Activity className="size-3 text-muted-foreground/10" />
                                            <span className="text-lg font-bold font-mono text-muted-foreground/40">{currentItem.prevFortune}</span>
                                            {currentItem.timingTypeFortune === 'prev' && (
                                                <sup className={`absolute -top-1 -right-4 text-[10px] font-black ${currentItem.deltaFortune >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {currentItem.deltaFortune >= 0 ? `+${currentItem.deltaFortune}` : currentItem.deltaFortune}
                                                </sup>
                                            )}
                                        </div>
                                        <div className="relative h-full flex flex-col items-center justify-center">
                                            <ArrowRight className="size-4 text-muted-foreground/10" />
                                            {currentItem.timingTypeFortune === 'trip' && (
                                                <div className={`text-[10px] font-black ${currentItem.deltaFortune >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
                                                    ({currentItem.deltaFortune >= 0 ? `+${currentItem.deltaFortune}` : currentItem.deltaFortune})
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left flex items-center gap-3 pl-6 border-l border-white/5">
                                            <div className="relative">
                                                <span className="text-xl font-black text-foreground font-mono">{currentItem.fortune}</span>
                                                {currentItem.timingTypeFortune === 'next' && (
                                                    <sup className={`absolute -top-1 -right-7 text-[10px] font-black ${currentItem.deltaFortune >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {currentItem.deltaFortune >= 0 ? `+${currentItem.deltaFortune}` : currentItem.deltaFortune}
                                                    </sup>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3: Development */}
                                    <div className="grid grid-cols-[90px_1fr_80px_1fr] items-center gap-2 bg-muted/20 hover:bg-muted/30 p-3 rounded-2xl border border-white/5 transition-colors shadow-sm relative overflow-hidden">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 px-2 select-none">Dev</div>
                                        <div className="text-right flex items-center justify-end gap-3 pr-6 border-r border-white/5 relative">
                                            <Orbit className="size-3 text-muted-foreground/10" />
                                            <span className="text-lg font-bold font-mono text-muted-foreground/40">{currentItem.prevEvolution}</span>
                                            {currentItem.timingTypeEvolution === 'prev' && (
                                                <sup className={`absolute -top-1 -right-4 text-[10px] font-black ${currentItem.deltaEvolution >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {currentItem.deltaEvolution >= 0 ? `+${currentItem.deltaEvolution}` : currentItem.deltaEvolution}
                                                </sup>
                                            )}
                                        </div>
                                        <div className="relative h-full flex flex-col items-center justify-center">
                                            <ArrowRight className="size-4 text-muted-foreground/10" />
                                            {currentItem.timingTypeEvolution === 'trip' && (
                                                <div className={`text-[10px] font-black ${currentItem.deltaEvolution >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
                                                    ({currentItem.deltaEvolution >= 0 ? `+${currentItem.deltaEvolution}` : currentItem.deltaEvolution})
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left flex items-center gap-3 pl-6 border-l border-white/5">
                                            <div className="relative">
                                                <span className="text-xl font-black text-foreground font-mono">{currentItem.evolution}</span>
                                                {currentItem.timingTypeEvolution === 'next' && (
                                                    <sup className={`absolute -top-1 -right-7 text-[10px] font-black ${currentItem.deltaEvolution >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {currentItem.deltaEvolution >= 0 ? `+${currentItem.deltaEvolution}` : currentItem.deltaEvolution}
                                                    </sup>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Interpretation Footer Card */}
                                <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-[440px] px-2">
                                    <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                                        <span className="text-[8px] uppercase font-black text-primary/60 block mb-1">State</span>
                                        <span className="text-[10px] text-foreground font-bold leading-tight line-clamp-2">{getFortuneInterpretation(currentItem.fortune).label}</span>
                                    </div>
                                    <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                                        <span className="text-[8px] uppercase font-black text-primary/60 block mb-1">Phase</span>
                                        <span className="text-[10px] text-foreground font-bold leading-tight line-clamp-2">{getEvolutionInterpretation(currentItem.evolution).label}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Left/Right Controls overlay */}
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="rounded-full bg-background/50 backdrop-blur border border-white/10 shadow-lg pointer-events-auto hover:bg-primary/20 hover:text-primary disabled:opacity-0 transition-opacity"
                    >
                        <ChevronLeft className="size-6" />
                    </Button>
                </div>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleNext}
                        disabled={currentIndex === items.length - 1}
                        className="rounded-full bg-background/50 backdrop-blur border border-white/10 shadow-lg pointer-events-auto hover:bg-primary/20 hover:text-primary disabled:opacity-0 transition-opacity"
                    >
                        <ChevronRight className="size-6" />
                    </Button>
                </div>
            </CardContent>
            
            {/* Dots Indicator */}
            <div className="p-4 flex justify-center gap-1.5 bg-background/50 backdrop-blur-md border-t border-white/5">
                {items.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-primary/20'}`}
                    />
                ))}
            </div>
        </Card>
    )
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
