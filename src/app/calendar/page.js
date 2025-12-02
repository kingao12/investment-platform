'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, TrendingUp, AlertCircle, Star } from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDark, setIsDark] = useState(false);

  // 다크모드 감지
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const events = [
    {
      id: 1,
      date: '2025-11-22',
      time: '23:00',
      title: 'FOMC 의사록 공개',
      country: 'US',
      importance: 'high',
      category: '금리',
      description: '연방공개시장위원회(FOMC) 11월 회의록 공개. 향후 통화정책 방향성에 대한 단서 제공.',
      impact: '달러 및 주식시장 변동성 예상',
    },
    {
      id: 2,
      date: '2025-11-23',
      time: '08:30',
      title: '미국 실업수당 청구건수',
      country: 'US',
      importance: 'medium',
      category: '고용',
      description: '주간 신규 실업수당 청구건수 발표',
      impact: '고용시장 건전성 지표',
    },
    {
      id: 3,
      date: '2025-11-23',
      time: '22:00',
      title: '테슬라 실적 발표',
      country: 'US',
      importance: 'high',
      category: '기업실적',
      description: 'Tesla Q3 2024 실적 발표',
      impact: '전기차 섹터 영향 예상',
    },
    {
      id: 6,
      date: '2025-11-24',
      time: '10:00',
      title: '한국 수출입 물가지수 발표',
      country: 'KR',
      importance: 'medium',
      category: '물가',
      description: '11월 수출입 물가지수 발표. 원자재 가격 변동 및 기업 수익성에 영향.',
      impact: '원화 및 수출주 단기 변동성 가능',
    },
    {
      id: 7,
      date: '2025-11-25',
      time: '22:30',
      title: '독일 IFO 기업환경지수 발표',
      country: 'DE',
      importance: 'medium',
      category: '경기',
      description: '독일 기업들의 경기 전망을 반영하는 핵심 지표.',
      impact: '유로화 및 유럽 증시에 영향',
    },
    {
      id: 8,
      date: '2025-11-26',
      time: '08:00',
      title: '한국 소비자심리지수(CSI)',
      country: 'KR',
      importance: 'low',
      category: '심리지표',
      description: '소비자들의 경제 상황과 경기 전망에 대한 심리지표 발표.',
      impact: '내수 경기 전망 확인 자료',
    },
    {
      id: 9,
      date: '2025-11-27',
      time: '22:30',
      title: '미국 GDP(3분기 수정치)',
      country: 'US',
      importance: 'high',
      category: '성장률',
      description: '미국 GDP 성장률 수정치 발표. 경기 방향성 판단에 핵심.',
      impact: '달러 및 S&P500 변동성 확대 예상',
    },
    {
    id: 10,
      date: '2025-11-27',
      time: '22:30',
      title: '미국 내구재 주문',
      country: 'US',
      importance: 'medium',
      category: '경기',
      description: '내구재 주문 수치는 제조업 경기의 선행지표 역할.',
      impact: '제조업 관련 종목 민감 반응',
    },
    {
      id: 11,
      date: '2025-11-28',
      time: '09:00',
      title: '한국 산업활동동향 발표',
      country: 'KR',
      importance: 'medium',
      category: '경기',
      description: '생산·소비·투자 등 주요 실물지표 발표.',
      impact: '경기 체감 방향성 확인',
    },
    {
      id: 12,
      date: '2025-11-28',
      time: '21:00',
      title: '유로존 소비자신뢰지수',
      country: 'EU',
      importance: 'low',
      category: '심리지표',
      description: '유럽의 소비자 심리 지표.',
      impact: '유럽 시장 전반적 기대감 파악',
    },
    {
      id: 13,
      date: '2025-11-29',
      time: '22:30',
      title: '미국 PCE 물가(코어 포함)',
      country: 'US',
      importance: 'high',
      category: '물가',
      description: '연준이 선호하는 물가지표 PCE 발표.',
      impact: 'FOMC 금리 정책에 직접 영향',
    },
    {
      id: 14,
      date: '2025-11-29',
      time: '22:30',
      title: '미국 개인소득 및 소비지출',
      country: 'US',
      importance: 'medium',
      category: '소비',
      description: '미국 소비 강도와 경제 회복세 판단 지표.',
      impact: '소비 관련 섹터 변동성 발생 가능',
    },
    {
      id: 15,
      date: '2025-11-30',
      time: '10:00',
      title: '중국 제조업 PMI 발표',
      country: 'CN',
      importance: 'high',
      category: '제조업',
      description: '11월 중국 경기 방향성을 가늠하는 제조업 PMI 지표.',
      impact: '원자재·중국 관련주·신흥국 시장 영향',
    },
    {
      id: 16,
      date: '2025-11-30',
      time: '10:00',
      title: '중국 비제조업 PMI 발표',
      country: 'CN',
      importance: 'medium',
      category: '서비스',
      description: '서비스·건설업 등 비제조업 분야 지표 발표.',
      impact: '중국 내수 경기 판단에 중요한 자료',
    },

    {
      id: 4,
      date: '2025-11-25',
      time: '09:00',
      title: '한국 소비자물가지수',
      country: 'KR',
      importance: 'medium',
      category: '인플레이션',
      description: '11월 소비자물가지수(CPI) 발표',
      impact: '한국은행 금리 결정에 영향',
    },
    {
      id: 5,
      date: '2025-11-26',
      time: '23:30',
      title: 'NVIDIA 실적 발표',
      country: 'US',
      importance: 'high',
      category: '기업실적',
      description: 'NVIDIA Q3 2024 실적 발표',
      impact: 'AI 반도체 시장 전망',
    },
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : events;

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getImportanceText = (importance) => {
    switch (importance) {
      case 'high': return '높음';
      case 'medium': return '중간';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${textColor}`}>경제 캘린더</h1>
          <p className={textSecondary}>주요 경제 지표 및 이벤트 일정</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 ${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={previousMonth}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className={`text-2xl font-bold ${textColor}`}>
                {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
              </h2>
              <button
                onClick={nextMonth}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day, index) => (
                <div
                  key={day}
                  className={`text-center font-semibold py-2 ${
                    index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : textColor
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : [];
                const isSelected = selectedDate && day && 
                  selectedDate.toDateString() === day.toDateString();
                const isToday = day && day.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => day && setSelectedDate(day)}
                    disabled={!day}
                    className={`aspect-square p-2 rounded-lg transition-all relative ${
                      !day ? 'invisible' :
                      isSelected ? 'bg-blue-600 text-white' :
                      isToday ? `border-2 border-blue-600 ${isDark ? 'bg-blue-900' : 'bg-blue-100'}` :
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    {day && (
                      <>
                        <div className="text-sm font-medium">{day.getDate()}</div>
                        {dayEvents.length > 0 && (
                          <div className="flex justify-center space-x-1 mt-1">
                            {dayEvents.slice(0, 3).map((event) => (
                              <div
                                key={event.id}
                                className={`w-1.5 h-1.5 rounded-full ${getImportanceColor(event.importance)}`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div className={`mt-6 pt-6 border-t ${borderColor}`}>
              <h3 className={`text-sm font-semibold mb-3 ${textColor}`}>중요도</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className={`text-sm ${textColor}`}>높음</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className={`text-sm ${textColor}`}>중간</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className={`text-sm ${textColor}`}>낮음</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-xl shadow-lg p-6 border ${borderColor}`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center ${textColor}`}>
              <CalendarIcon className="mr-2" size={20} />
              {selectedDate ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 일정` : '전체 일정'}
            </h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${borderColor} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getImportanceColor(event.importance)}`}></div>
                        <span className={`text-xs font-semibold ${textSecondary}`}>{event.country}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {event.category}
                      </span>
                    </div>

                    <h4 className={`font-bold mb-2 ${textColor}`}>{event.title}</h4>

                    <div className={`flex items-center space-x-2 text-sm ${textSecondary} mb-2`}>
                      <Clock size={14} />
                      <span>{event.time}</span>
                    </div>

                    <p className={`text-sm ${textSecondary} mb-2`}>
                      {event.description}
                    </p>

                    <div className={`flex items-start space-x-2 text-xs p-2 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-50'}`}>
                      <AlertCircle size={14} className={`${isDark ? 'text-blue-300' : 'text-blue-600'} mt-0.5`} />
                      <span className={isDark ? 'text-blue-300' : 'text-blue-600'}>{event.impact}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className={`mx-auto mb-3 ${textSecondary}`} size={48} />
                  <p className={textSecondary}>이 날짜에 예정된 이벤트가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}