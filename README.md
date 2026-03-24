# BoWatt Technical Test

Instagram-like web application that lets users upload images anonymously and view newly uploaded
images live in a feed.

## Instructions

```bash
# Setup backend
cd backend
go mod download

# Run backend
cd cmd
go run .
```

```bash
# Setup frontend
cd frontend
npm install

- Create a .env file inside the frontend folder:
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws

# Run frontend
npm run dev
```

## Explanation of the architecture and design

### Backend

The backend is implemented in Go and the Gin Web Framework. I chose a simple architecture compared to the scope of the task.

#### Main components

**handler**: GetFeed, PostUpload handlers to process requests and responses of feed fetching, and image uploading, normalizing.
**model**: Shared data structures. Image struct for the feed fetch, ImageForm struct for image uploading.
**service**: Functions for image metadata creation, metadata.json reading/writing, filtering images by tags.
**ws**: WebSocket functions for maniging client connections, and broadcasting.
**routers**: Routers are defined in the main.go.
**storage**: Images are saved into the /storage/image folder, each named with a generated unique ID. Their details are appended to the /storage/metadata.json file.

Plans:

- The tag filtering currently using a simple intersection check. For larger datasets this could be improved.
- Currently, it only works with .jpg. I wanted to make it work with other extensions as well.
- The WS connection closes after a while, I was going to fix that too.

### Frontend

The frontend is implemented in React + Vite + TailwindCSS + shadcnUI.

#### Main parts

I used shadcnUI and TailwindCSS because this way I could get a reasonably good looking UI from the start.

**components**: This contains the shadcnUI components, and the navbar.
**features**: The feed, upload image feature related components are implemented here.
**hooks**: It contains the hooks for fetching the feed, uploading image, and handling the incoming ws messages.
**lib**: Shared utilities. Server config from the .env. Image type (matching the Image struct at the backend).

Plans:

- Better state management when communicating with the server, such as showing loading, success components.
- Making it overall more user-friendly, such as submitting with enter.

## API Documentation

#### GET /feed

Returns the list of the uploaded images.

##### Tag filter example:

```bash
/feed?tag=mountain&tag=sunset
```

Using the tag filter, it returns only the uploaded images which has at least one same tag.

##### Response:

```bash
[
    {
        "id": "2bb76b79-7ef7-44c2-92fc-c1f75e53f4e1",
        "title": "Mountain sunset",
        "url": "/images/2bb76b79-7ef7-44c2-92fc-c1f75e53f4e1.jpg",
        "tags": [
            "mountain",
            "sunset",
            "nature"
        ],
        "createdAt": "2026-03-24T08:37:24.494616718+01:00"
    }
]
```

#### POST /upload

Uploads a new image.

Images are uploaded using multipart/form-data.

##### Form fields:

```bash
title: string   // Image title
tags: string[]  // Image tags
file: file  //Image file
```

#### Curl request example:

```bash
curl -X POST http://localhost:8080/upload \
  -F "title=Mountain sunset" \
  -F "tags=mountain" \
  -F "tags=sunset" \
  -F "tags=nature" \
  -F "file=@./mountain_sunset_image.jpg"
```

#### Response:

```bash
'mountain_sunset_image.jpg' uploaded!
```

#### GET /images/:filename

Returns the uploaded image file.

#### Example:

```bash
GET /images/2bb76b79.jpg
```

#### Response:

```bash
Image file
```

#### WebSocket /ws

Notifies all the connected clients when a new image is uploaded.

#### Message:

```bash
"new image"
```
