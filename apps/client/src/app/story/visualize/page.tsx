import { VisualizeOrchestrator } from '@/components/story-visualize/VisualizeOrchestrator'
import mockData from '@/data/mock-story.json'
import { StoryData } from '@/types/story'

export const metadata = {
    title: 'Story Visualize | QuickPlot',
    description: 'Visualize the evolution of your story world and characters.',
}

export default function VisualizePage() {
    // Cast mock data to StoryData type
    const data = mockData as StoryData

    return (
        <main className="min-h-screen bg-background">
            <VisualizeOrchestrator initialData={data} />
        </main>
    )
}
