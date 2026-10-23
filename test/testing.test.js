import test from "node:test";
import assert from "node:assert/strict";
import { ContractTestError, runContractCases, validateContractCases } from "../src/index.js";

const cases = [
  { id: "health", method: "GET", path: "/health", expectedStatus: 200, requiredHeaders: ["content-type"] },
  { id: "create", method: "POST", path: "/v1/items", expectedStatus: 201, body: { name: "demo" } },
];

test("validates and freezes API contract fixtures", () => {
  const valid = validateContractCases(cases);
  assert.equal(valid.length, 2);
  assert.equal(Object.isFrozen(valid), true);
});

test("rejects duplicate IDs, unsafe paths, and invalid status", () => {
  assert.throws(() => validateContractCases([cases[0], cases[0]]), ContractTestError);
  assert.throws(() => validateContractCases([{ ...cases[0], path: "//evil.test/path" }]), ContractTestError);
  assert.throws(() => validateContractCases([{ ...cases[0], expectedStatus: 700 }]), ContractTestError);
});

test("runs injected requests and checks status plus required headers", async () => {
  const result = await runContractCases(cases, { request: async ({ path }) => path === "/health" ? { status: 200, headers: { "Content-Type": "application/json" } } : { status: 201, headers: {} } });
  assert.deepEqual({ total: result.total, passed: result.passed, failed: result.failed }, { total: 2, passed: 2, failed: 0 });
});

test("reports request failures and status mismatches without response bodies", async () => {
  const result = await runContractCases(cases, { request: async ({ path }) => { if (path === "/health") throw new Error("secret"); return { status: 500, headers: {}, body: "private" }; } });
  assert.equal(result.results[0].code, "request_failed");
  assert.equal(result.results[1].code, "status_mismatch");
  assert.equal("body" in result.results[1], false);
});

test("requires explicit request adapter", async () => {
  await assert.rejects(runContractCases(cases), TypeError);
});
