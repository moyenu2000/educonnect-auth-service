#!/usr/bin/env python3
import jwt
import base64
import time
from datetime import datetime, timedelta

# JWT secret from application.properties
jwt_secret_base64 = "dGhpcyBpcyBhIHZlcnkgc2VjdXJlIHNlY3JldCBrZXkgZm9yIGp3dCB0b2tlbiBnZW5lcmF0aW9uIHdoaWNoIHNob3VsZCBiZSBjaGFuZ2VkIGluIHByb2R1Y3Rpb24="
jwt_secret = base64.b64decode(jwt_secret_base64)

# Generate JWT token with test user data
payload = {
    "sub": "testuser",
    "userId": 1,
    "email": "test@example.com",
    "role": "STUDENT",
    "fullName": "Test User",
    "iat": int(time.time()),
    "exp": int(time.time()) + 86400  # 24 hours
}

# Generate token
token = jwt.encode(payload, jwt_secret, algorithm="HS512")
print("Generated JWT Token:")
print(token)

# Verify token
try:
    decoded = jwt.decode(token, jwt_secret, algorithms=["HS512"])
    print("\nToken is valid. Decoded payload:")
    print(decoded)
except jwt.InvalidTokenError as e:
    print(f"Token validation failed: {e}")