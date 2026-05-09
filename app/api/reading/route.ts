import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { calculate, conversionTable, getAnimalFromPersonality } from '@/lib/data';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nickname, birth_year, birth_month, birth_day } = body;

  if (!nickname?.trim()) {
    return NextResponse.json({ error: '닉네임을 입력해 주세요.' }, { status: 400 });
  }
  if (!birth_year || !birth_month || !birth_day) {
    return NextResponse.json({ error: '생년월일을 입력해 주세요.' }, { status: 400 });
  }

  const result_code = calculate(birth_year, birth_month, birth_day);
  if (!result_code) {
    return NextResponse.json({ error: '계산할 수 없는 날짜입니다.' }, { status: 400 });
  }

  const entry = conversionTable[result_code];
  const { name: animal } = getAnimalFromPersonality(entry.personality);

  const { data, error } = await getSupabase().from('readings').insert({
    nickname: nickname.trim(),
    birth_year,
    birth_month,
    birth_day,
    result_code,
    animal,
    nature: entry.nature,
    personality: entry.personality,
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
