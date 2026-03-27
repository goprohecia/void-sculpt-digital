---
name: scripts
description: "Skill for the Scripts area of void-sculpt-digital. 12 symbols across 2 files."
---

# Scripts

12 symbols | 2 files | Cohesion: 72%

## When to Use

- Working with code in `_bmad/`
- Understanding how find_core_module_yaml, load_config_file, load_module_config work
- Modifying scripts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `_bmad/core/bmad-init/scripts/bmad_init.py` | find_core_module_yaml, load_config_file, load_module_config, cmd_check, cmd_write (+1) |
| `_bmad/core/bmad-init/scripts/tests/test_bmad_init.py` | test_returns_none_for_missing, test_returns_path_to_resources, test_loads_flat_yaml, test_load_core, test_load_module_includes_core_vars (+1) |

## Entry Points

Start here when exploring this area:

- **`find_core_module_yaml`** (Function) — `_bmad/core/bmad-init/scripts/bmad_init.py:113`
- **`load_config_file`** (Function) — `_bmad/core/bmad-init/scripts/bmad_init.py:148`
- **`load_module_config`** (Function) — `_bmad/core/bmad-init/scripts/bmad_init.py:158`
- **`cmd_check`** (Function) — `_bmad/core/bmad-init/scripts/bmad_init.py:280`
- **`cmd_write`** (Function) — `_bmad/core/bmad-init/scripts/bmad_init.py:404`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `find_core_module_yaml` | Function | `_bmad/core/bmad-init/scripts/bmad_init.py` | 113 |
| `load_config_file` | Function | `_bmad/core/bmad-init/scripts/bmad_init.py` | 148 |
| `load_module_config` | Function | `_bmad/core/bmad-init/scripts/bmad_init.py` | 158 |
| `cmd_check` | Function | `_bmad/core/bmad-init/scripts/bmad_init.py` | 280 |
| `cmd_write` | Function | `_bmad/core/bmad-init/scripts/bmad_init.py` | 404 |
| `test_returns_none_for_missing` | Function | `_bmad/core/bmad-init/scripts/tests/test_bmad_init.py` | 191 |
| `test_returns_path_to_resources` | Function | `_bmad/core/bmad-init/scripts/tests/test_bmad_init.py` | 204 |
| `test_loads_flat_yaml` | Function | `_bmad/core/bmad-init/scripts/tests/test_bmad_init.py` | 271 |
| `test_load_core` | Function | `_bmad/core/bmad-init/scripts/tests/test_bmad_init.py` | 309 |
| `test_load_module_includes_core_vars` | Function | `_bmad/core/bmad-init/scripts/tests/test_bmad_init.py` | 314 |
| `test_missing_module` | Function | `_bmad/core/bmad-init/scripts/tests/test_bmad_init.py` | 322 |
| `_write_config_file` | Function | `_bmad/core/bmad-init/scripts/bmad_init.py` | 524 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Cmd_write → Expand_template` | cross_community | 3 |
| `Cmd_check → Load_config_file` | intra_community | 3 |
| `Cmd_load → Load_config_file` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Tests | 9 calls |

## How to Explore

1. `gitnexus_context({name: "find_core_module_yaml"})` — see callers and callees
2. `gitnexus_query({query: "scripts"})` — find related execution flows
3. Read key files listed above for implementation details
