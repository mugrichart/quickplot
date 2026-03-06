import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StoryData } from '@/types/story'
import referenceData from '@/data/story-reference.json'

interface Props {
    data: StoryData
    selectedCharacterIds: string[]
    currentEventIndex: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const scale = referenceData.scales.find(s => s.id === 'evolution');

        return (
            <div className="bg-background border rounded-lg shadow-xl p-3 text-[10px] space-y-2 min-w-[150px] pointer-events-auto">
                <p className="font-bold border-b pb-1 mb-1">{label}</p>
                <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1 pb-1 overscroll-contain scrollbar-thin">
                    {payload.map((entry: any) => {
                        const level = scale?.levels.find(l => entry.value >= l.min && entry.value <= l.max);
                        return (
                            <div key={entry.name} className="flex flex-col gap-0.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke }} />
                                        <span className="font-medium">{entry.name}:</span>
                                    </div>
                                    <span className="font-bold">{entry.value}</span>
                                </div>
                                {level && (
                                    <div className="flex items-center gap-1 pl-3.5 italic opacity-80">
                                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: level.color }} />
                                        <span>Level: {level.label}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    return null;
};

export function CharacterEvolutionChart({ data, selectedCharacterIds, currentEventIndex }: Props) {
    const [showAutoTooltip, setShowAutoTooltip] = useState(false)

    useEffect(() => {
        setShowAutoTooltip(true)
        const timer = setTimeout(() => setShowAutoTooltip(false), 5000)
        return () => clearTimeout(timer)
    }, [currentEventIndex])

    // Transform data for recharts - only show up to current event
    const chartData = data.events.slice(0, currentEventIndex + 1).map((event, index) => ({
        name: event.label,
        index,
        ...event.characterEvolution
    }))

    const currentEvent = data.events[currentEventIndex]
    const scale = referenceData.scales.find(s => s.id === 'evolution')

    return (
        <Card className="h-full border-none shadow-none bg-transparent relative flex flex-col p-0">
            <div className="absolute top-2 left-4 z-10 pointer-events-none">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">
                    Character&apos;s Character Evolution
                </span>
            </div>
            <CardContent className="p-0 flex-1 relative min-h-0">
                {/* Auto-Tooltip Overlay (Matches Hover Style) */}
                {/* Auto-Tooltip Overlay (Matches Hover Style) */}
                <AnimatePresence>
                    {showAutoTooltip && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-2 right-4 z-50 pointer-events-auto"
                        >
                            <div className="bg-background/95 border rounded-lg shadow-xl p-3 text-[10px] space-y-2 min-w-[160px] backdrop-blur-md border-primary/20">
                                <p className="font-bold border-b pb-1 mb-1 text-primary">{currentEvent.label}</p>
                                <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1 pb-1 overscroll-contain scrollbar-thin">
                                    {data.characters
                                        .filter(c => selectedCharacterIds.includes(c.id))
                                        .map(char => {
                                            const val = currentEvent.characterEvolution[char.id]
                                            const level = scale?.levels.find(l => val >= l.min && val <= l.max)
                                            return (
                                                <div key={char.id} className="flex flex-col gap-0.5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: char.color }} />
                                                            <span className="font-medium text-muted-foreground">{char.name}:</span>
                                                        </div>
                                                        <span className="font-bold">{val}</span>
                                                    </div>
                                                    {level && (
                                                        <div className="flex items-center gap-1 pl-3.5 italic opacity-80 text-[9px]">
                                                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: level.color }} />
                                                            <span className="text-muted-foreground">Level: <span className="text-foreground font-semibold">{level.label}</span></span>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={[-110, 110]} />
                        <Tooltip
                            content={<CustomTooltip />}
                            offset={-60} // Raised even more to avoid clipping Merlin at the bottom
                        />

                        {/* Background colors for good/bad areas */}
                        <ReferenceArea y1={0} y2={100} fill="rgba(34, 197, 94, 0.05)" stroke="none" />
                        <ReferenceArea y1={-100} y2={0} fill="rgba(239, 68, 68, 0.05)" stroke="none" />
                        <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />

                        {data.characters.filter(c => selectedCharacterIds.includes(c.id)).map(char => (
                            <Line
                                key={char.id}
                                type="monotone"
                                dataKey={char.id}
                                name={char.name}
                                stroke={char.color}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                isAnimationActive={false}
                            />
                        ))}

                        {/* Current step indicator */}
                        <ReferenceLine x={chartData[currentEventIndex]?.name} stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
