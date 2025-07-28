#!/usr/bin/env python3
import jwt
import base64
import json
from datetime import datetime, timedelta

# JWT secret from the config
JWT_SECRET = "dGhpcyBpcyBhIHZlcnkgc2VjdXJlIHNlY3JldCBrZXkgZm9yIGp3dCB0b2tlbiBnZW5lcmF0aW9uIHdoaWNoIHNob3VsZCBiZSBjaGFuZ2VkIGluIHByb2R1Y3Rpb24="

# Decode the base64 secret
secret_key = base64.b64decode(JWT_SECRET)

# Create test payload
payload = {
    'sub': 'testuser',
    'userId': 123,
    'email': 'test@example.com',
    'role': 'STUDENT',
    'fullName': 'Test User',
    'iat': int(datetime.utcnow().timestamp()),
    'exp': int((datetime.utcnow() + timedelta(hours=24)).timestamp())
}

# Generate JWT token
token = jwt.encode(payload, secret_key, algorithm='HS512')
print("Generated JWT Token:")
print(token)

# Save to file for easy reuse
with open('/home/pridesys/projects/408_backend/educonnect-auth-service/test_jwt_token.txt', 'w') as f:
    f.write(token)

print("\nToken saved to test_jwt_token.txt")