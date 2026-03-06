import { RichEditor } from '@/components/story-write/RichEditor'

export const metadata = {
    title: 'Story Write | QuickPlot',
    description: 'Draft your story with a focused, professional workspace.',
}

export default function WritePage() {
    return (
        <main className="h-screen bg-[#F9FBFD] dark:bg-black overflow-hidden flex flex-col">
            <RichEditor />
        </main>
    )
}
