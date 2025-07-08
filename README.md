# Bedtime Stories GraphQL API

A GraphQL API for generating and managing bedtime stories for children in multiple languages.

## Features

- 🚀 **GraphQL API** - Flexible querying and mutations
- 🌍 **Multi-language Support** - Hindi, English, and other Indian languages
- 📚 **Story Generation** - AI-powered story creation using Together AI
- 🎯 **Age Group Targeting** - Stories tailored for different age groups
- 💾 **MongoDB Storage** - Persistent story storage
- 🔍 **Advanced Filtering** - Filter stories by language, age group, etc.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables:**
   Create a `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   TOGETHER_API_KEY=your_together_ai_api_key
   PORT=8000
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **Access GraphQL Playground:**
   Visit `http://localhost:8000/graphql`

## GraphQL Queries

### Generate a Story
```graphql
mutation GenerateStory {
  generateStory(input: {
    childName: "Aarav"
    ageGroup: "3-6"
    topic: "kind tiger"
    language: "Hindi"
  }) {
    success
    story {
      id
      title
      language
      ageGroup
      story_en
      story_hi
      createdAt
    }
    error
  }
}
```

### Get All Stories
```graphql
query GetStories {
  stories {
    id
    title
    language
    ageGroup
    story_en
    story_hi
    createdAt
  }
}
```

### Filter Stories
```graphql
query FilterStories {
  stories(filter: {
    language: "Hindi"
    ageGroup: "3-6"
    limit: 10
    offset: 0
  }) {
    id
    title
    language
    ageGroup
    story_en
    story_hi
    createdAt
  }
}
```

### Get Recent Stories
```graphql
query RecentStories {
  recentStories(limit: 5) {
    id
    title
    language
    ageGroup
    story_en
    story_hi
    createdAt
  }
}
```

### Get Stories by Language
```graphql
query StoriesByLanguage {
  storiesByLanguage(language: "Hindi") {
    id
    title
    language
    ageGroup
    story_en
    story_hi
    createdAt
  }
}
```

### Get a Single Story
```graphql
query GetStory {
  story(id: "story_id_here") {
    id
    title
    language
    ageGroup
    story_en
    story_hi
    promptUsed
    generatedBy
    createdAt
  }
}
```

## GraphQL Mutations

### Update Story
```graphql
mutation UpdateStory {
  updateStory(
    id: "story_id_here"
    title: "Updated Title"
    story_en: "Updated English story"
    story_hi: "अपडेटेड हिंदी कहानी"
  ) {
    id
    title
    story_en
    story_hi
  }
}
```

### Delete Story
```graphql
mutation DeleteStory {
  deleteStory(id: "story_id_here")
}
```

## API Endpoints

- **GraphQL Playground:** `http://localhost:8000/graphql`
- **Health Check:** `http://localhost:8000/health`

## Supported Languages

- Hindi (hi)
- English (en)
- Bengali (bn)
- Tamil (ta)
- Telugu (te)
- Marathi (mr)
- Malayalam (ml)
- Kannada (kn)
- Gujarati (gu)
- Punjabi (pa)

## Age Groups

- 3-6 years
- 7-10 years
- 11-14 years

## Example Usage with cURL

### Generate a Story
```bash
curl -X POST http://localhost:8000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { generateStory(input: { childName: \"Aarav\", ageGroup: \"3-6\", topic: \"kind tiger\", language: \"Hindi\" }) { success story { id title story_en story_hi } error } }"
  }'
```

### Get All Stories
```bash
curl -X POST http://localhost:8000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { stories { id title language ageGroup story_en story_hi createdAt } }"
  }'
```

## Error Handling

The API includes comprehensive error handling:
- GraphQL validation errors
- Database connection errors
- AI service errors
- JSON parsing errors

All errors are logged and returned with appropriate HTTP status codes.

## Development

- **Hot reload:** `npm run dev`
- **Production:** `npm start`
- **Port:** Configurable via `PORT` environment variable

## Dependencies

- **Apollo Server Express** - GraphQL server
- **GraphQL** - Query language
- **Mongoose** - MongoDB ODM
- **Axios** - HTTP client for AI API
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing 