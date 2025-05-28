import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Search, Calendar, LayoutGrid, SortDesc, X, Crown, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from "../contexts/ThemeContext";

type LinkItem = {
  id: string;
  name: string;
  category: string;
  postDate: string;
  slug: string;
};

type Category = {
  id: string;
  name: string;
  category: string;
};

type PaginatedResponse = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: LinkItem[];
};

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
];

const Loading = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function Freecontent() {
  const navigate = useNavigate();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<LinkItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("mostRecent");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreContent, setHasMoreContent] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const { theme } = useTheme();

  useEffect(() => {
    document.title = "Sevenxleaks";
  }, []);

  const fetchContent = async (page: number, isLoadMore = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        search: searchName,
        category: selectedCategory,
        month: selectedMonth,
        sortBy: 'postDate',
        sortOrder: sortOption === 'mostRecent' ? 'DESC' : 'ASC',
        limit: '900'
      });

      const response = await axios.get<PaginatedResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/freecontent/search?${params}`,
        {
          headers: {
            'x-api-key': `${import.meta.env.VITE_FRONTEND_API_KEY}`
          }
        }
      );

      const { data, totalPages } = response.data;
      
      if (isLoadMore) {
        setLinks(prev => [...prev, ...data]);
        setFilteredLinks(prev => [...prev, ...data]);
      } else {
        setLinks(data);
        setFilteredLinks(data);
      }

      setTotalPages(totalPages);
      setHasMoreContent(page < totalPages);
      
      // Extract categories from the response
      const uniqueCategories = Array.from(
        new Set(data.map(item => item.category))
      ).map(category => ({
        id: category,
        name: category,
        category: category,
      }));

      setCategories(prev => {
        const existingCategories = new Set(prev.map(c => c.category));
        const newCategories = uniqueCategories.filter(c => !existingCategories.has(c.category));
        return [...prev, ...newCategories];
      });

    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchContent(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchName, selectedMonth, selectedCategory, sortOption]);

  const handleLoadMore = () => {
    if (loadingMore || currentPage >= totalPages) return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchContent(nextPage, true);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const [month, day, year] = date
      .toLocaleDateString("en-US", options)
      .split("/");

    return `${month}/${day}/${year}`;
  };

  const recentLinks = filteredLinks.slice(0, 5);

const groupedLinks: { [key: string]: LinkItem[] } = {};

filteredLinks
  .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime())
  .forEach((link) => {
    const formattedDate = formatDate(link.postDate);
    if (!groupedLinks[formattedDate]) {
      groupedLinks[formattedDate] = [];
    }
    groupedLinks[formattedDate].push(link);
  });

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleBecomeVIP = () => {
    navigate("/plans");
  };

  return (
    <div className={`min-h-screen zoom-80 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} zoom-90`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setShowPopup(true)}
            className="py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Upgrade to VIP
          </button>
        </div>
      
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
            <div 
              className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-fadeIn`}
              style={{maxWidth: "450px"}}
            >
              <div className="relative">
                <button
                  onClick={handleClosePopup}
                  className="absolute -right-2 -top-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <Crown className="w-16 h-16 text-yellow-400" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-yellow-400/20 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
                <h2 className={`text-3xl font-bold text-center mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Unlock Premium Experience
                </h2>
                <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Upgrade to VIP for an ad-free experience and exclusive content.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={handleBecomeVIP}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
                  >
                    <Sparkles className="w-6 h-6" />
                    <span>Become VIP Now</span>
                  </button>
                  <button
                    onClick={handleClosePopup}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Continue with Ads
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-2xl p-8 mb-12 border`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
              {searchLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-200'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <LayoutGrid className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-200'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.category}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <SortDesc className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-200'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                <option value="mostRecent">Most Recent</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {loading ? (
            <Loading />
          ) : Object.keys(groupedLinks).length > 0 ? (
            <>
              {Object.keys(groupedLinks)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
              .map((date) => (          
                <div 
                  key={date} 
                  className={`${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  } rounded-3xl shadow-2xl overflow-hidden border`}
                >
                  <div className={`${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-gray-700'
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200'
                  } px-8 py-4 border-b`}>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {date}
                    </h3>
                  </div>
                  <div className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {groupedLinks[date].map((link: LinkItem) => (
                      <div 
                        key={link.id} 
                        className={`px-6 py-4 transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'hover:bg-gray-700/50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <Link
                          to={`/free/${link.slug}`}
                          className="flex items-center justify-between group"
                        >
                          <span className={`text-lg transition-colors duration-200 ${
                            theme === 'dark'
                              ? 'text-gray-200 group-hover:text-blue-400'
                              : 'text-gray-700 group-hover:text-blue-600'
                          }`}>
                            {link.name}
                          </span>
                          {recentLinks.includes(link) && (
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                              NEW
                            </span>
                          )}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {hasMoreContent && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className={`px-8 py-3.5 flex items-center justify-center space-x-2 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-xl ${
                      loadingMore 
                        ? 'bg-gray-400' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                    }`}
                  >
                    {loadingMore ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <span>More Leaks</span>
                        <ChevronDown className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={`text-center py-16 rounded-3xl border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className="text-gray-400 mb-6">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No Content Found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
          
          {loadingMore && (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Loading more leaks...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Freecontent;