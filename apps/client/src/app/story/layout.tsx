import { Sidebar } from '@/components/Sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function StoryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <TooltipProvider>
            <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20">
                <Sidebar />
                <div className="flex-1 pl-16 overflow-hidden">
                    {children}
                </div>
            </div>
        </TooltipProvider>
    )
}
