import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import 'echarts-wordcloud';
import { WordCloudItem } from '../types';
import { getWordCloud } from '../services/api';

interface WordCloudProps {
  onWordClick: (word: string) => void;
}

export default function WordCloud({ onWordClick }: WordCloudProps) {
  const [data, setData] = useState<WordCloudItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWordCloud();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch word cloud data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const option = {
    tooltip: {
      show: true,
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        keepAspect: false,
        left: 'center',
        top: 'center',
        width: '100%',
        height: '100%',
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          color: function () {
            return (
              'rgb(' +
              [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
              ].join(',') +
              ')'
            );
          },
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            textShadowBlur: 10,
            textShadowColor: '#333',
          },
        },
        data: data,
      },
    ],
  };

  const onEvents = {
    click: (params: any) => {
      if (params.data && params.data.name) {
        onWordClick(params.data.name);
      }
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-80 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">热门关键词云图</h2>
      <div className="flex-1 w-full">
        <ReactECharts
          option={option}
          onEvents={onEvents}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}
