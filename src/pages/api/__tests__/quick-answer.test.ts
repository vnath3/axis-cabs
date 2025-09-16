import { describe, it, expect, vi, beforeEach } from 'vitest';

const createClient = vi.fn();
vi.mock('@supabase/supabase-js', () => ({ createClient }));

function supabaseStub(opts: {
  route?: { from: string; to: string; km: number; toll_low?: number; toll_high?: number } | null;
  rules?: Record<string, { per_km: number; da_per_day?: number; night_surcharge_pct?: number; min_km?: number }>;
}) {
  return {
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'distance_matrix') {
        const chain: any = {
          select: vi.fn().mockReturnThis(),
          ilike: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: opts.route ? [opts.route] : [], error: null })
        };
        return chain;
      }
      if (table === 'fare_rules') {
        const chain: any = {};
        chain.select = vi.fn().mockReturnValue(chain);
        chain.eq = vi.fn().mockImplementation((_k: string, v: string) => { chain.__veh = v; return chain; });
        chain.maybeSingle = vi.fn().mockImplementation(async () => ({ data: opts.rules?.[chain.__veh] || null, error: null }));
        return chain;
      }
      throw new Error('unexpected table ' + table);
    })
  };
}

describe('POST /api/quick-answer', () => {
  beforeEach(() => {
    vi.resetModules();
    createClient.mockReset();
    // ensure rate limiter keys are fresh across imports
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  });

  it('returns help for abusive input', async () => {
    // no DB needed
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { POST } = await import('../quick-answer');
    const req = new Request('http://local/api/quick-answer', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'get lost' })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.type).toBe('fallback');
    expect(body.ok).toBe(true);
  });

  it('handles fare lookup with found route and rules', async () => {
    createClient.mockReturnValue(supabaseStub({
      route: { from: 'pune', to: 'mumbai', km: 150, toll_low: 300, toll_high: 400 },
      rules: {
        sedan: { per_km: 12, da_per_day: 300, night_surcharge_pct: 0, min_km: 150 },
        suv: { per_km: 16, da_per_day: 300, night_surcharge_pct: 0, min_km: 150 },
        traveller: { per_km: 20, da_per_day: 300, night_surcharge_pct: 0, min_km: 150 }
      }
    }));
    const { POST } = await import('../quick-answer');
    const req = new Request('http://local/api/quick-answer', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'pune to mumbai fare' })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    // console.log('fare body', body);
    expect(body.type).toBe('fare');
    expect(body.ok).toBe(true);
    expect(body.text).toMatch(/Pune .* Mumbai/);
    expect(body.text).toMatch(/SEDAN:/);
  });

  it('returns not-found message when route missing', async () => {
    createClient.mockReturnValue(supabaseStub({ route: null }));
    const { POST } = await import('../quick-answer');
    const req = new Request('http://local/api/quick-answer', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'foo to bar fare' })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    // console.log('not-found body', body);
    expect(body.type).toBe('fare');
    expect(String(body.text).toLowerCase()).toContain("couldn't find");
  });

  it('lists packages without DB', async () => {
    delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { POST } = await import('../quick-answer');
    const req = new Request('http://local/api/quick-answer', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'ajanta ellora package' })
    });
    const res = await POST({ request: req } as any);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.type).toBe('packages');
    expect(Array.isArray(body.data)).toBe(true);
  });
});
