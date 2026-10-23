# Security Review — aether-ai-testing

Status: review checklist; no implementation or test evidence is present.

## Threats
production credentials or customer data in tests, tests causing real external side effects, secret leakage in artifacts, flaky tests masking regressions, and overprivileged CI.

## Required controls
- [ ] Synthetic-only fixtures and secret scanning.
- [ ] External network and side effects blocked by default.
- [ ] Least-privilege CI tokens and protected environment secrets.
- [ ] Sanitized artifacts with defined retention/access.
- [ ] Cleanup on success, failure, timeout, and cancellation.
- [ ] Explicit approval for sandbox integration tests.

## Required tests
Test deterministic fixtures, cleanup after failure, mocked external calls, least-privilege CI permissions, secret scanning, and cross-tenant negative tests. Never use production secrets or customer data.
