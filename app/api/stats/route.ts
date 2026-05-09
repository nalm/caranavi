import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const sb = getSupabase();
  const [animalRes, recentRes, totalRes] = await Promise.all([
    sb.from('readings').select('animal').order('created_at', { ascending: false }),
    sb.from('readings')
      .select('nickname, animal, personality, nature, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
    sb.from('readings').select('id', { count: 'exact', head: true }),
  ]);

  if (animalRes.error || recentRes.error) {
    return NextResponse.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 });
  }

  // Count by animal
  const animalCount: Record<string, number> = {};
  for (const row of animalRes.data) {
    animalCount[row.animal] = (animalCount[row.animal] ?? 0) + 1;
  }

  const animalRanking = Object.entries(animalCount)
    .sort((a, b) => b[1] - a[1])
    .map(([animal, count]) => ({ animal, count }));

  return NextResponse.json({
    total: totalRes.count ?? 0,
    animalRanking,
    recent: recentRes.data,
  });
}
