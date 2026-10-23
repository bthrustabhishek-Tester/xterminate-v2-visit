"""
Interactive Assistant for Xterminate V2 Automation Framework.
Provides support for:
- Finding test specs (Auth, Customer, Visits, Finance, Operations)
- Guiding Playwright commands and CLI execution
- Troubleshooting test failures and environment variables (.env)
"""
import os
import json
from chatbot import AIChatbot

class XterminateChatbot(AIChatbot):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.system_prompt = (
            "You are the Xterminate V2 Quality Engineering AI Assistant. "
            "You help QA engineers navigate Playwright test suites, page objects, "
            "API health endpoints, and troubleshooting test runs."
        )

    def _mock_inference(self, messages):
        user_msg = messages[-1]["content"].lower()

        if "how to run" in user_msg or "command" in user_msg:
            return (
                "To run Xterminate V2 tests:\n"
                "- Run all tests: `npm test` or `npx playwright test`\n"
                "- Run customer UI tests: `npx playwright test tests/02_customer/`\n"
                "- Run visits UI tests: `npx playwright test tests/03_visits/`\n"
                "- Run API tests: `npx playwright test tests/api/api_health_matrix.api.spec.ts`\n"
                "- View HTML report: `npx playwright show-report`"
            )

        if "customer" in user_msg:
            return (
                "Customer module files:\n"
                "- Spec files: `tests/02_customer/customer_listing_and_filters.ui.spec.ts`, `customer_create_flow.ui.spec.ts`\n"
                "- Page Objects: `pages/CustomerListPage.ts`, `pages/CustomerCreatePage.ts`"
            )

        if "visit" in user_msg:
            return (
                "Visit module has 10 comprehensive E2E specs in `tests/03_visits/`:\n"
                "Covering navigation, customer location, doc linkages, pricing calculations, line items, schedule recurrence, technician assignment, and spreadsheet exports."
            )

        if "auth" in user_msg or "login" in user_msg:
            return (
                "Auth setup:\n"
                "- Session state cached at `.auth/user.json`\n"
                "- API token cached at `.auth/api_token.json`\n"
                "- Page Object: `pages/LoginPage.ts`\n"
                "- Spec: `tests/01_auth/auth_lifecycle.api.spec.ts`"
            )

        return super()._mock_inference(messages)

if __name__ == "__main__":
    bot = XterminateChatbot(force_mock=True)
    print("Xterminate V2 AI Assistant Ready! Type 'exit' to quit.\n")
    while True:
        try:
            user_input = input("You: ")
            if user_input.strip().lower() in ["exit", "quit"]:
                break
            reply = bot.chat("cli_session", user_input)
            print(f"\nAI: {reply}\n")
        except (KeyboardInterrupt, EOFError):
            break
