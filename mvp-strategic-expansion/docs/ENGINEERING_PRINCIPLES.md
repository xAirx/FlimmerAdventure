# Engineering Principles

## Code Review Checklist
- Clear purpose & description in PR
- Tests updated/added
- No obvious security issues
- Follows coding standards & naming conventions
- Includes docs updates if needed

## Branching Strategy
- `main`: production-ready
- `develop`: integration
- `feature/<name>`: work branches, rebased onto develop

## Definition of Done
1. Code compiles, lints, & tests pass (CI)
2. Meets acceptance criteria & design guidelines
3. No critical bugs, security issues
4. Docs & metrics instrumentation added
5. Reviewed & approved by at least one peer

## Quality Gates
- ≥80% test coverage
- No high severity linter/security findings
- Bundle size check within budget

## Continuous Improvement
- Retrospectives each sprint
- Tech debt ticket created when compromise is made
- Encourage learning time & knowledge sharing 