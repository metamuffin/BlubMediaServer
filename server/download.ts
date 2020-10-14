
import {Express} from "express"
import { validateItem, itemWithFiles, filenameOfItem, getItemByUUID } from "./api";
import { Item, Collection } from "./types";
import archiver from "archiver";
import {Archiver} from "archiver";

export function bindDownload(app:Express) {
    app.get("/api/item/:id", async (req, res) => {
        var i: Item |undefined = await getItemByUUID(req.params.id);
        if (!i) throw {status: 400, message: "Invalid item id"}

        if (itemWithFiles(i)) {
            var path = filenameOfItem(i);
            res.sendFile(path)
        } else {
            var a = archiver("tar");
            await addItemToArchive(a,i);
            a.pipe(res)
            a.finalize()
        }
    });

}

export async function addCollectionToArchive(archive: Archiver, item: Item) {
    if (item.type != "collection") return
    var col: Collection = item.a;
    var reqs_promises = col.content.map((iid: string) => getItemByUUID(iid));
    var reqs = await Promise.all(reqs_promises);
    for (const i of reqs) {
        if (!i) { console.log("ERRORORORORORORRROREIAUIOUOAS"); continue }
        addItemToArchive(archive,item)
    }
}

export async function addItemToArchive(archive: Archiver,item: Item) {
    if (item.type == "collection") return await addCollectionToArchive(archive,item);
    archive.append(filenameOfItem(item), {name: itemDisplayName(item)})
}

export function itemDisplayName(item: Item) {
    if (item.type == "collection") return `${item.a.title}`
    if (item.type == "picture") return `${item.a.title}`
    if (item.type == "track") return `${item.a.artist} - ${item.a.title}`
    if (item.type == "video") return `${item.a.title}`
    else return `UNKNOWN ${Math.random()}`
}

export function validateCollectionNoRecursion() {
    // TODO TODO TODO
}