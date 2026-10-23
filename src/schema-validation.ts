import Ajv2020, { type AnySchema, type ErrorObject, type ValidateFunction } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

export interface SchemaValidationIssue {
  readonly path: string;
  readonly keyword: string;
  readonly message: string;
}

export interface SchemaValidationResult {
  readonly valid: boolean;
  readonly issues: readonly SchemaValidationIssue[];
}

function toIssues(errors: ErrorObject[] | null | undefined): SchemaValidationIssue[] {
  return (errors ?? []).map(error => ({
    path: error.instancePath || "/",
    keyword: error.keyword,
    message: error.message ?? "Schema validation failed"
  }));
}

/**
 * Compile a JSON Schema Draft 2020-12 validator once and reuse it across test cases.
 * Strict mode intentionally rejects ambiguous/unknown schema keywords.
 */
export function createSchemaValidator(schema: AnySchema): (value: unknown) => SchemaValidationResult {
  const ajv = new Ajv2020({ allErrors: true, strict: true, validateFormats: true });
  addFormats(ajv);
  const validate: ValidateFunction = ajv.compile(schema);
  return (value: unknown) => {
    const valid = validate(value) === true;
    return { valid, issues: valid ? [] : toIssues(validate.errors) };
  };
}
