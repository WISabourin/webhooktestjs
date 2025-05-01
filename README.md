# webhooktestjs

**webhooktestjs** is a lightweight Node.js server that allows you to create, test, and inspect webhooks on the fly. It’s useful for local development and testing of services that send webhook payloads.

## Features

- 🔧 Create dynamic webhook endpoints with a unique ID  
- 📥 Receive and store incoming POST payloads  
- 🔍 View received events per webhook  
- 📜 List all active webhook endpoints  
- ❌ Clear all webhooks and their data  
- 🔐 Optional HTTPS support via environment variables  

## Getting Started

### Prerequisites

- Node.js (v14 or newer)  
- npm  
- Optional: SSL certificate files for HTTPS support  

### Installation

```
git clone git@github.com:WISabourin/webhooktestjs.git
cd webhooktestjs
npm install
```
### Configuration

Create a .env file (optional):
```
HOOKSJS_PORT=3000
HOOKSJS_USE_SSL=false
HOOKSJS_SSL_PRIVATE_KEY=./certs/key.pem
HOOKSJS_SSL_CERTIFICATE=./certs/cert.pem
```

### Start the Server

```
npm start
```

## API Endpoints

| Endpoint        | Method | Description                                                  |
|-----------------|--------|--------------------------------------------------------------|
| `/new-webhook`  | GET    | Creates a new webhook listener and returns its UID          |
| `/webhooks`     | GET    | Lists all active webhook listener UIDs                       |
| `/events/:id`   | GET    | Returns all events received by a specific webhook UID        |
| `/:uid`         | POST   | Receives a webhook event (created dynamically per `/new-webhook`) |
| `/remove`       | GET    | Deletes all listeners and stored events                      |

# Example Usage

## Create a new webhook
```
curl http://localhost:3000/new-webhook
```
###  returns something like: ```3ac4971e-d49a-4d9c-a7e6-9d59b2e92c8d```

### Send a webhook POST
```
curl -X POST http://localhost:3000/3ac4971e-d49a-4d9c-a7e6-9d59b2e92c8d \
     -H "Content-Type: application/json" \
     -d '{"message": "hello world"}'
```

# Retrieve events
```
curl http://localhost:3000/events/3ac4971e-d49a-4d9c-a7e6-9d59b2e92c8d
```
