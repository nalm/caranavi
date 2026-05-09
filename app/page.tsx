'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ANIMALS,
  conversionTable,
  natureIcons,
  getAnimalFromPersonality,
  yearMonthTable,
} from '@/lib/data';

interface Result {
  code: number;
  nature: string;
  personality: string;
  animalName: string;
  animalEmoji: string;
  natureIcon: string;
}

export default function Home() {
  const today = new Date();
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());
  const [nickname, setNickname] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const years = Array.from({ length: 2017 - 1930 + 1 }, (_, i) => 1930 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  async function handleCalculate() {
    setError('');
    setSaved(false);

    if (!nickname.trim()) {
      setError('닉네임을 입력해 주세요.');
      return;
    }
    if (!yearMonthTable[year]) {
      setError('지원하지 않는 연도입니다. (1930~2017)');
      return;
    }

    const ymData = yearMonthTable[year];
    const monthValue = ymData[month - 1];
    let code = monthValue + day;
    if (code > 60) code -= 60;
    if (code === 0) code = 60;

    const entry = conversionTable[code];
    if (!entry) {
      setError('결과를 찾을 수 없습니다.');
      return;
    }

    const { name: animalName, emoji: animalEmoji } = getAnimalFromPersonality(entry.personality);
    setResult({
      code,
      nature: entry.nature,
      personality: entry.personality,
      animalName,
      animalEmoji,
      natureIcon: natureIcons[entry.nature] ?? '✨',
    });

    setLoading(true);
    try {
      await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          birth_year: year,
          birth_month: month,
          birth_day: day,
        }),
      });
      setSaved(true);
    } catch {
      // 저장 실패해도 결과는 표시
    } finally {
      setLoading(false);
    }
  }

  const selectStyle: React.CSSProperties = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8578' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    fontFamily: "'Noto Sans KR', sans-serif",
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#e8e4dc] overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(100,80,40,0.05) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-5 py-10 pb-16">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center gap-1.5 flex-wrap max-w-[420px] mx-auto mb-5">
            {ANIMALS.map((a, i) => (
              <div key={a.name} className="relative group flex flex-col items-center">
                <div
                  className="w-[52px] h-[52px] flex items-center justify-center text-[28px] rounded-full
                    bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.12)]
                    transition-all duration-300 cursor-default
                    hover:scale-125 hover:bg-[rgba(201,168,76,0.15)] hover:border-[#c9a84c]"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  title={a.name}
                >
                  {a.emoji}
                </div>
                <span className="hidden group-hover:block absolute -bottom-5 text-[10px] text-[#e8d5a0] whitespace-nowrap">
                  {a.name}
                </span>
              </div>
            ))}
          </div>

          <h1
            className="font-black text-[32px] text-[#c9a84c] tracking-[4px] mb-2"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            나의 캐러나비는?
          </h1>
          <div className="w-[60px] h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mt-6" />
        </header>

        {/* Input */}
        <section className="bg-[#12121a] border border-[#2a2a35] rounded-2xl px-7 py-9 mb-8">
          {/* Nickname */}
          <div className="mb-6">
            <label
              className="block text-center text-[#e8d5a0] text-base mb-3 tracking-wide"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[#2a2a35] rounded-xl
                text-[#e8e4dc] text-center text-lg px-4 py-3 outline-none
                placeholder-[#8a8578] focus:border-[#c9a84c]
                transition-all duration-300"
              style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
            />
          </div>

          {/* Date */}
          <label
            className="block text-center text-[#e8d5a0] text-base mb-5 tracking-wide"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            생년월일을 선택하세요
          </label>
          <div className="flex gap-2.5 justify-center items-center flex-wrap">
            {([
              { value: year, options: years, unit: '년', onChange: setYear },
              { value: month, options: months, unit: '월', onChange: setMonth },
              { value: day, options: days, unit: '일', onChange: setDay },
            ] as const).map(({ value, options, unit, onChange }, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <select
                  value={value}
                  onChange={(e) => onChange(Number(e.target.value))}
                  className="bg-[rgba(255,255,255,0.05)] border border-[#2a2a35] rounded-xl
                    text-[#e8e4dc] text-lg px-3.5 py-3 outline-none cursor-pointer appearance-none
                    focus:border-[#c9a84c] transition-all duration-300 pr-7"
                  style={selectStyle}
                >
                  {options.map((v) => (
                    <option key={v} value={v} style={{ background: '#1a1a24' }}>
                      {v}
                    </option>
                  ))}
                </select>
                <span className="text-[#8a8578] text-sm ml-0.5">{unit}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="block w-full mt-7 py-4 rounded-xl font-bold text-lg tracking-[3px]
              bg-gradient-to-br from-[#c9a84c] to-[#a8872e] text-[#0a0a0f]
              transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.3)]
              active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            {loading ? '저장 중…' : '내 캐러나비 확인하기'}
          </button>

          {error && (
            <p className="mt-4 text-center text-sm text-[#e8a0a0] bg-[rgba(200,60,60,0.1)] border border-[rgba(200,60,60,0.3)] rounded-xl px-4 py-4">
              {error}
            </p>
          )}
        </section>

        {/* Result */}
        {result && (
          <section className="relative bg-[#12121a] border border-[#c9a84c] rounded-2xl px-7 py-10 text-center overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)' }}
            />

            <div
              className="text-[72px] font-black text-[#c9a84c] leading-none mb-2"
              style={{ fontFamily: "'Noto Serif KR', serif", textShadow: '0 0 40px rgba(201,168,76,0.3)' }}
            >
              {result.code}
            </div>
            <div className="text-[13px] text-[#8a8578] tracking-[2px] mb-7">합산수</div>

            <div className="inline-block bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] rounded-xl px-5 py-3.5 mb-8">
              <div className="text-xl font-bold text-[#e8d5a0]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                {year}년 {month}월 {day}일
              </div>
              <div className="text-xs text-[#8a8578] mt-1 tracking-wide">생년월일</div>
            </div>

            <div className="text-[80px] leading-none mb-3">{result.animalEmoji}</div>
            <div className="text-base mb-1.5">{result.natureIcon}</div>
            <div
              className="text-[22px] font-bold text-[#e8d5a0] mb-1"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              {result.nature}
            </div>
            <div
              className="text-[28px] font-black text-[#c9a84c]"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              {result.personality}
            </div>

            {saved && (
              <p className="mt-6 text-sm text-[#8a8578]">✓ 결과가 저장되었습니다</p>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-[#8a8578] text-xs leading-loose tracking-wide">
          <Link href="/stats" className="text-[#c9a84c] hover:underline">
            📊 전체 통계 보기
          </Link>
          <br />
          <a
            href="https://www.joongang.co.kr/article/21165695"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-[rgba(138,133,120,0.3)] hover:text-[#e8d5a0] hover:border-[#e8d5a0] transition-colors"
          >
            joongang.co.kr
          </a>
          <br />
          <span className="italic text-[rgba(138,133,120,0.6)] tracking-[1.5px]">vibed by nalm</span>
        </footer>
      </div>
    </main>
  );
}
