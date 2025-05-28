'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, LayoutGrid, SortDesc, X, Crown, Sparkles, ChevronDown } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import Loading from "@/components/Loading/Loading"

type LinkItem = {
  id: string
  name: string
  category: string
  postDate: string
  slug: string
}

type Category = {
  id: string
  name: string
  category: string
}

type PaginatedResponse = {
  page: number
  perPage: number
  total: number
  totalPages: number
  data: LinkItem[]
}

const months = [
  { value: "", label: "All Months" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

export function FreeContent({ initialContent }: { initialContent: PaginatedResponse }) {
  const router = useRouter()
  const [links, setLinks] = useState<LinkItem[]>(initialContent.data)
  const [filteredLinks, setFilteredLinks] = useState<LinkItem[]>(initialContent.data)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchName, setSearchName] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [sortOption, setSortOption] = useState<string>("mostRecent")
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreContent, setHasMoreContent] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(initialContent.totalPages)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    // Extract categories from initial content
    const uniqueCategories = Array.from(
      new Set(initialContent.data.map(item => item.category))
    ).map(category => ({
      id: category,
      name: category,
      category: category,
    }))
    setCategories(uniqueCategories)
  }, [initialContent])

  const fetchMoreContent = async () => {
    if (loadingMore) return

    try {
      setLoadingMore(true)
      const nextPage = currentPage + 1
      
      const response = await fetch(`/api/content/free?` + new URLSearchParams({
        page: nextPage.toString(),
        search: searchName,
        category: selectedCategory,
        month: selectedMonth,
        sortBy: 'postDate',
        sortOrder: sortOption === 'mostRecent' ? 'DESC' : 'ASC'
      }))

      if (!response.ok) throw new Error('Failed to fetch more content')

      const newContent = await response.json()
      
      setLinks(prev => [...prev, ...newContent.data])
      setFilteredLinks(prev => [...prev, ...newContent.data])
      setCurrentPage(nextPage)
      setHasMoreContent(nextPage < newContent.totalPages)
      setTotalPages(newContent.totalPages)

    } catch (error) {
      setError('Failed to load more content')
    } finally {
      setLoadingMore(false)
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit", 
      year: "numeric",
      timeZone: "America/Sao_Paulo"
    })
  }

  const groupedLinks: { [key: string]: LinkItem[] } = {}
  
  filteredLinks
    .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime())
    .forEach((link) => {
      const formattedDate = formatDate(link.postDate)
      if (!groupedLinks[formattedDate]) {
        groupedLinks[formattedDate] = []
      }
      groupedLinks[formattedDate].push(link)
    })

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  const handleBecomeVIP = () => {
    router.push("/plans")
  }

  // Rest of the component remains the same, just update navigation to use Next.js router
  // and replace <Link> components with Next.js Link component

  return (
    // Existing JSX remains the same, just update navigation/routing related code
    // to use Next.js components and hooks
  )
}