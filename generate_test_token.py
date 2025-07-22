#!/usr/bin/env python3
import jwt
import datetime
import base64

# JWT secret from assessment service properties (base64 decoded)
jwt_secret = base64.b64decode('dGhpcyBpcyBhIHZlcnkgc2VjdXJlIHNlY3JldCBrZXkgZm9yIGp3dCB0b2tlbiBnZW5lcmF0aW9uIHdoaWNoIHNob3VsZCBiZSBjaGFuZ2VkIGluIHByb2R1Y3Rpb24=')

# Token payload
payload = {
    'sub': 'moyenuddin075@gmail.com',  # username/email
    'userId': 1,  # Long - User ID
    'email': 'moyenuddin075@gmail.com',
    'role': 'ADMIN',
    'fullName': 'Test User',  # Required by assessment service
    'iat': datetime.datetime.utcnow(),
    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
}

# Generate token
token = jwt.encode(payload, jwt_secret, algorithm='HS256')
print(token)