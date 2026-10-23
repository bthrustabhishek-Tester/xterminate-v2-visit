"""
Autonomous QA Agent for Xterminate V2 Automation Framework.
Autonomous Capabilities:
1. inspect_test_suite: Finds test specs for any module (Auth, Customer, Visits, etc.)
2. check_api_catalog: Looks up endpoints in api_endpoints_catalog.json
3. trigger_playwright_test: Autonomous test execution and summary reporting
"""
import os
import json
import subprocess
import re
from typing import Dict, Any

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

def inspect_test_suite(module_name: str) -> str:
    """Tool: Locate all test spec files for a given module."""
    tests_dir = os.path.join(PROJECT_ROOT, "tests")
    matches = []
    mod_lower = module_name.lower().strip()

    for root, dirs, files in os.walk(tests_dir):
        for f in files:
            if f.endswith(".spec.ts") and (mod_lower in f.lower() or mod_lower in root.lower()):
                rel_path = os.path.relpath(os.path.join(root, f), PROJECT_ROOT)
                matches.append(rel_path)

    if not matches:
        return f"No test specs found matching '{module_name}'."
    return f"Found {len(matches)} spec(s) for '{module_name}':\n - " + "\n - ".join(matches[:10])

def check_api_catalog(keyword: str) -> str:
    """Tool: Query the canonical API catalog (api_endpoints_catalog.json)."""
    catalog_path = os.path.join(PROJECT_ROOT, "data", "api_endpoints_catalog.json")
    if not os.path.exists(catalog_path):
        return "api_endpoints_catalog.json not found."

    with open(catalog_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    matches = []
    kw_lower = keyword.lower()
    
    # Structure can be list or dict
    items = data if isinstance(data, list) else data.items()
    for item in items:
        item_str = json.dumps(item)
        if kw_lower in item_str.lower():
            matches.append(str(item))

    if not matches:
        return f"No API endpoints matching '{keyword}'."
    return f"Found {len(matches)} endpoint(s) for '{keyword}':\n" + "\n".join(matches[:5])

def run_test_module(target_spec: str) -> str:
    """Tool: Run a specific Playwright test spec using npx."""
    cmd = f"npx playwright test {target_spec} --reporter=list"
    try:
        res = subprocess.run(cmd, shell=True, cwd=PROJECT_ROOT, capture_output=True, text=True, timeout=120)
        output = res.stdout if res.stdout else res.stderr
        return f"Execution Finished (Exit Code {res.returncode}):\n{output[-500:]}"
    except Exception as e:
        return f"Execution error: {str(e)}"


class XterminateQAAgent:
    def __init__(self):
        self.tools = {
            "inspect_test_suite": inspect_test_suite,
            "check_api_catalog": check_api_catalog,
            "run_test_module": run_test_module
        }

    def execute_goal(self, goal: str) -> Dict[str, Any]:
        """Reasoning and execution cycle."""
        steps = []
        g_lower = goal.lower()

        # Goal 1: Run or trigger test execution
        if "run test" in g_lower or "execute test" in g_lower:
            spec = "tests/api/api_health_matrix.api.spec.ts"
            if "customer" in g_lower:
                spec = "tests/02_customer/"
            elif "visit" in g_lower:
                spec = "tests/03_visits/"
            elif "auth" in g_lower:
                spec = "tests/01_auth/"
            elif "finance" in g_lower or "quotation" in g_lower or "invoice" in g_lower:
                spec = "tests/04_finance/"
            elif "operation" in g_lower or "supplier" in g_lower or "enquiry" in g_lower:
                spec = "tests/05_operations_system/"
            elif "api" in g_lower:
                spec = "tests/api/api_health_matrix.api.spec.ts"

            steps.append(f"Thought: Requesting autonomous test run on target '{spec}'.")
            output = run_test_module(spec)
            steps.append(f"Observation: {output[:150]}...")
            return {
                "thought_steps": steps,
                "tool_used": "run_test_module",
                "result": output
            }

        # Goal 2: Search API catalog
        if "endpoint" in g_lower or "api" in g_lower and ("catalog" in g_lower or "find" in g_lower or "check" in g_lower):
            words = [w for w in re.findall(r"\w+", g_lower) if w not in ["api", "catalog", "endpoint", "find", "check", "the", "for"]]
            kw = words[0] if words else "visit"
            steps.append(f"Thought: Querying API catalog for keyword '{kw}'.")
            catalog_res = check_api_catalog(kw)
            steps.append(f"Observation: Found results.")
            return {
                "thought_steps": steps,
                "tool_used": "check_api_catalog",
                "result": catalog_res
            }

        # Goal 3: Find specs / module inspection
        for mod in ["customer", "visit", "auth", "finance", "system", "health"]:
            if mod in g_lower:
                steps.append(f"Thought: Inspecting test suite structure for module '{mod}'.")
                found = inspect_test_suite(mod)
                steps.append(f"Observation: Located specs.")
                return {
                    "thought_steps": steps,
                    "tool_used": "inspect_test_suite",
                    "result": found
                }

        steps.append("Thought: General QA task. Listing available test suites.")
        summary = inspect_test_suite("spec")
        return {
            "thought_steps": steps,
            "tool_used": "inspect_test_suite",
            "result": summary
        }

if __name__ == "__main__":
    agent = XterminateQAAgent()
    print("Xterminate Autonomous QA Agent Ready!\n")
    print("Example Query: 'Find test specs for customer'")
    while True:
        try:
            q = input("\nAgent Goal: ")
            if q.strip().lower() in ["exit", "quit"]:
                break
            res = agent.execute_goal(q)
            print("\n--- Reasoning Trace ---")
            for step in res["thought_steps"]:
                print(f"  {step}")
            print(f"\nResult:\n{res['result']}")
        except (KeyboardInterrupt, EOFError):
            break
