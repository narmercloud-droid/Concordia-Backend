import requests
from typing import Any, Dict, Optional

class ConcordiaClient:
    def __init__(self, base_url: str = 'https://api.concordia.app', token: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.token = token

    def _headers(self):
        h = {'Content-Type': 'application/json'}
        if self.token:
            h['Authorization'] = f'Bearer {self.token}'
        return h

    def adminLogin(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        resp = requests.post(f"{self.base_url}/api/auth/login", json=payload, headers=self._headers())
        resp.raise_for_status()
        return resp.json()

    def requestMagicLink(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        resp = requests.post(f"{self.base_url}/api/auth/request-link", json=payload, headers=self._headers())
        resp.raise_for_status()
        return resp.json()

    # Additional methods can be added following operationId names.
