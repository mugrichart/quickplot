"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PenTool, Sparkles, BookOpen, Clock, BarChart3, LayoutDashboard } from 'lucide-react'
import { motion } from 'framer-motion'
import mockData from '@/data/mock-story.json'
import { StoryData } from '@/types/story'

export default function WritePage() {
    const data = mockData as StoryData

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center py-20 px-8">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full space-y-12"
            >
                {/* Header Section */}
                <header className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/5">
                            <PenTool className="size-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Drafting Chamber</h1>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                        Pour your thoughts into "The Hidden Legacy". Every word shapes the future of this world.
                    </p>
                </header>

                {/* Focus Editor Placeholder */}
                <Card className="bg-background/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-[32px] overflow-hidden">
                    <CardHeader className="border-b border-white/5 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <CardTitle className="text-xl font-bold uppercase tracking-widest text-primary/80">Active Sequence</CardTitle>
                                <div className="h-4 w-px bg-white/10" />
                                <span className="text-sm font-black text-muted-foreground opacity-60 uppercase tracking-widest">Chapter 1: The Awakening</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="rounded-full border-primary/20 hover:bg-primary/5 gap-2 uppercase font-black text-[10px] tracking-widest">
                                    <Sparkles className="size-3" /> AI Enhancer
                                </Button>
                                <Button size="sm" className="rounded-full gap-2 uppercase font-black text-[10px] tracking-widest shadow-lg shadow-primary/20">
                                    Save Draft
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-12">
                        <div className="space-y-8 min-h-[400px]">
                            <textarea
                                className="w-full bg-transparent border-none outline-hidden text-2xl font-serif leading-relaxed text-foreground placeholder:text-muted-foreground/30 resize-none min-h-[400px]"
                                placeholder="Once upon a time in the realm of QuickPlot..."
                                defaultValue="The shadows of the old empire grew longer as the sun dipped below the jagged peaks of Valoria. Elena clutched the crystal, its faint resonance vibrating through her armor. The path lay open, yet the silence was more deafening than the roar of battle she expected..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { icon: BookOpen, label: 'Word Count', value: '4,102' },
                        { icon: Clock, label: 'Est. Read Time', value: '18 min' },
                        { icon: BarChart3, label: 'Characters', value: data.characters.length },
                        { icon: LayoutDashboard, label: 'Scenes', value: data.events.length },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-background/20 backdrop-blur-md border border-white/5 shadow-xl hover:border-primary/20 transition-all duration-300">
                            <CardContent className="p-6 flex flex-col items-center gap-2">
                                <stat.icon className="size-5 text-primary/60" />
                                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">{stat.label}</span>
                                <span className="text-xl font-black">{stat.value}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
