import React, { useState } from 'react';
import WordCloud from './components/WordCloud';
import SearchList from './components/SearchList';
import VideoPlayer from './components/VideoPlayer';
import { SearchResult } from './types';
import { Search, Youtube, Database, Code, Settings } from 'lucide-react';

export default function App() {
  const [keyword, setKeyword] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<SearchResult | null>(null);

  const handleWordClick = (word: string) => {
    setKeyword(word);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl shadow-sm">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              YouTube 视频关键词检索
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <Database className="w-4 h-4" /> Google Sheets
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <Code className="w-4 h-4" /> GAS API
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Word Cloud & Info */}
          <div className="lg:col-span-4 space-y-6">
            <WordCloud onWordClick={handleWordClick} />
            
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-indigo-900 font-semibold mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                如何配置自己的数据源？
              </h3>
              <ol className="text-sm text-indigo-800 space-y-2 list-decimal pl-4">
                <li>复制 <code>gas/Code.gs</code> 代码到 Google Apps Script。</li>
                <li>部署为 Web App，获取 URL。</li>
                <li>在项目根目录创建 <code>.env</code> 文件，添加 <code>VITE_GAS_URL=你的URL</code>。</li>
                <li>准备 Google Sheets 数据：A列(Video_ID), B列(Start_Time), C列(Text)。</li>
              </ol>
            </div>
          </div>

          {/* Right Column: Search & Results */}
          <div className="lg:col-span-8 h-[calc(100vh-8rem)]">
            <SearchList 
              keyword={keyword} 
              onKeywordChange={setKeyword} 
              onSelectVideo={setSelectedVideo} 
            />
          </div>

        </div>
      </main>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}
    </div>
  );
}
