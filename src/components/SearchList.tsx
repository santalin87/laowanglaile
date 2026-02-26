import React, { useState, useEffect } from 'react';
import { SearchResult } from '../types';
import { searchVideos } from '../services/api';
import { Search, PlayCircle, Loader2 } from 'lucide-react';

interface SearchListProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSelectVideo: (result: SearchResult) => void;
}

export default function SearchList({ keyword, onKeywordChange, onSelectVideo }: SearchListProps) {
  const [inputValue, setInputValue] = useState(keyword);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setInputValue(keyword);
    if (keyword) {
      handleSearch(keyword);
    }
  }, [keyword]);

  const handleSearch = async (searchKeyword: string) => {
    if (!searchKeyword.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchVideos(searchKeyword);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onKeywordChange(inputValue);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">搜索视频片段</h2>
      
      <form onSubmit={onSubmit} className="relative mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入关键词搜索..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-700"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
        <button 
          type="submit"
          className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          搜索
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
            <p>正在搜索...</p>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <p>未找到包含 "{keyword}" 的视频片段</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div 
                key={`${result.videoId}-${result.startTime}-${index}`}
                onClick={() => onSelectVideo(result)}
                className="group p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 cursor-pointer transition-all flex items-start gap-4"
              >
                <div className="bg-indigo-100 text-indigo-700 rounded-lg p-2 flex-shrink-0 mt-1 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {formatTime(result.startTime)}
                    </span>
                    <span className="text-xs text-gray-400 truncate ml-2">
                      ID: {result.videoId}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                    {/* Highlight keyword */}
                    {result.text.split(new RegExp(`(${keyword})`, 'gi')).map((part, i) => 
                      part.toLowerCase() === keyword.toLowerCase() ? (
                        <span key={i} className="bg-yellow-200 text-yellow-900 font-medium px-0.5 rounded">{part}</span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
