"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StoryData } from '@/types/story'

interface Props {
    data: StoryData
    selectedCharacterIds: string[]
    currentEventIndex: number
}

export function EventsChart({ data, selectedCharacterIds, currentEventIndex }: Props) {
    const chartData = data.events.slice(0, currentEventIndex + 1).map((event, index) => ({
        name: event.label,
        index,
        ...event.characterFortunes
    }))

    return (
        <Card className="h-full border-none shadow-none bg-transparent">
            <CardHeader className="py-2 px-4">
                <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Character Fortune (Opportunity vs Conflict)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '10px' }}
                            itemStyle={{ fontSize: '10px' }}
                        />

                        <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />

                        {data.characters.filter(c => selectedCharacterIds.includes(c.id)).map(char => (
                            <Line
                                key={char.id}
                                type="monotone"
                                dataKey={char.id}
                                name={char.name}
                                stroke={char.color}
                                strokeWidth={2}
                                dot={{ r: 2 }}
                                activeDot={{ r: 4 }}
                                isAnimationActive={false}
                            />
                        ))}

                        {/* Current step indicator */}
                        <ReferenceLine x={chartData[currentEventIndex]?.name} stroke="hsl(var(--primary))" strokeWidth={1} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
