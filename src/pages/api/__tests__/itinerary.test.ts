import { describe, it, expect, vi, beforeEach } from 'vitest';

const createClient = vi.fn();
vi.mock('@supabase/supabase-js', () => ({ createClient }));

function supabaseStub(opts: {
  routes: Record<string, { km: number; toll_low?: number; toll_high?: number }>;
  rule?: { per_km: number; da_per_day?: number; night_surcharge_pct?: number; min_km?: number };
  pois?: Record<string, Array<{ id?: string; city?: string; name: string; time_hint?: string; why?: string; priority?: number; is_active?: boolean }>>;
}) {
  return {
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'distance_matrix') {
        const chain: any = {
          __from: '', __to: '',
          select: vi.fn().mockReturnThis(),
          ilike: vi.fn().mockImplementation((col: string, val: string) => {
            if (col === 'from_city') chain.__from = val.toLowerCase();
            if (col === 'to_city') chain.__to = val.toLowerCase();
            return chain;
          }),
          limit: vi.fn().mockImplementation(async () => {
            const key1 = `${chain.__from}->${chain.__to}`;
            const key2 = `${chain.__to}->${chain.__from}`;
            const r = opts.routes[key1] || opts.routes[key2];
            return { data: r ? [{ from_city: chain.__from, to_city: chain.__to, ...r }] : [], error: null };
          })
        };
        return chain;
      }
      if (table === 'fare_rules') {
        const chain: any = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: opts.rule || null, error: null })
        };
        return chain;
      }
      if (table === 'pois') {
        const chain: any = { __city: '', __active: true };
        chain.select = vi.fn().mockReturnValue(chain);
        chain.ilike = vi.fn().mockImplementation((col: string, val: string) => { if(col==='city') chain.__city = val.toLowerCase(); return chain; });
        chain.eq = vi.fn().mockImplementation((col: string, val: any) => { if(col==='is_active') chain.__active = !!val; return chain; });
        chain.order = vi.fn().mockReturnValue(chain);
        chain.limit = vi.fn().mockImplementation(async () => {
          const list = opts.pois?.[chain.__city] || opts.pois?.[chain.__city.replace(/%/g,'')] || [];
          const data = (list || []).filter((p:any) => chain.__active ? p.is_active !== false : true);
          return { data, error: null };
        });
        return chain;
      }
      throw new Error('unexpected table ' + table);
    })
  };
}

describe('POST /api/itinerary', () => {
  beforeEach(() => {
    vi.resetModules();
    createClient.mockReset();
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  });

  it('requires origin and stops', async () => {
    const { POST } = await import('../itinerary');
    const req = new Request('http://local/api/itinerary', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ origin: '', stops: [] })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
  });

  it('returns 503 if DB unavailable', async () => {
    delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { POST } = await import('../itinerary');
    const req = new Request('http://local/api/itinerary', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ origin: 'pune', stops: ['mumbai'] })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(503);
  });

  it('computes legs and fare for multi-stop', async () => {
    createClient.mockReturnValue(supabaseStub({
      routes: {
        'pune->mumbai': { km: 150, toll_low: 300, toll_high: 400 },
        'mumbai->lonavala': { km: 90, toll_low: 100, toll_high: 150 }
      },
      rule: { per_km: 12, da_per_day: 300, night_surcharge_pct: 0, min_km: 250 }
    }));
    const { POST } = await import('../itinerary');
    const req = new Request('http://local/api/itinerary', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ origin: 'pune', stops: ['mumbai', 'lonavala'], vehicle: 'sedan', pax: 2 })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.legs.length).toBe(2);
    expect(body.totals.km).toBe(240);
    expect(body.fare.low).toBeGreaterThan(0);
    expect(Array.isArray(body.plan)).toBe(true);
  });

  it('uses POIs to build day activities', async () => {
    createClient.mockReturnValue(supabaseStub({
      routes: { 'pune->mumbai': { km: 150, toll_low: 300, toll_high: 400 } },
      rule: { per_km: 12, da_per_day: 300, night_surcharge_pct: 0, min_km: 150 },
      pois: {
        'mumbai': [
          { id: 'p1', name: 'Gateway of India', time_hint: 'morning', why: 'Iconic.' },
          { id: 'p2', name: 'Colaba Causeway', time_hint: 'afternoon', why: 'Markets.' },
          { id: 'p3', name: 'Marine Drive Sunset', time_hint: 'evening', why: 'Views.' },
        ]
      }
    }));
    const { POST } = await import('../itinerary');
    const req = new Request('http://local/api/itinerary', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ origin: 'pune', stops: ['mumbai'], vehicle: 'sedan' })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    const acts = body.plan?.[0]?.activities?.map((a:any)=>a.name) || [];
    expect(acts).toContain('Gateway of India');
    expect(acts).toContain('Colaba Causeway');
    expect(acts).toContain('Marine Drive Sunset');
  });
});
