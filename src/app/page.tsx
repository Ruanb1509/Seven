import { Metadata } from 'next'
import { FreeContent } from '@/components/FreeContent'

export const metadata: Metadata = {
  title: 'Sevenxleaks - Free Content',
  description: 'Browse our free content collection',
}

async function getFreeContent(page = 1, category = '', month = '', search = '') {
  const response = await fetch(`${process.env.BACKEND_URL}/freecontent/search?` + new URLSearchParams({
    page: page.toString(),
    category,
    month,
    search,
    sortBy: 'postDate',
    sortOrder: 'DESC',
    limit: '900'
  }), {
    headers: {
      'x-api-key': process.env.FRONTEND_API_KEY || '',
    },
    next: { revalidate: 60 } // Revalidate every minute
  })

  if (!response.ok) {
    throw new Error('Failed to fetch content')
  }

  return response.json()
}

export default async function Home() {
  const initialContent = await getFreeContent()
  
  return (
    <main>
      <FreeContent initialContent={initialContent} />
    </main>
  )
}