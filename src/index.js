const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
export class ContractTestError extends Error {
  constructor(code, message = "Contract test failed") { super(message); this.name = "ContractTestError"; this.code = code; }
}
function isRecord(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }

export function validateContractCases(input, { maxCases = 500, maxBodyBytes = 262_144 } = {}) {
  if (!Array.isArray(input) || input.length === 0 || input.length > maxCases) throw new ContractTestError("invalid_cases");
  const ids = new Set();
  return Object.freeze(input.map((item, index) => {
    if (!isRecord(item) || typeof item.id !== "string" || !ID.test(item.id) || ids.has(item.id)) throw new ContractTestError("invalid_case_id", `Case ${index} has an invalid or duplicate ID`);
    ids.add(item.id);
    if (!METHODS.has(item.method) || typeof item.path !== "string" || !item.path.startsWith("/") || item.path.startsWith("//") || item.path.includes("\\") || item.path.includes("#")) throw new ContractTestError("invalid_request", `Case ${item.id} request is invalid`);
    if (item.path.includes("://") || /[\r\n]/.test(item.path)) throw new ContractTestError("unsafe_path");
    if (!Number.isSafeInteger(item.expectedStatus) || item.expectedStatus < 100 || item.expectedStatus > 599) throw new ContractTestError("invalid_status");
    if (item.body !== undefined) {
      let encoded;
      try { encoded = JSON.stringify(item.body); } catch { throw new ContractTestError("invalid_body"); }
      if (typeof encoded !== "string" || Buffer.byteLength(encoded) > maxBodyBytes) throw new ContractTestError("body_too_large");
    }
    if (item.requiredHeaders !== undefined && (!Array.isArray(item.requiredHeaders) || item.requiredHeaders.some((h) => typeof h !== "string" || !/^[a-z0-9-]+$/i.test(h)))) throw new ContractTestError("invalid_headers");
    return Object.freeze({ id: item.id, method: item.method, path: item.path, expectedStatus: item.expectedStatus,
      ...(item.body !== undefined ? { body: item.body } : {}),
      requiredHeaders: Object.freeze([...(item.requiredHeaders ?? [])].map((h) => h.toLowerCase())),
    });
  }));
}

/** Runs fixtures only through an explicitly injected request function; never opens a network connection itself. */
export async function runContractCases(cases, { request } = {}) {
  if (typeof request !== "function") throw new TypeError("Injected request function is required");
  const validCases = validateContractCases(cases);
  const results = [];
  for (const item of validCases) {
    let response;
    try { response = await request({ method: item.method, path: item.path, ...(item.body !== undefined ? { body: item.body } : {}) }); }
    catch { results.push(Object.freeze({ id: item.id, passed: false, code: "request_failed" })); continue; }
    if (!isRecord(response) || !Number.isSafeInteger(response.status) || !isRecord(response.headers)) {
      results.push(Object.freeze({ id: item.id, passed: false, code: "invalid_response" })); continue;
    }
    const missingHeaders = item.requiredHeaders.filter((h) => !(h in Object.fromEntries(Object.entries(response.headers).map(([k, v]) => [k.toLowerCase(), v]))));
    const statusOk = response.status === item.expectedStatus;
    results.push(Object.freeze({ id: item.id, passed: statusOk && missingHeaders.length === 0, code: statusOk ? (missingHeaders.length ? "missing_headers" : "passed") : "status_mismatch", missingHeaders: Object.freeze(missingHeaders) }));
  }
  const passed = results.filter((r) => r.passed).length;
  return Object.freeze({ total: results.length, passed, failed: results.length - passed, results: Object.freeze(results) });
}
