---
name: tests
description: "Skill for the Tests area of void-sculpt-digital. 59 symbols across 4 files."
---

# Tests

59 symbols | 4 files | Cohesion: 78%

## When to Use

- Working with code in `_bmad/`
- Understanding how detect_doc_type, analyze, output_json work
- Modifying tests-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `_bmad/core/bmad-init/scripts/tests/test_bmad_init.py` | test_finds_in_skill_assets, test_finds_in_skill_root, test_finds_in_bmad_module_dir, test_returns_none_when_not_found, test_skill_path_takes_priority (+21) |
| `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | test_detection, test_basic_analysis, test_routing_single_small_input, test_routing_fanout_many_files, test_folder_analysis (+13) |
| `_bmad/core/bmad-init/scripts/bmad_init.py` | find_target_module_yaml, parse_var_specs, load_module_yaml, cmd_resolve_defaults, resolve_project_root_placeholder (+4) |
| `_bmad/core/bmad-distillator/scripts/analyze_sources.py` | detect_doc_type, analyze, output_json, main, resolve_inputs (+1) |

## Entry Points

Start here when exploring this area:

- **`detect_doc_type`** (Function) — `_bmad/core/bmad-distillator/scripts/analyze_sources.py:112`
- **`analyze`** (Function) — `_bmad/core/bmad-distillator/scripts/analyze_sources.py:185`
- **`output_json`** (Function) — `_bmad/core/bmad-distillator/scripts/analyze_sources.py:268`
- **`main`** (Function) — `_bmad/core/bmad-distillator/scripts/analyze_sources.py:279`
- **`test_detection`** (Function) — `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py:115`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `detect_doc_type` | Function | `_bmad/core/bmad-distillator/scripts/analyze_sources.py` | 112 |
| `analyze` | Function | `_bmad/core/bmad-distillator/scripts/analyze_sources.py` | 185 |
| `output_json` | Function | `_bmad/core/bmad-distillator/scripts/analyze_sources.py` | 268 |
| `main` | Function | `_bmad/core/bmad-distillator/scripts/analyze_sources.py` | 279 |
| `test_detection` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 115 |
| `test_basic_analysis` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 157 |
| `test_routing_single_small_input` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 167 |
| `test_routing_fanout_many_files` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 174 |
| `test_folder_analysis` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 183 |
| `test_no_files_found` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 191 |
| `test_stdout_output` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 198 |
| `resolve_inputs` | Function | `_bmad/core/bmad-distillator/scripts/analyze_sources.py` | 81 |
| `test_single_file` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 47 |
| `test_folder_recursion` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 53 |
| `test_folder_skips_excluded_dirs` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 60 |
| `test_folder_skips_non_text_files` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 65 |
| `test_glob_pattern` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 70 |
| `test_deduplication` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 78 |
| `test_mixed_inputs` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 83 |
| `test_nonexistent_path` | Function | `_bmad/core/bmad-distillator/scripts/tests/test_analyze_sources.py` | 91 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Cmd_write → Expand_template` | cross_community | 3 |
| `Cmd_load → Load_config_file` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Scripts | 1 calls |

## How to Explore

1. `gitnexus_context({name: "detect_doc_type"})` — see callers and callees
2. `gitnexus_query({query: "tests"})` — find related execution flows
3. Read key files listed above for implementation details
