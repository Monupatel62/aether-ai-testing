/**
 * Deterministic synthetic identifiers for tests only.
 * This non-cryptographic hash must never be used for secrets, authentication, or production IDs.
 */
export function fixtureId(namespace: string, seed: string): string {
  const input = `${namespace.trim()}:${seed}`;
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index++) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `test_${namespace.replace(/[^a-zA-Z0-9_-]/g, "_")}_${hash.toString(16).padStart(8, "0")}`;
}

/** Build a JSON response for fetch mocks without depending on a live service. */
export function jsonResponse<T>(body: T, status = 200, headers?: HeadersInit): Response {
  const normalized = new Headers(headers);
  if (!normalized.has("content-type")) normalized.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { status, headers: normalized });
}

/** A controllable promise for testing races, cancellation, and delayed dependencies. */
export function deferred<T>() {
  let resolvePromise!: (value: T | PromiseLike<T>) => void;
  let rejectPromise!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return { promise, resolve: resolvePromise, reject: rejectPromise };
}

/** Collect an async iterable with a hard cap so broken test streams cannot run forever. */
export async function collectAsync<T>(source: AsyncIterable<T>, maxItems = 1_000): Promise<T[]> {
  if (!Number.isInteger(maxItems) || maxItems < 0 || maxItems > 100_000) {
    throw new RangeError("maxItems must be an integer between 0 and 100000");
  }
  const values: T[] = [];
  for await (const value of source) {
    if (values.length >= maxItems) throw new RangeError("Async iterable exceeded the configured item limit");
    values.push(value);
  }
  return values;
}

/**
 * Return paths whose object keys resemble credentials or secrets.
 * Use on synthetic fixtures and sanitized artifacts; this is a guardrail, not a complete DLP scanner.
 */
export function findSensitiveKeyPaths(value: unknown): string[] {
  const sensitiveKey = /(?:secret|password|passwd|token|authorization|api[_-]?key|client[_-]?secret|private[_-]?key|cookie)/i;
  const matches: string[] = [];
  const seen = new WeakSet<object>();

  function visit(current: unknown, path: string): void {
    if (current === null || typeof current !== "object") return;
    if (seen.has(current)) return;
    seen.add(current);

    if (Array.isArray(current)) {
      current.forEach((item, index) => visit(item, `${path}[${index}]`));
      return;
    }
    for (const [key, child] of Object.entries(current)) {
      const childPath = path ? `${path}.${key}` : key;
      if (sensitiveKey.test(key)) matches.push(childPath);
      visit(child, childPath);
    }
  }

  visit(value, "");
  return matches.sort();
}
