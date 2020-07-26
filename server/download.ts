
import { Express } from "express"
import { dbo, errMessage } from ".";
import { join } from "path";
import { Track } from "./types";
import { open, stat } from "fs/promises";

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
        res.status(501)
        res.send("Not yet implementet... Sorry.")
    })
}