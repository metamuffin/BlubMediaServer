# BlubMediaServer

Blub Media Server is a server to store music for a local network. It provides a Web-base UI to listen and download the tracks and albums

## Important Notice

Blub Media Server does not include any authentifaction process to access the server. This means that everybody in the network the server is in can upload and download files.

## Setup

To run the server you need to first clone this repository then install, build and run the code.

Requirements:
- Node.js >= 10.0
- npm
- A local mongodb server on port 27017

```sh
# Clone the project
git clone https://www.github.com/MetaMuffin/BlubMediaServer.git
# Navigate in the project folder
cd BlubMediaServer
# Install required packages from npm
npm install
# Build
npm run build
# Run
npm run start
```

All the uploaded files are stored in the `media` folder.
To store them on a external device you have to mount it where `media` would normally be.

## Interfaces

### `Album`

- id: string
- title: string
- artist: string
- tracks: list of ids

### `Track`

- id: string
- title: string
- artist: string
- album: id or null

## API

### `GET /api/index`

- albums: List of `Album`
- tracks: List of `Track`

### `GET /media/track/<id>`

Sound file

### `GET /media/album/<id>`

Archive of all track of the album

### `DELETE /api/track/<id>`

### `DELETE /api/album/<id>`

### `POST /media/upload`

- Payload:
    - artist: string
    - title: string
    - album: id

### `POST /api/add-album`

- Payload:
    - title: string
    - artist: string
