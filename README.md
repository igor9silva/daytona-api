# Daytona API

A lightweight API server built with **Elysia** and **Bun** that provides code execution capabilities using the Daytona SDK.

## 🚀 Features

- **Fast Runtime**: Built with Bun for maximum performance
- **Type-Safe**: Full TypeScript support with Elysia
- **Code Execution**: Execute code securely in Daytona sandboxes
- **Timeout Protection**: 60-second execution timeout
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

### `POST /execute`
Execute code in a Daytona sandbox.

**Request Body**:
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
- All `console.*` methods are captured and returned
- Multiple console calls are returned on separate lines
- Objects are formatted with proper indentation
- `console.table()` returns formatted tables
- `console.time()` and `console.timeEnd()` work as expected
- Both stdout and stderr are captured

**Examples**:

*Simple output:*
```bash
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(\"Hello from Daytona!\")"}'
# Output: Hello from Daytona!
```

*Multiple console calls:*
```bash
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(\"First\"); console.warn(\"Warning\"); console.error(\"Error\")"}'
# Output:
# First
# Warning  
# Error
```

*Objects and tables:*
```bash
curl -X POST http://localhost:4000/execute \
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

*Error handling:*
```bash
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "invalidSyntax("}'
# Output: [eval].ts(1,13): error TS1005: ')' expected.
```

## 🏗️ Architecture

- **Runtime**: Bun
- **Framework**: Elysia
- **Language**: TypeScript
- **Sandbox**: Daytona SDK
- **Timeout**: 60 seconds
- **Structure**: Single endpoint design

## 🚀 Deployment

Any Docker-compatible platform.

The Docker image is built with multi-stage builds for minimal size and includes security best practices.
