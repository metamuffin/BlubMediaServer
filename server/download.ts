
import { Express } from "express"
import { dbo, errMessage } from ".";
import { join } from "path";
import { Track, Album } from "./types";
import { open, stat } from "fs/promises";
import Archiver from "archiver";
import { arch } from "os";
import { trackFilename } from "./api";

export function safeFilename(fn:string):string {
    return fn.replace(/[\.\/]/i,"")
}

export function bindDownload(app: Express) {
    app.get("/media/track/:id", async (req,res) => {
        var id = req.params.id;
        var result:Track | null = await dbo.collection("track").findOne({id: id})
        if (!result) {
            res.status(404)
            res.send("Track not found")
            return 
        }
        var fn = join(__dirname, `../media/${result?.id}.${safeFilename(result?.ext || "unknown")}`)
        await stat(fn).catch((err) => {
            res.status(500)
            if (err.code === "ENOENT"){
                res.send("Track cannot be found on local file system. :(")
            } else {
                res.send(errMessage)
            }
        })
        res.sendFile(fn)
    })

    app.get("/media/album/:id", async (req,res) => {
        var id = req.params.id;
        var album:Album | null = await dbo.collection("album").findOne({id: id})
        if (!album) {
            res.status(404)
            res.send("Album not found")
            return 
        }
        
        var archive = Archiver("tar")        
        
        res.writeHead(200, {
            'Content-Type': 'application/tar',
            'Content-disposition': `attachment; filename=${safeFilename(album.title + "_-_" + album.artist)}.tar`
        });
        archive.pipe(res);
        
        for (const trackId of album.tracks) {
            var track:Track | null = await dbo.collection("track").findOne({id: trackId})
            if (!track) {
                res.status(500)
                res.send("At least one of the tracks of this album could not be resolved")
                return
            }
            archive.file(trackFilename(track),{name: safeFilename(`${track.title} - ${track.artist}`) + `.${track.ext}`})            
        }
        archive.append(JSON.stringify(album),{name: "album.json"})
        
        archive.finalize()
    })

}