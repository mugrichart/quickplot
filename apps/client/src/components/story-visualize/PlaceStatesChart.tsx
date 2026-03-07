"use client"

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { StoryData } from '@/types/story'
import referenceData from '@/data/story-reference.json'

interface Props {
    data: StoryData
    currentEventIndex: number
}

export function PlaceStatesChart({ data, currentEventIndex }: Props) {
    const currentEvent = data.events[currentEventIndex]
    const placeScale = referenceData.scales.find(s => s.id === 'place_state')

    if (!currentEvent || !currentEvent.placeFortunes) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground text-[10px]">
                No place data available
            </div>
        )
    }

    const chartData = useMemo(() => {
        const fortunes = currentEvent.placeFortunes || {}
        const states = currentEvent.placeStates || {}

        return data.places.map(place => {
            const score = fortunes[place.id] ?? 0
            const level = placeScale?.levels.find(l => score >= l.min && score <= l.max)
            return {
                name: place.name,
                score,
                state: states[place.id] ?? level?.label ?? 'Unknown',
                emoji: place.emoji,
                color: level?.color ?? '#94a3b8'
            }
        })
    }, [currentEvent, data.places, placeScale])

    return (
        <Card className="h-full border-none shadow-none bg-transparent relative flex flex-col p-0">
            <div className="absolute top-2 left-4 z-10 pointer-events-none">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">
                    Place Prosperity & Condition
                </span>
            </div>
            <CardContent className="p-0 flex-1 relative min-h-0 pt-8 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis
                            dataKey="name"
                            fontSize={9}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            width={30}
                            fontSize={8}
                            tick={{ fill: 'hsl(var(--muted-foreground))', opacity: 0.4 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[-100, 100]}
                            ticks={[-100, -50, 0, 50, 100]}
                        />
                        <ReferenceLine y={100} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.1} />
                        <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.1} />
                        <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.3} />
                        <ReferenceLine y={-50} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.1} />
                        <ReferenceLine y={-100} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.1} />
                        <Tooltip
                            content={({ active, payload }: any) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload;
                                    const level = placeScale?.levels.find(l => item.score >= l.min && item.score <= l.max)
                                    return (
                                        <div className="bg-background/95 border rounded-lg shadow-xl p-2 text-[10px] backdrop-blur-md border-primary/20 min-w-[140px]">
                                            <div className="flex items-center gap-1.5 font-bold border-b pb-1 mb-1">
                                                <span>{item.emoji}</span>
                                                <span className="text-primary">{item.name}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Condition:</span>
                                                    <span className="font-bold" style={{ color: item.color }}>{level?.label ?? item.state}</span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-border/20 pt-1 mt-0.5">
                                                    <span className="text-muted-foreground italic text-[8px] leading-tight max-w-[120px]">
                                                        {level?.description}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-border/20 pt-1">
                                                    <span className="text-muted-foreground">Score:</span>
                                                    <span className="font-bold tabular-nums">
                                                        {item.score > 0 ? `+${item.score}` : item.score}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="score"
                            radius={4}
                            barSize={32}
                            isAnimationActive={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    fillOpacity={0.8}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
