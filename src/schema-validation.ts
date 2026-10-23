import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import type { Ajv, AnySchema, ErrorObject, ValidateFunction } from "ajv";

// NodeNext resolves these CommonJS packages as module namespaces in their declarations;
// at runtime their default exports are the constructor/plugin function documented by Ajv.
const Ajv2020 = Ajv2020Module as unknown as new (options: object) => Ajv;
const addFormats = addFormatsModule as unknown as (ajv: Ajv) => Ajv;

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
