import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const file = formData.get('file')

    return new Response('POST response')
}

export async function GET(request: NextRequest) {
    console.log('GET received', request)
    return new Response('GET response')
}
