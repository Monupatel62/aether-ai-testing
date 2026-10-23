import { describe, expect, it } from "vitest";
import { createSchemaValidator } from "../src/schema-validation.js";

describe("JSON Schema contract validation", () => {
  const validateUser = createSchemaValidator({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    additionalProperties: false,
    required: ["id", "email"],
    properties: {
      id: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" }
    }
  });

  it("accepts a valid synthetic contract fixture", () => {
    expect(validateUser({ id: "test_user_1", email: "user@example.test" })).toEqual({ valid: true, issues: [] });
  });

  it("reports stable issue metadata without copying fixture values", () => {
    const result = validateUser({ id: "", email: "not-an-email", token: "synthetic-secret" });
    expect(result.valid).toBe(false);
    expect(result.issues.map(issue => issue.keyword)).toContain("additionalProperties");
    expect(result.issues.map(issue => issue.keyword)).toContain("format");
    expect(JSON.stringify(result)).not.toContain("synthetic-secret");
  });
});
