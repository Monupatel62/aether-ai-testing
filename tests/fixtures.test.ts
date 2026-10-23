import { describe, expect, it } from "vitest";
import { collectAsync, deferred, findSensitiveKeyPaths, fixtureId, jsonResponse } from "../src/index.js";

async function* values() {
  yield 1;
  yield 2;
  yield 3;
}

describe("test fixtures", () => {
  it("creates stable synthetic IDs for the same namespace and seed", () => {
    expect(fixtureId("user", "alice")).toBe(fixtureId("user", "alice"));
    expect(fixtureId("user", "alice")).not.toBe(fixtureId("user", "bob"));
    expect(fixtureId("user", "alice")).toMatch(/^test_user_[0-9a-f]{8}$/);
  });

  it("creates JSON responses with content type and status", async () => {
    const response = jsonResponse({ ok: true }, 201);
    expect(response.status).toBe(201);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("allows tests to resolve a deferred dependency", async () => {
    const pending = deferred<string>();
    pending.resolve("ready");
    await expect(pending.promise).resolves.toBe("ready");
  });

  it("collects async iterables and rejects unbounded output", async () => {
    await expect(collectAsync(values())).resolves.toEqual([1, 2, 3]);
    await expect(collectAsync(values(), 2)).rejects.toThrow("item limit");
  });

  it("detects credential-like field names without exposing values", () => {
    expect(findSensitiveKeyPaths({ user: { access_token: "synthetic", profile: { name: "Ada" } }, headers: [{ Authorization: "fake" }] }))
      .toEqual(["headers[0].Authorization", "user.access_token"]);
  });

  it("handles circular fixtures without infinite recursion", () => {
    const value: { safe: string; self?: unknown } = { safe: "synthetic" };
    value.self = value;
    expect(findSensitiveKeyPaths(value)).toEqual([]);
  });
});
