import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const places = await request.json();

        // Path to the mock-story file
        const filePath = path.join(process.cwd(), 'src', 'data', 'mock-story.json');

        // Read existing file
        const fileContent = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        // Update places
        data.places = places;

        // Save back to file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

        return NextResponse.json({ success: true, message: 'Places updated permanently' });
    } catch (error) {
        console.error('Error updating mock story:', error);
        return NextResponse.json({ success: false, error: 'Failed to update places' }, { status: 500 });
    }
}
