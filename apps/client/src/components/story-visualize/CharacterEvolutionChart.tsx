"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StoryData, Character } from '@/types/story'

interface Props {
    data: StoryData
    selectedCharacterIds: string[]
    currentEventIndex: number
}

export function CharacterEvolutionChart({ data, selectedCharacterIds, currentEventIndex }: Props) {
    // Transform data for recharts
    const chartData = data.events.map((event, index) => ({
        name: event.label,
        index,
        ...event.characterEvolution
    }))

    return (
        <Card className="h-full">
            <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Character Evolution</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ fontSize: '12px' }}
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
