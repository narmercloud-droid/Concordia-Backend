import requests
from typing import Any, Dict, Optional

class ConcordiaAdminClient:
    def __init__(self, base_url: str = 'https://api.concordia.app', token: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.token = token

    def _headers(self):
        h = {'Content-Type': 'application/json'}
        if self.token:
            h['Authorization'] = f'Bearer {self.token}'
        return h

    def adminAuthLogin(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        r = requests.post(f"{self.base_url}/api/admin/auth/login", json=payload, headers=self._headers())
        r.raise_for_status()
        return r.json()

    def adminAuthLogout(self) -> Dict[str, Any]:
        r = requests.post(f"{self.base_url}/api/admin/auth/logout", headers=self._headers())
        r.raise_for_status()
        return r.json()

    def adminListOrders(self) -> Any:
        r = requests.get(f"{self.base_url}/api/admin/orders", headers=self._headers())
        r.raise_for_status()
        return r.json()

    def adminGetOrder(self, orderId: str) -> Any:
        r = requests.get(f"{self.base_url}/api/admin/orders/{orderId}", headers=self._headers())
        r.raise_for_status()
        return r.json()

    def adminPatchOrderStatus(self, orderId: str, status: str) -> Any:
        r = requests.patch(f"{self.base_url}/api/admin/orders/{orderId}/status", json={'status': status}, headers=self._headers())
        r.raise_for_status()
        return r.json()

    # menu, branches, metrics follow same pattern
