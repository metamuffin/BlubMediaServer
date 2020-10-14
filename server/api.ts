import { Express } from "express";
import { dbo, db, dboi } from ".";
import { Track, Collection, Item, Picture, Video } from "./types";
import { v4 as UUIDv4 } from "uuid";
import { join, isAbsolute } from "path";
import { unlink } from "fs/promises";

export function validateItem(v: any): boolean {
    var i: Item = v;
    if (!i.a || !i.type || !i.id || !i.containedIn) return false;
    if (i.type == "collection") {
        var icc: Collection = i.a;
        if (!icc.content || !icc.artist || icc.note || icc.title)
            return false;
    } else if (i.type == "picture") {
        var icp: Picture = i.a;
        if (!icp.meta || !icp.note || !icp.title) return false;
    } else if (i.type == "track") {
        var ict: Track = i.a;
        if (!ict.artist || !ict.title) return false;
    } else if (i.type == "video") {
        var ica: Video = i.a;
        if (!ica.meta || !ica.title || !ica.note) return false;
    } else return false;
    return true;
}

export function itemWithFiles(i: Item) {
    return i.type != "collection";
}

export function tryJsonParse(s: string): any | undefined {
    try {
        var j = JSON.parse(s);
    } catch (e) {
        return undefined;
    }
    return j;
}


export async function getItemByUUID(id:string): Promise<Item | undefined> {
    if (!id) return undefined
    return await dbo.collection("item").findOne({id}) || undefined
}
export async function patchItemByUUID(id:string,i: Item) {
    if (!id) return undefined
    return await dbo.collection("item").replaceOne({id},i);
}
export async function deleteItemByUUID(id:string) {
    if (!id) return undefined
    return await dbo.collection("item").deleteMany({id});
}

export function filenameOfItem(i: Item) {
    return join(__dirname, `../media/${i.a.id}`);
}

export function bindApi(app: Express) {
    app.get("/api/", async (req, res) => {});

    app.post("/media/add-item", async (req, res) => {
        if (!validateItem(req.body)) {
            res.status(400);
            res.send("Invalid Item");
        }
        var i: Item = req.body;
        i.id = UUIDv4();
        var filesNeeded = itemWithFiles(i);
        if (!req.files || !req.files.upload && filesNeeded) {
            res.status(400);
            res.send("No file sent.");
        }
        if (filesNeeded) {
            var file:any = req.files?.upload
            file.mv(filenameOfItem(i));
        }
        await dboi.insertOne(i)
        res.send("OK")
    });

    app.patch("/api/item/:id", async (req, res) => {
        var iold = await getItemByUUID(req.params.id);
        if (!iold) throw {status: 400, message: "Invalid UUID"};
        if (!validateItem(req.body)) {
            res.status(400);
            res.send("Invalid Item");
        }
        var inew: Item = req.body;
        if (inew.id != iold.id || inew.type != iold.type) throw {status: 400, message: "Cannot change id or type of item with patch."}
        await patchItemLinks(iold,inew)
        if (inew.type == "collection") await patchCollectionLinks(iold,inew);
        await dboi.replaceOne({id:req.params.id},inew);
        res.send("OK")
        
    });

    
    app.delete("/api/item/:id", async (req, res) => {
        var i = await getItemByUUID(req.params.id);
        if (!i) throw {status: 400, message: "Invalid UUID"};
        var hasFiles = itemWithFiles(i);
        if (hasFiles) {
            console.log(`DELETE: ${filenameOfItem(i)}`);
            //await unlink(filenameOfItem(i))
        }
        await dboi.deleteOne({id:i.id});
        res.send("OK")
    });
}


export async function patchItemLinks(iold: Item, inew: Item) {
    var links_added = inew.containedIn.filter(l => !iold.containedIn.includes(l));
    var links_removed = iold.containedIn.filter(l => !inew.containedIn.includes(l));
    for (const lid of links_added) {
        var target_item_col:Item | null = await dboi.findOne({id: lid})
        if (!target_item_col) {
            console.log(`[${iold.type} ${iold.id}] Cannot add link to invalid collection ${lid}`);
            continue
        }
        if (target_item_col.type != "collection") {
            console.log(`[${iold.type} ${iold.id}] Item would be linked to a non-collection item`);
            continue
        }
        var target_col: Collection = target_item_col.a
        if (target_col.content.includes(lid)) {
            console.log(`[${iold.type} ${iold.id}] Item was already linked to a collection`);
            continue
        }
        target_col.content.push(lid)
    }
    for (const lid of links_removed) {
        var target_item_col:Item | null = await dboi.findOne({id: lid})
        if (!target_item_col) {
            console.log(`[${iold.type} ${iold.id}] Cannot remove invalid link to ${lid} removed`);
            continue
        }
        if (target_item_col.type != "collection") {
            console.log(`[${iold.type} ${iold.id}] Item was linked to a non-collection item`);
            continue
        }
        var target_col: Collection = target_item_col.a
        if (!target_col.content.includes(lid)) {
            console.log(`[${iold.type} ${iold.id}] Item was not linked to a collection`);
            continue
        }
        target_col.content.splice(target_col.content.findIndex(e => e == lid),1)
    }
}

export async function patchCollectionLinks(cold: Item, cnew: Item) {
    var content_added = cnew.containedIn.filter(l => !cold.containedIn.includes(l));
    var content_removed = cold.containedIn.filter(l => !cnew.containedIn.includes(l));
    for (const lid of content_added) {
        var target_item:Item | null = await dboi.findOne({id: lid})
        if (!target_item) {
            console.log(`[${cold.type} ${cold.id}] Cannot add link to invalid item ${lid}`);
            continue
        }
        if (target_item.containedIn.includes(lid)) {
            console.log(`[${cold.type} ${cold.id}] Collection was already linked to this item`);
            continue
        }
        target_item.containedIn.push(lid)
    }
    for (const lid of content_removed) {
        var target_item:Item | null = await dboi.findOne({id: lid})
        if (!target_item) {
            console.log(`[${cold.type} ${cold.id}] Cannot remove invalid link to ${lid}`);
            continue
        }
        if (!target_item.containedIn.includes(lid)) {
            console.log(`[${cold.type} ${cold.id}] Collection was not linked to a item`);
            continue
        }
        target_item.containedIn.splice(target_item.containedIn.findIndex(e => e == lid),1)
    }
}