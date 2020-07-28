# BlubMediaServer

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
- length: number

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

## Legal Notices

favicon.ico was created by freepik from flaticon.com