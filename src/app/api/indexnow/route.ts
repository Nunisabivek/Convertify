import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_KEY = 'a29f8518-295e-44e3-a00c-469addc370ce2'
const SITE_URL = 'https://convertify.work'

// IndexNow API endpoint
const INDEXNOW_ENDPOINTS = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
]

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { urls } = body

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: 'URLs array is required' },
                { status: 400 }
            )
        }

        // Submit to IndexNow
        const results = await Promise.all(
            INDEXNOW_ENDPOINTS.map(async (endpoint) => {
                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Host': new URL(endpoint).host
                        },
                        body: JSON.stringify({
                            host: 'convertify.work',
                            key: INDEXNOW_KEY,
                            keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
                            urlList: urls.map(url =>
                                url.startsWith('http') ? url : `${SITE_URL}${url}`
                            ),
                        }),
                    })

                    return {
                        endpoint,
                        status: response.status,
                        success: response.ok,
                    }
                } catch (error) {
                    return {
                        endpoint,
                        status: 500,
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    }
                }
            })
        )

        return NextResponse.json({
            message: 'IndexNow submission completed',
            results,
            urlsSubmitted: urls.length,
        })
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to submit to IndexNow',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
