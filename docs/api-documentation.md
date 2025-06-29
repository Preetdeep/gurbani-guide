# API Documentation

## Overview

The Gurbani Guide API provides endpoints for spiritual guidance based on authentic Sikh sources.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

Currently, the API is open for development. Authentication will be added in production.

## Endpoints

### Chat API

#### POST `/chat`

Process a spiritual question and get AI-powered guidance.

**Request Body:**
```json
{
  "message": "How can I find peace in difficult times?",
  "userId": "user123",
  "context": {}
}
```

**Response:**
```json
{
  "response": "According to Gurbani...",
  "sources": [...],
  "verses": [...],
  "timestamp": "2025-06-29T12:00:00Z"
}
```

#### GET `/chat/history/:userId`

Get conversation history for a user.

**Parameters:**
- `userId` (string): User identifier
- `limit` (query, optional): Number of conversations to return (default: 20)

### Gurbani API

#### GET `/gurbani/search`

Search for Gurbani verses.

**Query Parameters:**
- `query` (string, required): Search terms
- `limit` (number, optional): Number of results (default: 10)

**Response:**
```json
{
  "query": "peace",
  "results": [...],
  "total": 5
}
```

#### GET `/gurbani/daily`

Get daily verse for inspiration.

**Response:**
```json
{
  "verse": {
    "gurmukhi": "...",
    "english_translation": "...",
    "reference": "Ang 123"
  },
  "date": "2025-06-29"
}
```

#### GET `/gurbani/verse/:ang/:line?`

Get specific verse by reference.

**Parameters:**
- `ang` (number): Page number in Sri Guru Granth Sahib
- `line` (number, optional): Specific line number

### Search API

#### GET `/search`

Semantic search across all content.

**Query Parameters:**
- `query` (string, required): Search terms
- `type` (string, optional): Content type filter ('all', 'gurbani', 'katha', 'historical')
- `limit` (number, optional): Number of results (default: 10)

#### GET `/search/katha/:scholar`

Search within specific scholar's katha.

**Parameters:**
- `scholar` (string): Scholar name (e.g., 'pinderpal-singh')

**Query Parameters:**
- `query` (string, required): Search terms
- `limit` (number, optional): Number of results (default: 5)

#### GET `/search/historical`

Search historical content and sakhis.

**Query Parameters:**
- `query` (string, required): Search terms
- `limit` (number, optional): Number of results (default: 5)

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing required parameters)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message",
  "message": "Detailed description"
}
```

## Rate Limiting

Current limits (development):
- 100 requests per 15 minutes per IP
- Production limits will be stricter

## Data Models

### Verse Object
```json
{
  "id": "unique_id",
  "gurmukhi": "ਗੁਰਮੁਖੀ ਟੈਕਸਟ",
  "english_translation": "English translation",
  "reference": "Ang 123, Line 4",
  "author": "Guru Nanak Dev Ji",
  "raag": "Raag Name",
  "ang": 123,
  "line_number": 4
}
```

### Response Object
```json
{
  "text": "AI generated response",
  "sources": [
    {
      "type": "gurbani|katha|historical",
      "reference": "Source reference",
      "text": "Relevant text"
    }
  ],
  "verses": [Verse],
  "confidence": 0.85
}
```

## WhatsApp Integration

The API also supports WhatsApp integration through:

### Webhook: `/webhook/whatsapp`

Receives WhatsApp messages and processes them automatically.

## Development Notes

- All timestamps are in ISO 8601 format
- Text content supports Unicode for Gurmukhi script
- Semantic search uses OpenAI embeddings
- All responses include source citations for authenticity
