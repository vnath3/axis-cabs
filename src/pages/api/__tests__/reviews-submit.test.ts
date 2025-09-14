import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const createClient = vi.fn();
vi.mock("@supabase/supabase-js", () => ({ createClient }));

describe("POST /api/reviews-submit", () => {
  beforeEach(() => {
    vi.resetModules();
    createClient.mockReset();
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("PUBLIC_SUPABASE_ANON_KEY", "anon-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts a valid review", async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: 1 }, error: null });
    createClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({ single })
        })
      })
    });

    const { POST } = await import("../reviews-submit");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        rating: 5,
        comment: "Great service with punctual drivers.",
        consent: true
      })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, id: 1, status: "pending", flagged: false });
  });

  it("rejects invalid JSON", async () => {
    createClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({ single: vi.fn() })
        })
      })
    });

    const { POST } = await import("../reviews-submit");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{" // malformed
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
  });

  it("enforces required fields", async () => {
    const { POST } = await import("../reviews-submit");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rating: 5, comment: "Too short", consent: true })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
  });

  it("returns 500 when supabase fails", async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: "fail" } });
    createClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({ single })
        })
      })
    });

    const { POST } = await import("../reviews-submit");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        rating: 5,
        comment: "Great service with punctual drivers.",
        consent: true
      })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(500);
  });
});
