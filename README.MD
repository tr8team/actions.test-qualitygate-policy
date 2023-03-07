# Title

Description

# Get Started

Instruction

```yaml
name: Example Workflow
on: push
jobs:
  Test:
    runs-on: ubuntu-latest
    steps:
      # change this
      - name: Sample
        id: sample
        uses: sample/sample@v1.0.0
        with:
        sample:sample
```

<!-- prettier-ignore-start -->
<!-- action-docs-inputs -->
## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| current | Current commit metadata | `true` |  |
| base | Base commit metadata | `false` |  |
| history | History metadatas for this PR | `true` |  |
| policies | Quality Gate policies | `true` | default value if applicable |
<!-- action-docs-inputs -->

<!-- action-docs-outputs -->
## Outputs

| parameter | description |
| --- | --- |
| current | Current Commit's data with quality gate information |
| history | History Commits' data with quality gate information |
<!-- action-docs-outputs -->

<!-- action-docs-runs -->
## Runs

This action is a `node16` action.
<!-- action-docs-runs -->

<!-- prettier-ignore-end -->

# Contributing

To contribute, please look at [Contributing](./Contributing.md)

# Author

- [Ernest (ESD)](mailto:ernest@tr8.io)
