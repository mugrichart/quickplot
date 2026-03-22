import { StoryData } from '@/types/story'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Sparkles } from 'lucide-react'
import { heroJourneyDetails, getFortuneInterpretation, getEvolutionInterpretation, SCENES_PER_BEAT } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

interface Props {
    data: StoryData
    currentEventIndex: number
    onClose: () => void
}

export function SceneSuggestionsCard({ data, currentEventIndex, onClose }: Props) {
    const currentEvent = data.events[currentEventIndex]
    
    // We assume heroJourney structure directly here, mapping by 12 steps
    const beatIndex = Math.floor(currentEventIndex / SCENES_PER_BEAT) % heroJourneyDetails.length
    const beat = heroJourneyDetails[beatIndex]

    if (!currentEvent) return null

    return (
        <Card className="w-[480px] bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl pointer-events-auto flex flex-col max-h-[70vh]">
            <CardHeader className="p-4 border-b border-white/5 shrink-0 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <CardTitle className="text-sm font-black uppercase tracking-wider text-foreground">
                        Scene Suggestions
                    </CardTitle>
                </div>
                <Button variant="ghost" size="icon-xs" onClick={onClose} className="hover:bg-primary/20">
                    <X className="size-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-1">
                <div className="p-4 border-b border-primary/10 bg-primary/5">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Current Beat</h3>
                    <div className="text-lg font-black text-foreground drop-shadow-sm mb-1">{beat.name}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{beat.description}</p>
                </div>

                <div className="p-4 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Character Directions</h3>
                    {data.characters.map(char => {
                        const fortuneVal = currentEvent.characterFortunes?.[char.id] ?? 0
                        const evolutionVal = currentEvent.characterEvolution?.[char.id] ?? 0
                        const lenses = ['socio', 'econo', 'politico'] as const;
                        
                        return (
                            <div key={char.id} className="p-3 rounded-lg bg-background/50 border border-white/5 space-y-3">
                                {/* Character Header */}
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="size-2 rounded-full shadow-sm shrink-0"
                                        style={{ backgroundColor: char.color }}
                                    />
                                    <span className="text-sm font-black text-foreground">{char.name}</span>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Fortune Section */}
                                    <div className="space-y-2">
                                        <div className="text-[9px] font-black text-primary uppercase tracking-tighter border-b border-primary/10 pb-0.5 flex justify-between">
                                            <span>External Fortune</span>
                                            <span className="opacity-60">{Math.round(fortuneVal)}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {lenses.map(l => {
                                                const d = getFortuneInterpretation(fortuneVal, l);
                                                return (
                                                    <div key={l} className="space-y-1">
                                                        <div className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">{l}</div>
                                                        <div className="text-[10px] font-bold text-foreground leading-tight">{d.label}</div>
                                                        <p className="text-[8px] text-muted-foreground leading-tight italic line-clamp-2">"{d.examples[0]}"</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Evolution Section */}
                                    <div className="space-y-2">
                                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter border-b border-emerald-500/10 pb-0.5 flex justify-between">
                                            <span>Internal Evolution</span>
                                            <span className="opacity-60">{Math.round(evolutionVal)}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {lenses.map(l => {
                                                const d = getEvolutionInterpretation(evolutionVal, l);
                                                return (
                                                    <div key={l} className="space-y-1">
                                                        <div className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">{l}</div>
                                                        <div className="text-[10px] font-bold text-foreground leading-tight">{d.label}</div>
                                                        <p className="text-[8px] text-muted-foreground leading-tight italic line-clamp-2">"{d.examples[0]}"</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
