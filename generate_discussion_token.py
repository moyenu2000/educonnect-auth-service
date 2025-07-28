#!/usr/bin/env python3
import jwt
import time
import base64

# JWT secret from application.properties (base64 encoded)
JWT_SECRET_BASE64 = "dGhpcyBpcyBhIHZlcnkgc2VjdXJlIHNlY3JldCBrZXkgZm9yIGp3dCB0b2tlbiBnZW5lcmF0aW9uIHdoaWNoIHNob3VsZCBiZSBjaGFuZ2VkIGluIHByb2R1Y3Rpb24="
JWT_SECRET = base64.b64decode(JWT_SECRET_BASE64).decode('utf-8')

# Current time
current_time = int(time.time())
expiration_time = current_time + 86400  # 24 hours

# Payload
payload = {
    "role": "STUDENT",
    "userId": 1,
    "email": "test@educonnect.com",
    "sub": "testuser",
    "iat": current_time,
    "exp": expiration_time
}

# Generate token
token = jwt.encode(payload, JWT_SECRET, algorithm='HS512')

print(token)