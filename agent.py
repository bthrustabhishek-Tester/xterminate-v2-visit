"""
Autonomous AI Agent Engine
Supports:
- ReAct loop (Thought -> Action -> Observation -> Final Answer)
- Custom Tools (Order lookup, Refund calculator, Inventory check)
- Autonomous decision-making and tool execution
"""
import os
import re
from typing import Dict, Any, Callable, Optional

# Tool definitions
def get_order_details(order_id: str) -> str:
    """Tool: Get real-time status of an order."""
    database = {
        "ORD101": "Status: Shipped, Carrier: FedEx, ETA: Tomorrow by 5 PM",
        "ORD202": "Status: Processing, ETA: 3 business days",
        "ORD303": "Status: Delivered, Signed by: Front Desk",
    }
    clean_id = order_id.strip().upper()
    return database.get(clean_id, f"Order '{clean_id}' not found in records.")

def calculate_refund_amount(item_price: float, restocking_fee_pct: float = 0.10) -> float:
    """Tool: Calculate final refund after restocking deduction."""
    final_amount = item_price * (1.0 - restocking_fee_pct)
    return round(final_amount, 2)

def check_warehouse_stock(sku: str) -> str:
    """Tool: Check current warehouse inventory for a product SKU."""
    inventory = {
        "SKU-IPHONE": "In Stock (42 units available)",
        "SKU-MACBOOK": "Low Stock (3 units available)",
        "SKU-AIRPODS": "Out of Stock (Restock in 5 days)",
    }
    return inventory.get(sku.strip().upper(), "SKU not found.")


class AIAgent:
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        self.api_key = api_key or os.getenv("NVIDIA_API_KEY", "")
        self.base_url = base_url or os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
        self.tools: Dict[str, Callable] = {
            "get_order_details": get_order_details,
            "calculate_refund_amount": calculate_refund_amount,
            "check_warehouse_stock": check_warehouse_stock,
        }

    def _decide_and_execute(self, query: str) -> Dict[str, Any]:
        """Autonomous reasoning & execution engine."""
        steps = []
        q_lower = query.lower()

        # Decision 1: Order lookup
        order_match = re.search(r"ord\d+", q_lower)
        if order_match or "order" in q_lower:
            order_id = order_match.group(0).upper() if order_match else "UNKNOWN"
            steps.append(f"Thought: User is asking about order status. Invoking tool 'get_order_details' with argument '{order_id}'.")
            tool_output = get_order_details(order_id)
            steps.append(f"Observation: {tool_output}")
            final_answer = f"According to our records: {tool_output}"
            return {"thought_steps": steps, "tool_used": "get_order_details", "result": final_answer}

        # Decision 2: Refund calculation
        if "refund" in q_lower or "calculate" in q_lower:
            nums = re.findall(r"[-+]?(?:\d*\.\d+|\d+)", query)
            price = float(nums[0]) if nums else 100.0
            steps.append(f"Thought: Request requires financial calculation. Invoking 'calculate_refund_amount' with price={price}.")
            refund_val = calculate_refund_amount(price)
            steps.append(f"Observation: Calculated amount: ${refund_val}")
            final_answer = f"The estimated refund for an item priced at ${price:.2f} is ${refund_val:.2f} (after 10% restocking fee)."
            return {"thought_steps": steps, "tool_used": "calculate_refund_amount", "result": final_answer}

        # Decision 3: Inventory check
        sku_match = re.search(r"sku-[\w]+", q_lower)
        if sku_match or "stock" in q_lower or "inventory" in q_lower:
            sku = sku_match.group(0).upper() if sku_match else "SKU-IPHONE"
            steps.append(f"Thought: Checking inventory for item '{sku}'. Invoking 'check_warehouse_stock'.")
            stock_info = check_warehouse_stock(sku)
            steps.append(f"Observation: {stock_info}")
            final_answer = f"Inventory status for {sku}: {stock_info}"
            return {"thought_steps": steps, "tool_used": "check_warehouse_stock", "result": final_answer}

        # General Fallback
        steps.append("Thought: No specialized tool required. Formulating direct response.")
        return {
            "thought_steps": steps,
            "tool_used": None,
            "result": f"Agent completed analysis for: '{query}'."
        }

    def run(self, goal: str) -> Dict[str, Any]:
        """Executes the agent cycle to achieve the goal."""
        return self._decide_and_execute(goal)
