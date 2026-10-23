"""
Universal AI Chatbot Engine
Supports:
- Local offline mock mode (zero cost, unlimited, instant for CI/CD test automation)
- OpenAI-compatible cloud endpoints (NVIDIA NIM, Groq, Ollama, OpenRouter)
"""
import os
from typing import List, Dict, Optional

class AIChatbot:
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None, model: str = "llama-3.1-nemotron-70b-instruct", force_mock: bool = False):
        self.api_key = api_key or os.getenv("NVIDIA_API_KEY", "")
        self.base_url = base_url or os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
        self.model = model
        self.force_mock = force_mock
        self.sessions: Dict[str, List[Dict[str, str]]] = {}
        self.system_prompt = "You are a professional customer support assistant. Provide helpful, safe, and concise answers."

    def get_history(self, session_id: str) -> List[Dict[str, str]]:
        if session_id not in self.sessions:
            self.sessions[session_id] = [{"role": "system", "content": self.system_prompt}]
        return self.sessions[session_id]

    def clear_session(self, session_id: str):
        if session_id in self.sessions:
            del self.sessions[session_id]

    def _mock_inference(self, messages: List[Dict[str, str]]) -> str:
        """High-speed deterministic mock inference for free unlimited automated testing."""
        user_msg = messages[-1]["content"].lower()
        full_context = " ".join([m["content"] for m in messages if m["role"] == "user"])

        # Safety & guardrail check
        harmful_keywords = ["hack", "exploit", "steal", "bypass security", "malware"]
        if any(w in user_msg for w in harmful_keywords):
            return "I cannot fulfill this request. I must adhere to safety and security standards."

        # Memory / Context test checks
        if "what is my name" in user_msg or "who am i" in user_msg:
            for m in reversed(messages):
                if m["role"] == "user" and "my name is " in m["content"].lower():
                    name = m["content"].lower().split("my name is ")[-1].strip(". ")
                    return f"Your name is {name.capitalize()}."
            return "I don't know your name yet."

        # Support FAQ checks
        if "shipping" in user_msg:
            return "Our standard shipping takes 2 to 4 business days, and hours are 9 AM to 6 PM EST."
        if "refund" in user_msg or "return" in user_msg:
            return "Items can be refunded within 30 days of purchase with a valid receipt."

        return f"Echo: Thank you for your question about '{messages[-1]['content']}'. How else can I assist you today?"

    def chat(self, session_id: str, user_message: str, force_mock: Optional[bool] = None) -> str:
        history = self.get_history(session_id)
        history.append({"role": "user", "content": user_message})

        use_mock = self.force_mock if force_mock is None else force_mock
        # Use mock inference if forced or if no valid API key is present
        if use_mock or not self.api_key or self.api_key == "YOUR_NVAPI_KEY_HERE":
            reply = self._mock_inference(history)
            history.append({"role": "assistant", "content": reply})
            return reply

        # Real cloud inference via OpenAI-compatible endpoint (NVIDIA / Groq / Local Ollama)
        try:
            from openai import OpenAI
            client = OpenAI(base_url=self.base_url, api_key=self.api_key)
            completion = client.chat.completions.create(
                model=self.model,
                messages=history,
                temperature=0.3,
                max_tokens=512,
            )
            reply = completion.choices[0].message.content or ""
            history.append({"role": "assistant", "content": reply})
            return reply
        except Exception as e:
            # Graceful fallback for resilient automated testing
            fallback_reply = f"[Fallback Response due to: {str(e)[:50]}] " + self._mock_inference(history)
            history.append({"role": "assistant", "content": fallback_reply})
            return fallback_reply
