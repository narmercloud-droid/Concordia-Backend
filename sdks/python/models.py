from dataclasses import dataclass
from typing import Any, Dict

@dataclass
class GenericModel:
    data: Dict[str, Any]

# Minimal model placeholders for schemas
AdminLoginRequest = GenericModel
AuthResponse = GenericModel
ErrorResponse = GenericModel
RequestMagicLinkRequest = GenericModel
TokenResponse = GenericModel
VerifyOtpRequest = GenericModel
OrderItem = GenericModel
OrderCreateRequest = GenericModel
Order = GenericModel
Voucher = GenericModel
Category = GenericModel
MenuItem = GenericModel
Variant = GenericModel
VariantGroup = GenericModel
