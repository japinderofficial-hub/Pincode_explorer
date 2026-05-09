import { NextResponse } from 'next/server';
import { lookupBangalorePincodes } from '@/lib/lookup';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const mode = searchParams.get('mode') === 'area' ? 'area' : 'pincode';
  const results = lookupBangalorePincodes(query, mode);

  return NextResponse.json({
    query,
    mode,
    count: results.length,
    results
  });
}
