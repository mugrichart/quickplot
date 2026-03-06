"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Edit3, LayoutDashboard, Settings, History, Home, PenTool, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

const navItems = [
    { icon: BarChart3, label: 'Visualize', href: '/story/visualize' },
    { icon: PenTool, label: 'Write', href: '/story/write' },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-16 flex flex-col items-center py-6 bg-background/60 backdrop-blur-xl border-r border-primary/10 z-50">
            <div className="mb-8 flex items-center justify-center">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <Edit3 className="size-6 text-primary" />
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-4">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                                <Link href={item.href}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "size-12 rounded-2xl transition-all duration-300",
                                            isActive
                                                ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] border border-primary/20"
                                                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                        )}
                                    >
                                        <item.icon className="size-6" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-background/95 backdrop-blur-md border-primary/20 text-primary font-bold">
                                {item.label}
                            </TooltipContent>
                        </Tooltip>
                    )
                })}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-12 rounded-2xl text-muted-foreground hover:bg-primary/5 hover:text-primary">
                            <History className="size-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">History</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-12 rounded-2xl text-muted-foreground hover:bg-primary/5 hover:text-primary">
                            <Settings className="size-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </div>
        </aside>
    )
}
