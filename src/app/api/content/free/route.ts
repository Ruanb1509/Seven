import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const month = searchParams.get('month') || ''
  const sortBy = searchParams.get('sortBy') || 'postDate'
  const sortOrder = searchParams.get('sortOrder') || 'DESC'

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/freecontent/search?` + new URLSearchParams({
      page,
      search,
      category,
      month,
      sortBy,
      sortOrder,
      limit: '900'
    }), {
      headers: {
        'x-api-key': process.env.FRONTEND_API_KEY || '',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch content')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}