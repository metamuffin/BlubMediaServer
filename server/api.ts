import { Express } from "express"
import { dbo } from "."
import { Track, Album } from "./types"
import { v4 as UUIDv4 } from "uuid"
import { join } from "path"
import { fstat } from "fs"
import { unlink } from "fs/promises"


export async function getAllTracks(): Promise<Array<Track>> {
    return await dbo.collection("track").find({}).toArray()
}

export async function getAllAlbums(): Promise<Array<Album>> {
    return await dbo.collection("album").find({}).toArray()
}

export function trackFilename(t:Track) {
    return join(__dirname, `../media/${t.id}.${t.ext}`)
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
        
        if (req.body.album){
            var album = await dbo.collection("album").findOne({id: req.body.album})
            if (!album) {
                res.status(404)
                res.send("Album not found")
                return
            }
            album.tracks.push(id)
            await dbo.collection("album").findOneAndReplace({id: album.id}, album)
        }
        
        var n:Track = {
            id,
            title: req.body.title || "unknown",
            artist: req.body.artist || "unknown",
            ext: file.name?.split(".")[1] || "unknown",
            length: 0,
            album: req.body.album || null
        }
        file.mv(trackFilename(n))
        await dbo.collection("track").insertOne(n)
        res.status(200)
        res.send("OK")
    })

    app.post("/api/add-album", async (req,res) => {
        var id = UUIDv4()
        var n:Album = {
            id,
            title: req.body.title || "unknown",
            artist: req.body.artist || "unknown",
            tracks: []
        }
        await dbo.collection("album").insertOne(n)
        res.status(200)
        res.send("OK")
    })

    app.delete("/api/track/:id", async (req,res) => {
        var id = req.params.id;
        var removed = await dbo.collection("track").findOneAndDelete({id: id})
        if (!removed.ok) {
            res.status(404)
            res.send("Track not found.")
            return
        }
        var value:Track = removed.value
        await unlink(trackFilename(value))
        if (value.album) {
            var album:Album|null = await dbo.collection("album").findOne({id: value.album})
            if (album){
                album.tracks.splice(album.tracks.findIndex(i => i == value.id),1)
                await dbo.collection("album").findOneAndReplace({id: album.id},album)
            }
        }
        res.status(200)
        res.send("OK")
    })

    app.delete("/api/album/:id", async (req,res) => {
        var id = req.params.id;
        var removed = await dbo.collection("album").findOneAndDelete({id: id})
        if (!removed.ok) {
            res.status(404)
            res.send("Track not found.")
            return
        }
        var dels = []
        for (const trackId of removed.value.tracks) {
            dels.push(async () => {
                var res = await dbo.collection("track").findOneAndDelete({id: trackId})
                await unlink(trackFilename(res.value))
            })
        }
        await Promise.all(dels)
        res.status(200)
        res.send("OK")
    })
}