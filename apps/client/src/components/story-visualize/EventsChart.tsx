"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StoryData } from '@/types/story'

interface Props {
    data: StoryData
    currentEventIndex: number
}

export function EventsChart({ data, currentEventIndex }: Props) {
    const chartData = data.events.map((event, index) => ({
        name: event.label,
        good: event.occurrences.good,
        bad: event.occurrences.bad,
        opacity: index === currentEventIndex ? 1 : 0.3
    }))

    return (
        <Card className="h-full">
            <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Events: Opportunity vs Conflict</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Bar dataKey="good" fill="#22c55e" radius={[4, 4, 0, 0]} name="Opportunities" />
                        <Bar dataKey="bad" fill="#ef4444" radius={[4, 4, 0, 0]} name="Conflicts" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
