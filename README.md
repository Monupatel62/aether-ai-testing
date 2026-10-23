# aether-ai-testing

**Status:** Initial API contract fixture runner implemented on a feature branch. No production service environment is targeted by default.

## Implemented

- [Contract test source](src/index.js): bounded fixture validation, method/path/status checks, required response headers, injected request adapter, and privacy-conscious result summaries.
- [Unit tests](test/testing.test.js): fixture schema, unsafe paths, status/header matching, request failures, and response-body omission.
- Dependency-free Node.js package with Node 20/22 CI.

## Limitations

The runner does not start services, provision dependencies, run end-to-end environments, generate fixtures from OpenAPI, test streaming, or verify security properties beyond the declared assertions. Network calls occur only through a caller-supplied adapter; production use must point to an explicitly approved test environment.

## Documentation

- [Repository specification](docs/REPOSITORY_SPECIFICATION.md)
- [Project specification](docs/PROJECT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Dependencies and contracts](docs/DEPENDENCIES_AND_CONTRACTS.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Security review](docs/SECURITY_REVIEW.md)
- [Master catalog](https://github.com/Monupatel62/aether-ai-platform/blob/main/docs/REPOSITORY_CATALOG.md)
