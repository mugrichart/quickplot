import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'map');
        const fileContent = await fs.readFile(filePath);
        return new Response(fileContent);
    } catch (e) {
        return new Response('Not found', { status: 404 });
    }
}

export async function HEAD() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'map');
        await fs.access(filePath);
        return new Response(null, { status: 200 });
    } catch {
        return new Response(null, { status: 404 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('map') as File;
        if (!file) {
            return NextResponse.json({ success: false, error: 'No map file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(process.cwd(), 'src', 'data', 'map');
        
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({ success: true, url: '/api/map' });
    } catch (error) {
        console.error('Error uploading map:', error);
        return NextResponse.json({ success: false, error: 'Failed to upload map' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'map');
        await fs.unlink(filePath);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete map' }, { status: 500 });
    }
}
