import { Express } from "express"
import { dbo } from "."
import { Track, Album } from "./types"

export async function getAllTracks(): Promise<Array<Track>> {
    return await dbo.collection("track").find({}).toArray()
}

export async function getAllAlbums(): Promise<Array<Album>> {
    return await dbo.collection("album").find({}).toArray()
}

export function bindApi(app: Express) {
    app.get("/api/index", async (req,res) => {
        var [tracks,albums] = await Promise.all([getAllTracks(), getAllAlbums()])
        res.send(JSON.stringify({
            albums,
            tracks
        }))
    })
}