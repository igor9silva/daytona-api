# Daytona API

A lightweight API server built with **Elysia** and **Bun** that provides code execution capabilities using the Daytona SDK.

## 🚀 Features

- **Fast Runtime**: Built with Bun for maximum performance
- **Type-Safe**: Full TypeScript support with Elysia
- **Code Execution**: Execute TypeScript and Python code securely in Daytona sandboxes
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

2. **Configure environment variables**:
   Copy your Daytona API key to `.env.local`:
   ```bash
   DAYTONA_API_KEY=your_daytona_api_key_here
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
docker run -p 4000:4000 -e DAYTONA_API_KEY=your_api_key daytona-api
```

## 📡 API Endpoints

### `GET /`
Health check endpoint that returns API information.

**Response**:
```json
{
  "message": "Daytona Code Execution API",
  "version": "1.0.0",
  "endpoints": {
    "/execute/typescript": "POST - Execute TypeScript code in Daytona sandbox",
    "/execute/python": "POST - Execute Python code in Daytona sandbox"
  }
}
```

### `POST /execute/typescript`
Execute TypeScript code in a Daytona sandbox.

### `POST /execute/python`
Execute Python code in a Daytona sandbox.

**Request Body** (same for both endpoints):
```json
{
  "code": "console.log('Hello World')"
}
```

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
curl -X POST http://localhost:4000/execute/typescript \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(\"Hello from TypeScript!\")"}'
# Output: Hello from TypeScript!
```

*Python execution:*
```bash
curl -X POST http://localhost:4000/execute/python \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello from Python!\")"}'
# Output: Hello from Python!
```

*TypeScript with objects:*
```bash
curl -X POST http://localhost:4000/execute/typescript \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log({name: \"test\", value: 42}); console.table([{a: 1, b: 2}])"}'
# Output:
# { name: 'test', value: 42 }
# ┌─────────┬───┬───┐
# │ (index) │ a │ b │
# ├─────────┼───┼───┤
# │ 0       │ 1 │ 2 │
# └─────────┴───┴───┘
```

*Python with multiple prints:*
```bash
curl -X POST http://localhost:4000/execute/python \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"First line\"); print(\"Second line\"); print(f\"Math: {2 + 2}\")"}'
# Output:
# First line
# Second line
# Math: 4
```

*Error handling (TypeScript):*
```bash
curl -X POST http://localhost:4000/execute/typescript \
  -H "Content-Type: application/json" \
  -d '{"code": "invalidSyntax("}'
# Output: [eval].ts(1,13): error TS1005: ')' expected.
```

*Error handling (Python):*
```bash
curl -X POST http://localhost:4000/execute/python \
  -H "Content-Type: application/json" \
  -d '{"code": "print(undefined_variable)"}'
# Output: NameError: name 'undefined_variable' is not defined
```

## 🏗️ Architecture

- **Runtime**: Bun
- **Framework**: Elysia with plugin-based architecture
- **Language**: TypeScript
- **Sandbox**: Daytona SDK
- **Timeout**: Configurable (default: 60 seconds)
- **Structure**: Language-specific endpoints with shared logic

## 🚀 Deployment

Any Docker-compatible platform.

The Docker image is built with multi-stage builds for minimal size and includes security best practices.
