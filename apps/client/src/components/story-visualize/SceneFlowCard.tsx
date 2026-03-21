import { useState, useMemo, useEffect } from 'react'
import { StoryData } from '@/types/story'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight, Activity, MapPin, Navigation, Orbit, ArrowRight, Sparkles, Edit3 } from 'lucide-react'
import { heroJourneyDetails, getFortuneInterpretation, getEvolutionInterpretation, getDeltaInterpretation, getLevelInterpretation, Lens } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence, Variants } from 'framer-motion'

interface Props {
    data: StoryData
    currentEventIndex: number
    onClose: () => void
    onWrite?: (index: number) => void
}

type FlowItem =
    | { type: 'intro'; beatName: string; beatDesc: string }
    | { type: 'outro'; beatName: string }
    | { type: 'place'; place: StoryData['places'][0]; state: string; fortune: number; prevFortune: number; deltaFortune: number }
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

export function SceneFlowCard({ data, currentEventIndex, onClose, onWrite }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(1)

    // Reset index when switching events
    useEffect(() => {
        setCurrentIndex(0)
    }, [currentEventIndex])

    const currentEvent = data.events[currentEventIndex]

    const items = useMemo<FlowItem[]>(() => {
        if (!currentEvent) return []

        const stepIndex = currentEventIndex % heroJourneyDetails.length
        const beat = heroJourneyDetails[stepIndex]

        const introItems: FlowItem[] = [
            { type: 'intro', beatName: beat.name, beatDesc: beat.description }
        ]

        const entityItems: FlowItem[] = []

        const prevEvent = currentEventIndex > 0 ? data.events[currentEventIndex - 1] : null;

        // Add places
        data.places.forEach(p => {
            const fortune = currentEvent.placeFortunes?.[p.id] ?? 0
            const state = currentEvent.placeStates?.[p.id] ?? "Unknown"
            const prevFortune = prevEvent?.placeFortunes?.[p.id] ?? fortune
            const deltaFortune = fortune - prevFortune
            entityItems.push({ type: 'place', place: p, state, fortune, prevFortune, deltaFortune })
        })

        // Add characters
        data.characters.forEach(c => {
            const fortuneVal = currentEvent.characterFortunes?.[c.id] ?? 0
            const evolutionVal = currentEvent.characterEvolution?.[c.id] ?? 0
            const locId = currentEvent.characterLocations?.[c.id]
            const loc = data.places.find(p => p.id === locId)

            const prevLocId = prevEvent?.characterLocations?.[c.id]
            const prevLoc = data.places.find(p => p.id === prevLocId)
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

        return [
            ...introItems, 
            ...entityItems,
            { type: 'outro', beatName: beat.name } as FlowItem
        ]
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

    const generateSummary = (item: Extract<FlowItem, { type: 'character' }>) => {
        const charName = item.character.name;
        const startLoc = item.prevLocation?.name || "their starting point";
        const endLoc = item.location?.name || "their destination";

        const getFortuneWords = (delta: number) => {
            if (delta === 0) return "maintained a steady fortune";
            const inter = getDeltaInterpretation('fortune', delta, 'generic');
            const verb = delta > 0 ? "experienced a" : "suffered an";
            return `${verb} ${inter.label.toLowerCase()} (${delta > 0 ? '+' : ''}${delta})`;
        };

        const getEvolutionWords = (delta: number) => {
            if (delta === 0) return "remained steadfast in their resolve";
            const inter = getDeltaInterpretation('evolution', delta, 'generic');
            const verb = delta > 0 ? "made a" : "faced a";
            return `${verb} ${inter.label.toLowerCase()} (${delta >= 0 ? '+' : ''}${delta})`;
        };

        const fWords = getFortuneWords(item.deltaFortune);
        const eWords = getEvolutionWords(item.deltaEvolution);
        const fTiming = item.timingTypeFortune;
        const eTiming = item.timingTypeEvolution;

        if (!item.moved) {
            return `${charName} stayed at ${endLoc}. They ${fWords} and ${eWords} during this period.`;
        }

        let narrative = "";

        // Stage 1: At Start
        const startEvents: string[] = [];
        if (fTiming === 'prev') startEvents.push(fWords);
        if (eTiming === 'prev') startEvents.push(eWords);

        if (startEvents.length > 0) {
            narrative += `${charName} ${startEvents.join(' and ')} while at ${startLoc}. `;
        }

        // Stage 2: The Trip
        const tripEvents: string[] = [];
        if (fTiming === 'trip') tripEvents.push(fWords);
        if (eTiming === 'trip') tripEvents.push(eWords);

        const travelVerb = startEvents.length > 0 ? "Then, they headed" : `${charName} headed`;

        if (tripEvents.length > 0) {
            narrative += `${travelVerb} to ${endLoc}, ${tripEvents.join(' and ')} during the journey. `;
        } else {
            narrative += `${travelVerb} to ${endLoc}. `;
        }

        // Stage 3: Arrival
        const endEvents: string[] = [];
        if (fTiming === 'next') endEvents.push(fWords);
        if (eTiming === 'next') endEvents.push(eTiming === fTiming ? eWords : `they also ${eWords}`);

        if (endEvents.length > 0) {
            const arrivalPhrase = (startEvents.length > 0 || tripEvents.length > 0) ? "Upon reaching" : "After reaching";
            narrative += `${arrivalPhrase} ${endLoc}, they ${endEvents.join(' and ')}.`;
        }

        return narrative.trim();
    }

    return (
        <Card className="w-[480px] bg-background/95 backdrop-blur-2xl border-primary/30 shadow-2xl pointer-events-auto flex flex-col h-[740px] overflow-hidden rounded-3xl">
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
            <CardContent className="p-0 flex-1 relative flex flex-col items-center">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        {...dragHandlers}
                        className="absolute inset-x-0 top-0 flex flex-col items-center p-4 cursor-grab active:cursor-grabbing"
                    >
                        {currentItem.type === 'intro' && (
                            <div className="w-full flex flex-col items-center justify-center text-center space-y-6 pt-10">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Sparkles className="size-8 text-primary animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">Current Beat Overview</div>
                                    <h2 className="text-3xl font-black tracking-tight leading-tight">{currentItem.beatName}</h2>
                                    <p className="text-muted-foreground text-sm max-w-[300px] leading-relaxed italic mx-auto">
                                        "{currentItem.beatDesc}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentItem.type === 'outro' && (
                            <div className="w-full flex flex-col items-center justify-center text-center space-y-8 pt-12">
                                <div className="p-5 bg-primary/10 rounded-full shadow-inner relative">
                                    <Sparkles className="size-10 text-primary animate-pulse" />
                                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-background">
                                        <Activity className="size-2 text-white" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black italic text-muted-foreground">"Inspiration Gathered"</h3>
                                    <h2 className="text-2xl font-black tracking-tight max-w-[280px]">Ready to bring {currentItem.beatName} to life?</h2>
                                </div>

                                {onWrite && (
                                    <Button 
                                        onClick={() => onWrite(currentEventIndex)}
                                        variant="default"
                                        className="gap-3 rounded-full px-10 py-6 shadow-2xl bg-primary hover:scale-110 transition-all text-primary-foreground font-bold text-lg"
                                    >
                                        <Edit3 className="size-6" />
                                        Write Now
                                    </Button>
                                )}
                            </div>
                        )}

                        {currentItem.type === 'place' && (
                            <div className="w-full flex flex-col pt-6">
                                <div className="flex flex-col items-center text-center space-y-1 mb-6">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Setting the Scene</div>
                                    <div className="text-5xl drop-shadow-lg">{currentItem.place.emoji}</div>
                                    <h3 className="text-xl font-black">{currentItem.place.name}</h3>
                                </div>

                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex flex-col gap-3 max-w-[400px] mx-auto w-full shadow-inner">
                                    <div className="space-y-1 text-center">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Atmospheric Aura ({currentItem.fortune})</div>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="text-sm font-medium">{getFortuneInterpretation(currentItem.fortune).label}</div>
                                            {currentItem.deltaFortune !== 0 && (
                                                <span className={`text-[10px] font-black ${currentItem.deltaFortune > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {currentItem.deltaFortune > 0 ? '+' : ''}{currentItem.deltaFortune}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentItem.type === 'character' && (
                            <div className="w-full flex flex-col items-center gap-4">
                                {/* Character Identity Header - Compact */}
                                <div className="flex items-center gap-3 w-full max-w-[440px] px-2 mt-2">
                                    <div
                                        className="size-8 rounded-full shadow-lg border-2 border-background ring-1 ring-primary/20 shrink-0"
                                        style={{ backgroundColor: currentItem.character.color }}
                                    />
                                    <h3 className="text-lg font-black tracking-tight text-foreground truncate">{currentItem.character.name}</h3>
                                </div>

                                {/* Compact Stats Rows */}
                                <div className="w-full max-w-[440px] space-y-1.5 px-2">
                                    {/* Row 1: Location */}
                                    <div className="grid grid-cols-[80px_1fr_60px_1fr] items-center gap-2 bg-muted/10 p-2 rounded-xl border border-white/5">
                                        <div className="text-[8px] font-black uppercase text-muted-foreground/40 px-1">Location</div>
                                        <div className="text-right text-lg">{currentItem.prevLocation?.emoji || '📍'}</div>
                                        <div className="flex justify-center"><ArrowRight className="size-3 text-muted-foreground/20" /></div>
                                        <div className="text-left text-lg">{currentItem.location?.emoji || '📍'}</div>
                                    </div>

                                    {/* Row 2: Fortune */}
                                    <div className="grid grid-cols-[80px_1fr_60px_1fr] items-center gap-2 bg-muted/10 p-2 rounded-xl border border-white/5 relative">
                                        <div className="text-[8px] font-black uppercase text-muted-foreground/40 px-1">Fortune</div>
                                        <div className="text-right font-mono font-bold text-muted-foreground/60 relative">
                                            {currentItem.prevFortune}
                                            {currentItem.timingTypeFortune === 'prev' && (
                                                <sup className="text-[8px] ml-0.5 text-primary/60">{currentItem.deltaFortune >= 0 ? '+' : ''}{currentItem.deltaFortune}</sup>
                                            )}
                                        </div>
                                        <div className="flex justify-center relative">
                                            <ArrowRight className="size-3 text-muted-foreground/20" />
                                            {currentItem.timingTypeFortune === 'trip' && (
                                                <div className="absolute -top-3 text-[8px] font-black text-primary">{currentItem.deltaFortune >= 0 ? '+' : ''}{currentItem.deltaFortune}</div>
                                            )}
                                        </div>
                                        <div className="text-left font-mono font-black text-foreground relative">
                                            {currentItem.fortune}
                                            {currentItem.timingTypeFortune === 'next' && (
                                                <sup className="text-[8px] ml-0.5 text-primary">{currentItem.deltaFortune >= 0 ? '+' : ''}{currentItem.deltaFortune}</sup>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 3: Dev */}
                                    <div className="grid grid-cols-[80px_1fr_60px_1fr] items-center gap-2 bg-muted/10 p-2 rounded-xl border border-white/5 relative">
                                        <div className="text-[8px] font-black uppercase text-muted-foreground/40 px-1">Evolution</div>
                                        <div className="text-right font-mono font-bold text-muted-foreground/60 relative">
                                            {currentItem.prevEvolution}
                                            {currentItem.timingTypeEvolution === 'prev' && (
                                                <sup className="text-[8px] ml-0.5 text-emerald-500/60">{currentItem.deltaEvolution >= 0 ? '+' : ''}{currentItem.deltaEvolution}</sup>
                                            )}
                                        </div>
                                        <div className="flex justify-center relative">
                                            <ArrowRight className="size-3 text-muted-foreground/20" />
                                            {currentItem.timingTypeEvolution === 'trip' && (
                                                <div className="absolute -top-3 text-[8px] font-black text-emerald-500">{currentItem.deltaEvolution >= 0 ? '+' : ''}{currentItem.deltaEvolution}</div>
                                            )}
                                        </div>
                                        <div className="text-left font-mono font-black text-foreground relative">
                                            {currentItem.evolution}
                                            {currentItem.timingTypeEvolution === 'next' && (
                                                <sup className="text-[8px] ml-0.5 text-emerald-500">{currentItem.deltaEvolution >= 0 ? '+' : ''}{currentItem.deltaEvolution}</sup>
                                            )}
                                        </div>
                                    </div>

                                </div>

                                {/* Re-overhauled Interpretation Section with More Space */}
                                <div className="flex flex-col gap-1.5 w-full max-w-[440px] px-2 mb-2 grow min-h-0">
                                    <div className="grid grid-cols-2 gap-2 shrink-0">
                                        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 space-y-1">
                                            <span className="text-[8px] uppercase font-black text-primary/60 block tracking-tight">
                                                Jump ({currentItem.deltaFortune >= 0 ? '+' : ''}{currentItem.deltaFortune}):
                                            </span>
                                            <p className="text-[10px] text-foreground font-bold leading-tight italic">
                                                "{(['socio', 'econo', 'politico'] as const).map(l => getDeltaInterpretation('fortune', currentItem.deltaFortune, l).examples[0]).join(', ')}"
                                            </p>
                                        </div>
                                        <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10 space-y-1">
                                            <span className="text-[8px] uppercase font-black text-emerald-500/60 block tracking-tight">
                                                Jump ({currentItem.deltaEvolution >= 0 ? '+' : ''}{currentItem.deltaEvolution}):
                                            </span>
                                            <p className="text-[10px] text-foreground font-bold leading-tight italic">
                                                "{(['socio', 'econo', 'politico'] as const).map(l => getDeltaInterpretation('evolution', currentItem.deltaEvolution, l).examples[0]).join(', ')}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 grow overflow-y-auto custom-scrollbar pr-1">
                                        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 space-y-1">
                                            <span className="text-[8px] uppercase font-black text-primary/60 block tracking-tight">
                                                Fortune Level ({currentItem.fortune}):
                                            </span>
                                            <p className="text-[10px] text-foreground font-bold leading-tight italic">
                                                "{(['socio', 'econo', 'politico'] as const).map(l => getFortuneInterpretation(currentItem.fortune, l).examples[0]).join(', ')}"
                                            </p>
                                        </div>
                                        <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10 space-y-1">
                                            <span className="text-[8px] uppercase font-black text-emerald-500/60 block tracking-tight">
                                                Evolution Level ({currentItem.evolution}):
                                            </span>
                                            <p className="text-[10px] text-foreground font-bold leading-tight italic">
                                                "{(['socio', 'econo', 'politico'] as const).map(l => getEvolutionInterpretation(currentItem.evolution, l).examples[0]).join(', ')}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Narrative Summary Section - Fixed Height */}
                                <div className="w-full bg-primary/10 border-t border-primary/20 p-4 shrink-0 mt-auto">
                                    <p className="text-[11px] leading-relaxed text-foreground font-medium italic text-center">
                                        "{generateSummary(currentItem as Extract<FlowItem, { type: 'character' }>)}"
                                    </p>
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
