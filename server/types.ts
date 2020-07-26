

export interface Track {
    id: string,
    title: string,
    artist: string,
    album?: string,
    length: number,
    ext: string,
}
 
export interface Album {
    id: string,
    title: string,
    artist: string,
    tracks: Array<string>,
}

