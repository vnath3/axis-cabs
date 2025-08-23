import { describe, it, expect, vi } from "vitest";
import { rateLimitTry } from "../rateLimit";

describe("rateLimitTry", () => {
  it("enforces a sliding window limit", () => {
    vi.useFakeTimers();
    const key = "test-key";
    const limit = 2;
    const windowMs = 1000;

    vi.setSystemTime(new Date(0));

    const first = rateLimitTry(key, limit, windowMs);
    const second = rateLimitTry(key, limit, windowMs);
    expect(first).toEqual({ ok: true, remaining: 1, retryAfterSec: 0 });
    expect(second).toEqual({ ok: true, remaining: 0, retryAfterSec: 0 });

    const blocked = rateLimitTry(key, limit, windowMs);
    expect(blocked).toEqual({ ok: false, remaining: 0, retryAfterSec: 1 });

    vi.advanceTimersByTime(windowMs + 1);

    const after = rateLimitTry(key, limit, windowMs);
    expect(after).toEqual({ ok: true, remaining: 1, retryAfterSec: 0 });

    vi.useRealTimers();
  });
});
