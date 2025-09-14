import { describe, it, expect, vi, beforeEach } from "vitest";

const createClient = vi.fn();
vi.mock("@supabase/supabase-js", () => ({ createClient }));

describe("POST /api/leads-submit", () => {
  beforeEach(() => {
    vi.resetModules();
    createClient.mockReset();
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
  });

  it("accepts a valid lead", async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: 1 }, error: null });
    createClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({ single })
        })
      })
    });

    const { POST } = await import("../leads-submit");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "John", whatsapp: "12345678" })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, id: 1 });
  });

  it("rejects invalid JSON", async () => {
    createClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({ single: vi.fn() })
        })
      })
    });

    const { POST } = await import("../leads-submit");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{" // malformed
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
  });

  it("requires name and valid phone", async () => {
    const { POST } = await import("../leads-submit");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "", whatsapp: "123" })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
  });

  it("returns 500 when supabase fails", async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: "db" } });
    createClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({ single })
        })
      })
    });

    const { POST } = await import("../leads-submit");
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "John", whatsapp: "12345678" })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(500);
  });
});
