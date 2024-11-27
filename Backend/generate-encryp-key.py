import json
import boto3
import base64
import os
from boto3.dynamodb.conditions import Key
import re

# Initialize AWS services
dynamodb = boto3.resource('dynamodb')
kms_client = boto3.client('kms')
table = dynamodb.Table('UserPasswords')

# Get KMS key ID from environment variable
KMS_KEY_ID = os.environ.get('KMS_KEY_ID')

def construct_response(status_code, body, cors=True):
    response = {
        "statusCode": status_code,
        "body": json.dumps(body),
    }
    if cors:
        response["headers"] = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    return response

# Encrypt the raw password using KMS
def encrypt_password(raw_password: str) -> str:
    try:
        response = kms_client.encrypt(
            KeyId=KMS_KEY_ID,
            Plaintext=raw_password.encode('utf-8')
        )
        encrypted_password = base64.b64encode(response['CiphertextBlob']).decode('utf-8')
        return encrypted_password
    except Exception as e:
        print(f"Error encrypting password: {e}")
        raise

# Decrypt the encrypted password using KMS
def decrypt_password(encrypted_password: str) -> str:
    try:
        encrypted_bytes = base64.b64decode(encrypted_password)
        response = kms_client.decrypt(
            CiphertextBlob=encrypted_bytes
        )
        decrypted_password = response['Plaintext'].decode('utf-8')
        return decrypted_password
    except Exception as e:
        print(f"Error decrypting password: {e}")
        raise

# Input validation
def validate_input(username: str, password: str = None) -> bool:
    username_regex = r"^[a-zA-Z0-9._-]{3,30}$"
    password_regex = r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$"
    if not re.match(username_regex, username):
        raise ValueError("Invalid username. Must be 3-30 characters and include letters, numbers, and valid symbols.")
    if password and not re.match(password_regex, password):
        raise ValueError("Invalid password. Must be at least 8 characters long and include a mix of letters and numbers.")
    return True

def handler(event, context):
    try:
        http_method = event.get('httpMethod')
        body = json.loads(event.get('body') or '{}')
        query_params = event.get('queryStringParameters', {})

        if http_method == 'POST':
            # Create User
            username = body.get('Username')
            password = body.get('Password')
            if not username or not password:
                return construct_response(400, {"message": "Username and Password are required"})
            validate_input(username, password)

            encrypted_password = encrypt_password(password)
            table.put_item(Item={'Username': username, 'Password': encrypted_password})
            return construct_response(201, {"message": "User created"})

        elif http_method == 'GET':
            # Get User
            username = query_params.get('Username')
            if not username:
                return construct_response(400, {"message": "Username is required"})
            validate_input(username)

            response = table.get_item(Key={'Username': username})
            if 'Item' in response:
                user_data = response['Item']
                encrypted_password = user_data.get('Password', '')
                # Avoid exposing decrypted passwords unless absolutely necessary
                user_data_response = {
                    "Username": user_data.get("Username"),
                    "Password": "********"
                }
                return construct_response(200, user_data_response)
            else:
                return construct_response(404, {"message": "User not found"})

        elif http_method == 'PUT':
            # Update User
            username = body.get('Username')
            password = body.get('Password')
            if not username or not password:
                return construct_response(400, {"message": "Username and Password are required"})
            validate_input(username, password)

            encrypted_password = encrypt_password(password)
            table.update_item(
                Key={'Username': username},
                UpdateExpression='SET Password = :password',
                ExpressionAttributeValues={':password': encrypted_password},
            )
            return construct_response(200, {"message": "Password updated"})

        elif http_method == 'DELETE':
            # Delete User
            username = body.get('Username')
            if not username:
                return construct_response(400, {"message": "Username is required"})
            validate_input(username)

            table.delete_item(Key={'Username': username})
            return construct_response(200, {"message": "User deleted"})

        elif http_method == 'OPTIONS':
            # Handle preflight CORS requests
            return construct_response(200, {"message": "CORS preflight"}, cors=True)

        else:
            return construct_response(405, {"message": "Method not allowed"})

    except ValueError as ve:
        return construct_response(400, {"message": str(ve)})
    except Exception as e:
        print(f"Error: {str(e)}")
        return construct_response(500, {"message": "Internal server error"})
