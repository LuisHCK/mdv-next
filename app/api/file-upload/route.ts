import { addPhotosToSession } from '@/lib/pocketbase'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')?.value
    const formData = await request.formData()
    const file = formData.get('file') as File

    const updatedSession = await addPhotosToSession(
        formData.get('id') as string,
        [file],
        String(authToken)
    )

    if (!updatedSession) {
        return new NextResponse('Session not found', { status: 404 })
    }

    return NextResponse.json({ updatedSession }, { status: 200 })
}

export async function GET(request: NextRequest) {
    console.log('GET received', request)
    return new Response('GET response')
}
