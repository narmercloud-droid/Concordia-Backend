# SDK Publishing Steps

This document describes how to publish the SDKs for Concordia Backend.

TypeScript SDK (npm)

1. Bump version in `sdks/typescript/package.json` to the desired release (e.g. `1.0.0`).
2. From `sdks/typescript` run:

```bash
npm ci
npm run build || true # if the SDK has a build step
npm publish --access public
```

3. If you need to scoped publish or use a release tag, follow your org policy.

Python SDK (PyPI)

1. Bump version in `sdks/python/setup.py` or `pyproject.toml`.
2. Build distributions:

```bash
cd sdks/python
python -m pip install --upgrade build twine
python -m build
```

3. Test upload to TestPyPI:

```bash
python -m twine upload --repository testpypi dist/*
```

4. When satisfied, upload to PyPI:

```bash
python -m twine upload dist/*
```

Notes

- Ensure credentials are configured (`npm login`, `~/.pypirc` or environment variables for `twine`).
- Sign releases (optional) and include checksums in release notes.
