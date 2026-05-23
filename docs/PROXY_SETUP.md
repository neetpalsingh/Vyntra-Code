# Setting Up free-claude-code Proxy

Vyntra Code uses [free-claude-code](https://github.com/your-repo/free-claude-code) as a proxy layer for provider routing and request translation.

## Why Use a Proxy?

**free-claude-code** handles:
- ✅ Provider routing (OpenAI, Anthropic, Gemini, Groq, etc.)
- ✅ Request translation between different API formats
- ✅ API key management
- ✅ Streaming responses
- ✅ Admin UI for configuration
- ✅ OpenAI & Anthropic API compatibility

This means Vyntra can focus on IDE-specific features instead of provider complexity.

## Installation Options

### Option 1: Docker (Recommended)

```bash
# Clone free-claude-code
git clone https://github.com/your-repo/free-claude-code.git
cd free-claude-code

# Run with Docker
docker-compose up -d
```

The proxy will be available at `http://localhost:8338`

### Option 2: Local Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/free-claude-code.git
cd free-claude-code

# Install dependencies
npm install

# Configure providers
cp .env.example .env
# Edit .env with your API keys

# Start the proxy
npm start
```

### Option 3: Use Existing Instance

If you already have free-claude-code running elsewhere:

```bash
# In Vyntra backend/.env
PROXY_URL=http://your-proxy-url:8338
```

## Configuration

### 1. Configure Providers in free-claude-code

Access the admin UI at `http://localhost:8338/admin`

Add your API keys:
- OpenAI: `sk-...`
- Anthropic: `sk-ant-...`
- Google Gemini: `...`
- Groq: `gsk_...`
- etc.

### 2. Configure Vyntra Backend

```bash
# backend/.env
PROXY_URL=http://localhost:8338
```

### 3. Test the Connection

```bash
# Test proxy health
curl http://localhost:8338/health

# Test chat endpoint
curl -X POST http://localhost:8338/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Architecture Flow

```
Vyntra Extension
    ↓ HTTP
Vyntra Backend (FastAPI)
    ├─ Context Building
    ├─ Agent Runtime
    ├─ RAG Service
    └─ Tool Execution
    ↓ HTTP
free-claude-code Proxy
    ├─ Provider Routing
    ├─ Request Translation
    ├─ Authentication
    └─ Streaming
    ↓ HTTPS
AI Providers (OpenAI, Anthropic, etc.)
```

## Available Endpoints

### Chat Completions (OpenAI Format)
```
POST /v1/chat/completions
Content-Type: application/json

{
  "model": "gpt-4",
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

### Messages (Anthropic Format)
```
POST /v1/messages
Content-Type: application/json

{
  "model": "claude-3-opus-20240229",
  "messages": [...],
  "max_tokens": 2000
}
```

### List Models
```
GET /v1/models
```

### Admin UI
```
GET /admin
```

## Troubleshooting

### Proxy not responding

```bash
# Check if running
curl http://localhost:8338/health

# Check Docker logs
docker-compose logs -f

# Or local logs
npm run logs
```

### Provider errors

1. Check API keys in admin UI
2. Verify provider is enabled
3. Check rate limits
4. Review proxy logs

### Vyntra can't connect to proxy

```bash
# Verify PROXY_URL in backend/.env
cat backend/.env | grep PROXY_URL

# Test from Vyntra backend
cd backend
source venv/bin/activate  # or .\venv\Scripts\Activate.ps1
python -c "import httpx; print(httpx.get('http://localhost:8338/health').json())"
```

## Advanced Configuration

### Custom Port

```bash
# In free-claude-code
PORT=8338 npm start

# In Vyntra backend/.env
PROXY_URL=http://localhost:8338
```

### Multiple Vyntra Instances

One proxy can serve multiple Vyntra instances:

```
Vyntra Instance 1 ────┐
Vyntra Instance 2 ────┼──→ free-claude-code Proxy ──→ Providers
Vyntra Instance 3 ────┘
```

### Production Deployment

For production, deploy free-claude-code separately:

```bash
# Deploy proxy to your infrastructure
# Set PROXY_URL to production URL
PROXY_URL=https://proxy.yourdomain.com
```

## Benefits

1. **Centralized Provider Management** - Configure providers once
2. **Automatic Translation** - Works with any provider's format
3. **Easy Provider Switching** - Change providers without code changes
4. **Shared Resources** - Multiple tools can use same proxy
5. **Official APIs Only** - No scraping, no ToS violations
