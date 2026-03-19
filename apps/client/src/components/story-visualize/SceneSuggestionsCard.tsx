import { StoryData } from '@/types/story'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Sparkles } from 'lucide-react'
import { heroJourneyDetails, getFortuneInterpretation, getEvolutionInterpretation } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

interface Props {
    data: StoryData
    currentEventIndex: number
    onClose: () => void
}

export function SceneSuggestionsCard({ data, currentEventIndex, onClose }: Props) {
    const currentEvent = data.events[currentEventIndex]
    
    // We assume heroJourney structure directly here, mapping by 12 steps
    const stepIndex = currentEventIndex % heroJourneyDetails.length
    const beat = heroJourneyDetails[stepIndex]

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
                        
                        const fortuneDesc = getFortuneInterpretation(fortuneVal)
                        const evolutionDesc = getEvolutionInterpretation(evolutionVal)
                        
                        return (
                            <div key={char.id} className="flex items-start p-3 rounded-lg bg-background/50 border border-white/5 gap-4">
                                {/* Character Left */}
                                <div className="flex items-center gap-2 w-28 shrink-0 mt-1">
                                    <div 
                                        className="size-2 rounded-full shadow-sm shrink-0"
                                        style={{ backgroundColor: char.color }}
                                    />
                                    <span className="text-sm font-bold truncate">{char.name}</span>
                                </div>
                                
                                {/* Stats Right */}
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="text-[9px] font-semibold text-muted-foreground uppercase">Fortune ({fortuneVal})</div>
                                        <Badge variant="outline" className="text-[10px] bg-background justify-center border-primary/20 py-1 pointer-events-none text-center h-auto leading-tight whitespace-normal">
                                            {fortuneDesc.label}
                                        </Badge>
                                        <ul className="list-disc pl-3 text-[9px] text-muted-foreground/80 space-y-0.5 ml-0.5">
                                            {fortuneDesc.examples.map((ex, i) => (
                                                <li key={i} className="leading-snug">{ex}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="text-[9px] font-semibold text-muted-foreground uppercase">Dev ({evolutionVal})</div>
                                        <Badge variant="outline" className="text-[10px] bg-background justify-center border-primary/20 py-1 pointer-events-none text-center h-auto leading-tight whitespace-normal">
                                            {evolutionDesc.label}
                                        </Badge>
                                        <ul className="list-disc pl-3 text-[9px] text-muted-foreground/80 space-y-0.5 ml-0.5">
                                            {evolutionDesc.examples.map((ex, i) => (
                                                <li key={i} className="leading-snug">{ex}</li>
                                            ))}
                                        </ul>
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
