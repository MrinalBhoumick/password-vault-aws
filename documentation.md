# Vaultify - Password Management Application

Vaultify is a secure password management application that enables users to store, retrieve, and manage passwords. It leverages the following tech stack:

- **Frontend**: React
- **Backend**: AWS Lambda, API Gateway, DynamoDB
- **Deployment**: AWS Amplify, CI/CD using GitHub Actions

This documentation outlines the complete implementation, including the architecture, configuration, and deployment of the Vaultify application.

## **Architecture Overview**

Vaultify consists of two main components:

1. **Frontend**: A React-based web application that interacts with the backend API to perform password management operations.
2. **Backend**: A serverless backend built using AWS services:
   - **AWS Lambda**: Functions that handle CRUD operations for managing passwords.
   - **AWS API Gateway**: Exposes HTTP endpoints for the frontend to interact with the backend.
   - **AWS DynamoDB**: A NoSQL database for securely storing user credentials (passwords).

The application is deployed and managed using **AWS Amplify** for frontend hosting, and the **CI/CD pipeline** is configured with **GitHub Actions** to automate deployments to AWS.

---

## **Demo**

You can explore a live demo of the Vaultify Password Management Application by visiting the following URL:

[**Vaultify - Live Demo**](https://password-vault-aws.vercel.app/)

The demo allows you to interact with the application and test its features such as creating, retrieving, updating, and deleting passwords.

---

## **Frontend Implementation (React)**

The frontend is built with React and interacts with the backend API via HTTP requests. The React app allows users to:

- **Create** a new user with a password.
- **Retrieve** stored passwords for a user.
- **Update** the password for an existing user.
- **Delete** a user’s account.

### **React Setup**

1. **React App**: The React application is initialized using Create React App.

2. **API Integration**: Axios is used to handle HTTP requests to the backend API.

3. **Frontend Pages**:
   - **Home**: A dashboard displaying options to create, view, update, and delete passwords.
   - **Login/Register**: Forms for user authentication.
   - **Password Management**: Forms for managing stored passwords (Create, Update, Delete).

```bash
npx create-react-app vaultify-frontend
cd vaultify-frontend
npm install axios
```

---

## **Backend Implementation (AWS Lambda, API Gateway, DynamoDB)**

The backend is composed of several AWS services that handle the password management logic.

### **1. AWS Lambda Functions**

AWS Lambda is used for processing CRUD operations on the DynamoDB table. Lambda functions are triggered by HTTP requests through API Gateway.

#### **Lambda Function Code (Python 3.13)**

```python
import json
import boto3
from botocore.exceptions import ClientError

# DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UserPasswords')

# Helper function to handle responses
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

def handler(event, context):
    try:
        http_method = event['httpMethod']
        body = json.loads(event.get('body', '{}'))

        if http_method == 'POST':
            username = body.get('Username')
            password = body.get('Password')
            if not username or not password:
                return construct_response(400, {"message": "Username and Password are required"})

            # Insert into DynamoDB
            table.put_item(Item={'Username': username, 'Password': password})
            return construct_response(201, {"message": "User created"})

        elif http_method == 'GET':
            username = event.get('queryStringParameters', {}).get('Username')
            if not username:
                return construct_response(400, {"message": "Username is required"})

            # Retrieve from DynamoDB
            response = table.get_item(Key={'Username': username})
            if 'Item' in response:
                return construct_response(200, response['Item'])
            else:
                return construct_response(404, {"message": "User not found"})

        elif http_method == 'PUT':
            username = body.get('Username')
            password = body.get('Password')
            if not username or not password:
                return construct_response(400, {"message": "Username and Password are required"})

            # Update in DynamoDB
            table.update_item(
                Key={'Username': username},
                UpdateExpression='SET Password = :password',
                ExpressionAttributeValues={':password': password},
            )
            return construct_response(200, {"message": "Password updated"})

        elif http_method == 'DELETE':
            username = body.get('Username')
            if not username:
                return construct_response(400, {"message": "Username is required"})

            # Delete from DynamoDB
            table.delete_item(Key={'Username': username})
            return construct_response(200, {"message": "User deleted"})

        elif http_method == 'OPTIONS':
            return construct_response(200, {"message": "CORS preflight"}, cors=True)

        else:
            return construct_response(405, {"message": "Method not allowed"})

    except Exception as e:
        return construct_response(500, {"message": str(e)})
```

### **2. AWS API Gateway**

API Gateway serves as the entry point for all frontend requests. It defines the HTTP methods (`POST`, `GET`, `PUT`, `DELETE`, `OPTIONS`) and routes them to the corresponding Lambda function for processing.

```yaml
PasswordApi:
  Type: AWS::ApiGateway::RestApi
  Properties:
    Name: PasswordManagementApi
    Description: API for Vaultify password management

PasswordApiResource:
  Type: AWS::ApiGateway::Resource
  Properties:
    ParentId: !GetAtt PasswordApi.RootResourceId
    PathPart: user
    RestApiId: !Ref PasswordApi

PasswordApiMethod:
  Type: AWS::ApiGateway::Method
  Properties:
    HttpMethod: ANY
    AuthorizationType: NONE
    ResourceId: !Ref PasswordApiResource
    RestApiId: !Ref PasswordApi
    Integration:
      IntegrationHttpMethod: POST
      Type: AWS_PROXY
      Uri: arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/${PasswordManagementLambda.Arn}/invocations
```

---

## **Backend Resources**

### **3. AWS DynamoDB Table**

A DynamoDB table is created to store user passwords. The partition key is `Username`, and the table is set to use on-demand billing.

```yaml
UserPasswordTable:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: UserPasswords
    AttributeDefinitions:
      - AttributeName: Username
        AttributeType: S
    KeySchema:
      - AttributeName: Username
        KeyType: HASH
    BillingMode: PAY_PER_REQUEST
```

### **4. IAM Role for Lambda Execution**

The Lambda function requires an IAM role to interact with DynamoDB and CloudWatch for logging.

```yaml
LambdaExecutionRole:
  Type: AWS::IAM::Role
  Properties:
    AssumeRolePolicyDocument:
      Version: "2012-10-17"
      Statement:
        - Effect: Allow
          Principal:
            Service: lambda.amazonaws.com
          Action: sts:AssumeRole
    Policies:
      - PolicyName: PasswordManagementPolicy
        PolicyDocument:
          Version: "2012-10-17"
          Statement:
            - Effect: Allow
              Action:
                - dynamodb:PutItem
                - dynamodb:GetItem
                - dynamodb:UpdateItem
                - dynamodb:DeleteItem
                - dynamodb:Scan
              Resource: !GetAtt UserPasswordTable.Arn
            - Effect: Allow
              Action:
                - logs:CreateLogGroup
                - logs:CreateLogStream
                - logs:PutLogEvents
              Resource: "arn:aws:logs:*:*:*"
```

---

## **Deployment with AWS Amplify and GitHub Actions**

### **1. Frontend Deployment with AWS Amplify**

AWS Amplify is used to host the React frontend application. Amplify connects to the GitHub repository, builds, and deploys the application to the cloud.

1. Initialize the Amplify project:
    ```bash
    amplify init
    ```

2. Set up hosting:
    ```bash
    amplify add hosting
    amplify publish
    ```

3. Connect the GitHub repository for continuous deployment.

### **2. Backend Deployment with GitHub Actions**

GitHub Actions is configured for CI/CD, ensuring that the Lambda function, API Gateway, and DynamoDB are automatically deployed whenever changes are pushed to the repository.

#### **GitHub Actions Workflow (example)**

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up AWS CLI
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{

 secrets.AWS_SECRET_ACCESS_KEY }}
          region: us-west-2

      - name: Deploy Lambda Function
        run: |
          aws lambda update-function-code --function-name PasswordManagementLambda --zip-file fileb://function.zip

      - name: Deploy API Gateway
        run: |
          aws apigateway create-deployment --rest-api-id ${{ secrets.API_ID }} --stage prod
```

---

## **Security Considerations**

1. **Password Encryption**: Use **AWS KMS** to encrypt sensitive data in DynamoDB at rest.
2. **CORS**: Ensure the correct CORS headers are set on API Gateway to allow safe cross-origin communication.
3. **IAM Roles**: Apply the principle of least privilege when defining IAM roles for Lambda functions.