# @aether-ai/testing

Synthetic fixtures, deterministic test helpers, and JSON Schema contract validation for Aether AI tests. This package is test-only and must not be a production runtime dependency.

## Current implementation

- Deterministic synthetic fixture IDs (non-cryptographic; never use for security decisions).
- JSON `Response` builders for mocked fetch calls.
- Deferred promises for race and failure tests.
- Bounded async-iterable collection to keep broken streams from hanging test suites.
- Credential-like field-name detection for sanitized fixture/artifact checks; this is a guardrail, not a complete DLP scanner.
- JSON Schema Draft 2020-12 validator with strict mode, format assertions, and sanitized issue metadata.

## Example

```ts
import { createSchemaValidator, fixtureId, jsonResponse } from "@aether-ai/testing";

const validate = createSchemaValidator({
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", minLength: 1 } },
  additionalProperties: false
});

const fixture = { id: fixtureId("run", "case-1") };
if (!validate(fixture).valid) throw new Error("Invalid test fixture");
const mockedResponse = jsonResponse(fixture);
```

Use synthetic data only. Never place production credentials or customer payloads in fixtures, snapshots, logs, or CI artifacts.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

CI is configured for Node.js 20 and 22. OpenAPI validation, provider/consumer compatibility, secret scanning, and isolated integration harnesses remain future work; this repository is not yet complete or production-certified.
