# Daytona API

A lightweight API server built with **Elysia** and **Bun** that provides code execution capabilities using the Daytona SDK.

## 🚀 Features

- **Fast Runtime**: Built with Bun for maximum performance
- **Type-Safe**: Full TypeScript support with Elysia
- **Code Execution**: Execute TypeScript and Python code securely in Daytona sandboxes
- **API Key Authentication**: Simple and secure API key-based authentication
- **Timeout Protection**: Configurable execution timeout (default: 60 seconds)
- **Docker Ready**: Lightweight multi-stage Docker build
- **Production Ready**: Optimized for deployment on Railway, Fly.io, etc.

## 📋 Requirements

- [Bun](https://bun.sh) runtime
- Daytona API key

## 🛠️ Setup

1. **Install dependencies**:
```bash
bun install
```

2. **Generate an API key**:
```bash
bun -e "console.log(crypto.randomUUID().replaceAll('-', '').slice(0, 32))"
```

3. **Configure environment variables**:
Copy your Daytona API key and set up authentication to `.env.local`:
```bash
DAYTONA_API_KEY=your_daytona_api_key_here
API_KEY=your_generated_api_key_here  # Required for authentication
PORT=4000  # Optional, defaults to 4000
EXECUTION_TIMEOUT_SECONDS=60  # Optional, defaults to 60
```

## 🏃 Development

Start the development server:
```bash
bun run dev
```

The server will start at `http://localhost:4000`

## 🏗️ Production

Build for production:
```bash
bun run build
```

Start production server:
```bash
bun run start
```

## 🐳 Docker

Build the Docker image:
```bash
docker build -t daytona-api .
```

Run the container:
```bash
docker run -p 4000:4000 -e DAYTONA_API_KEY=your_api_key -e API_KEY=your_api_key daytona-api
```

## 🔐 Authentication

All API endpoints require authentication using an API key. Include the API key in your requests using either:

- **Header**: `X-API-Key: your_api_key_here`
- **Authorization Header**: `Authorization: Bearer your_api_key_here`

**Example**:
```bash
curl -H "X-API-Key: YOUR_API_KEY" http://localhost:4000/
```

## 📡 API Endpoints

**Note: All endpoints require authentication using an API key.**

### `GET /`
Health check endpoint that returns API information.

**Response**:
```json
{
  "message": "Daytona Code Execution API",
  "version": "1.0.0",
  "endpoints": {
    "/execute": "POST - Execute TypeScript or Python code in Daytona sandbox"
  }
}
```

### `POST /execute`
Execute TypeScript or Python code in a Daytona sandbox.

**Request Body**:
```json
{
  "code": "console.log('Hello World')",
  "language": "typescript"
}
```

**Parameters**:
- `code` (string, required): The code to execute in the sandbox
- `language` (string, required): The programming language - either `"typescript"` or `"python"`

**Response Format**:
- **Success (200)**: Returns the execution output as plain text
- **Error (400)**: Returns validation error message as plain text  
- **Error (500)**: Returns execution error message as plain text

**Output Behavior**:
- All `console.*` methods are captured and returned (TypeScript)
- All `print()` statements are captured and returned (Python)
- Multiple output calls are returned on separate lines
- Objects are formatted with proper indentation
- `console.table()` returns formatted tables (TypeScript)
- `console.time()` and `console.timeEnd()` work as expected (TypeScript)
- Both stdout and stderr are captured

**Examples**:

*TypeScript execution:*
```bash
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"code": "console.log(\"Hello from TypeScript!\")", "language": "typescript"}'
# Output: Hello from TypeScript!
```

*Python execution:*
```bash
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"code": "print(\"Hello from Python!\")", "language": "python"}'
# Output: Hello from Python!
```

*TypeScript with objects and console.table:*
```bash
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"code": "console.log({name: \"test\", value: 42}); console.table([{a: 1, b: 2}])", "language": "typescript"}'
# Output:
# { name: 'test', value: 42 }
# ┌─────────┬───┬───┐
# │ (index) │ a │ b │
# ├─────────┼───┼───┤
# │ 0       │ 1 │ 2 │
# └─────────┴───┴───┘
```

*Python with multiple prints and math:*
```bash
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"code": "import math\nprint(\"First line\")\nprint(f\"Pi: {math.pi}\")\nprint(f\"Math: {2 + 2}\")", "language": "python"}'
# Output:
# First line
# Pi: 3.141592653589793
# Math: 4
```

*Error handling (TypeScript):*
```bash
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"code": "invalidSyntax(", "language": "typescript"}'
# Output: [eval].ts(1,13): error TS1005: ')' expected.
```

*Error handling (Python):*
```bash
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"code": "print(undefined_variable)", "language": "python"}'
# Output: NameError: name 'undefined_variable' is not defined
```

*Invalid language parameter:*
```bash
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"code": "console.log(\"test\")", "language": "javascript"}'
# Output: Invalid request: Please provide valid "code" (string) and "language" ("typescript" or "python") parameters
```

## 🏗️ Architecture

- **Runtime**: Bun
- **Framework**: Elysia with plugin-based architecture
- **Language**: TypeScript
- **Sandbox**: Daytona SDK
- **Timeout**: Configurable (default: 60 seconds)
- **Structure**: Single unified endpoint with language selection

## 🚀 Deployment

Any Docker-compatible platform.

The Docker image is built with multi-stage builds for minimal size and includes security best practices.
