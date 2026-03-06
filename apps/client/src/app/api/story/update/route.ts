import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const updatedStory = await request.json();

        // Path to the mock-story file
        const filePath = path.join(process.cwd(), 'src', 'data', 'mock-story.json');

        // We can just overwrite since we're passing the whole object usually, 
        // but let's be safe and merge top-level keys if needed.
        // Actually, for this app, passing the full new state is cleaner.

        await fs.writeFile(filePath, JSON.stringify(updatedStory, null, 2), 'utf8');

        return NextResponse.json({ success: true, message: 'Story updated permanently' });
    } catch (error) {
        console.error('Error updating mock story:', error);
        return NextResponse.json({ success: false, error: 'Failed to update story' }, { status: 500 });
    }
}
