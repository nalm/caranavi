import Link from 'next/link';
import { animalEmojiMap, natureIcons } from '@/lib/data';

interface AnimalRank {
  animal: string;
  count: number;
}

interface RecentEntry {
  nickname: string;
  animal: string;
  personality: string;
  nature: string;
  created_at: string;
}

interface StatsData {
  total: number;
  animalRanking: AnimalRank[];
  recent: RecentEntry[];
}

async function getStats(): Promise<StatsData | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/stats`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StatsPage() {
  const data = await getStats();

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#e8e4dc] overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-5 py-10 pb-16">
        <header className="text-center mb-10">
          <Link
            href="/"
            className="text-[#8a8578] text-sm hover:text-[#c9a84c] transition-colors mb-6 inline-block"
          >
            ← 돌아가기
          </Link>
          <h1
            className="font-black text-[28px] text-[#c9a84c] tracking-[3px]"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            캐러나비 통계
          </h1>
          {data && (
            <p className="text-[#8a8578] text-sm mt-2">
              총 <span className="text-[#c9a84c] font-bold">{data.total.toLocaleString()}</span>명이 확인했어요
            </p>
          )}
          <div className="w-[60px] h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mt-5" />
        </header>

        {!data ? (
          <div className="text-center text-[#8a8578] py-20">데이터를 불러올 수 없습니다.</div>
        ) : (
          <>
            {/* Animal Ranking */}
            <section className="bg-[#12121a] border border-[#2a2a35] rounded-2xl px-6 py-7 mb-6">
              <h2
                className="text-[#e8d5a0] text-lg font-bold mb-5 tracking-wide"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                동물별 순위
              </h2>
              {data.animalRanking.length === 0 ? (
                <p className="text-[#8a8578] text-sm text-center py-4">아직 데이터가 없습니다.</p>
              ) : (
                <ol className="space-y-3">
                  {data.animalRanking.map((item, idx) => {
                    const emoji = animalEmojiMap[item.animal] ?? '✨';
                    const max = data.animalRanking[0].count;
                    const pct = Math.round((item.count / max) * 100);
                    return (
                      <li key={item.animal} className="flex items-center gap-3">
                        <span className="text-[#8a8578] text-xs w-5 text-right">{idx + 1}</span>
                        <span className="text-xl w-8 text-center">{emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#e8d5a0]">{item.animal}</span>
                            <span className="text-[#8a8578]">{item.count}명</span>
                          </div>
                          <div className="h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#a8872e] rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            {/* Recent */}
            <section className="bg-[#12121a] border border-[#2a2a35] rounded-2xl px-6 py-7">
              <h2
                className="text-[#e8d5a0] text-lg font-bold mb-5 tracking-wide"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                최근 조회
              </h2>
              {data.recent.length === 0 ? (
                <p className="text-[#8a8578] text-sm text-center py-4">아직 데이터가 없습니다.</p>
              ) : (
                <ul className="space-y-3">
                  {data.recent.map((entry, idx) => {
                    const emoji = animalEmojiMap[entry.animal] ?? '✨';
                    const natureIcon = natureIcons[entry.nature] ?? '✨';
                    const date = new Date(entry.created_at).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    return (
                      <li
                        key={idx}
                        className="flex items-center gap-3 py-2.5 border-b border-[#2a2a35] last:border-0"
                      >
                        <span className="text-2xl">{emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-[#e8d5a0] truncate">{entry.nickname}</span>
                            <span className="text-xs text-[#8a8578] shrink-0">{natureIcon} {entry.nature}</span>
                          </div>
                          <p className="text-xs text-[#8a8578] truncate">{entry.personality}</p>
                        </div>
                        <span className="text-[10px] text-[#8a8578] shrink-0">{date}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}

        <footer className="text-center mt-10 text-[#8a8578] text-xs">
          <span className="italic text-[rgba(138,133,120,0.6)] tracking-[1.5px]">vibed by nalm</span>
        </footer>
      </div>
    </main>
  );
}
