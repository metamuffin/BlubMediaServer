import { Express } from "express"
import { dbo } from "."
import { Track, Album } from "./types"
import { v4 as UUIDv4 } from "uuid"
import { join } from "path"


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


    app.post("/media/upload", async (req,res) => {
        if (!req.files || !req.files.upload) {
            res.status(400)
            res.send("No file sent.")
        }
        var id = UUIDv4()
        var file:any = req?.files?.upload
        var n:Track = {
            id,
            title: req.body.title || "unknown",
            artist: req.body.artist || "unknown",
            ext: file.name?.split(".")[1] || "unknown",
            length: 0,
            album: req.body.album || null
        }
        file.mv(join(__dirname, `../media/${id}.${n.ext}`))
        await dbo.collection("track").insertOne(n)
        res.status(200)
        res.send("OK")
    })
}