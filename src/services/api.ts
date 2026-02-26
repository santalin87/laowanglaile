import { WordCloudItem, SearchResult } from '../types';

// 替换为你的 GAS Web App URL
// 例如: https://script.google.com/macros/s/AKfycb.../exec
export const GAS_URL = import.meta.env.VITE_GAS_URL || '';

// 模拟数据 (当未配置 GAS_URL 时使用)
const mockWordCloud: WordCloudItem[] = [
  { name: 'react', value: 100 },
  { name: 'javascript', value: 80 },
  { name: 'youtube', value: 60 },
  { name: 'video', value: 50 },
  { name: 'api', value: 40 },
  { name: 'google', value: 30 },
  { name: 'sheets', value: 20 },
  { name: 'frontend', value: 15 },
  { name: 'backend', value: 10 },
  { name: 'database', value: 5 },
];

const mockSearchResults: SearchResult[] = [
  { videoId: 'dQw4w9WgXcQ', startTime: 10, text: 'Never gonna give you up, never gonna let you down' },
  { videoId: 'dQw4w9WgXcQ', startTime: 42, text: 'Never gonna run around and desert you' },
  { videoId: 'jNQXAC9IVRw', startTime: 5, text: 'Me at the zoo, talking about elephants' },
];

export async function getWordCloud(): Promise<WordCloudItem[]> {
  if (!GAS_URL) {
    console.warn('未配置 GAS_URL，使用模拟词云数据');
    return new Promise(resolve => setTimeout(() => resolve(mockWordCloud), 500));
  }
  try {
    const response = await fetch(`${GAS_URL}?action=getWordCloud`);
    return await response.json();
  } catch (error) {
    console.error('获取词云失败:', error);
    throw error;
  }
}

export async function searchVideos(keyword: string): Promise<SearchResult[]> {
  if (!GAS_URL) {
    console.warn('未配置 GAS_URL，使用模拟搜索结果');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockSearchResults.filter(r => r.text.toLowerCase().includes(keyword.toLowerCase())));
      }, 500);
    });
  }
  try {
    const response = await fetch(`${GAS_URL}?action=search&keyword=${encodeURIComponent(keyword)}`);
    return await response.json();
  } catch (error) {
    console.error('搜索视频失败:', error);
    throw error;
  }
}
