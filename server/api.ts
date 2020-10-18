import { Express } from "express";
import { dbo, db, dboi } from ".";
import { Audio, Collection, Item, Picture, Video } from "./types";
import { v4 as UUIDv4 } from "uuid";
import { join, isAbsolute } from "path";
import { unlink } from "fs/promises";

export function validateItem(v: any): boolean {
    var i: Item = v;
    if (!i) return false;
    if (!i.a || !i.type || !i.id || !i.containedIn) return false;
    if (i.type == "collection") {
        var icc: Collection = i.a;
        if (
            undefined == icc.content ||
            undefined == icc.artist ||
            undefined == icc.note ||
            !icc.title
        )
            return false;
    } else if (i.type == "picture") {
        var icp: Picture = i.a;
        if (undefined == icp.meta || undefined == icp.note || !icp.title)
            return false;
    } else if (i.type == "audio") {
        var ict: Audio = i.a;
        if (undefined == ict.artist || !ict.title) return false;
    } else if (i.type == "video") {
        var ica: Video = i.a;
        if (undefined == ica.meta || !ica.title || undefined == ica.note)
            return false;
    } else return false;
    console.log("E");
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

export async function getItemByUUID(id: string): Promise<Item | undefined> {
    if (!id) return undefined;
    return (await dbo.collection("item").findOne({ id })) || undefined;
}
export async function patchItemByUUID(id: string, i: Item) {
    if (!id) return undefined;
    return await dbo.collection("item").replaceOne({ id }, i);
}
export async function deleteItemByUUID(id: string) {
    if (!id) return undefined;
    return await dbo.collection("item").deleteMany({ id });
}

export function filenameOfItem(i: Item) {
    return join(__dirname, `../media/${i.id}`);
}

export function bindApi(app: Express) {
    /*app.get("/api", async (req, res) => {
        res.send(JSON.stringify({
            status: "OK"
        }))
    });*/

    app.post("/api/add-item", async (req, res) => {
        var __temp: any = req.query.json; // TODO
        var json_input = tryJsonParse(__temp);
        if (!json_input || !validateItem(json_input)) {
            res.status(400);
            res.send("Invalid Item");
            return;
        }
        var a: any = "";
        var i: Item = json_input || a;
        console.log(`[API] Add item`);
        i.id = UUIDv4();
        var filesNeeded = itemWithFiles(i);
        if ((!req.files || !req.files.file) && filesNeeded) {
            res.status(400);
            res.send("-> No file sent.");
            return;
        }
        if (filesNeeded) {
            var file: any = req.files?.file;
            file.mv(filenameOfItem(i));
        }
        await dboi.insertOne(i);
        patchItemLinks(
            {
                a: {},
                containedIn: [],
                id: "[IOLD PLACEHOLDER]",
                type: i.type,
            },
            i
        );
        res.send("-> OK");
    });

    app.get("/api/item/:id", async (req, res) => {
        console.log(`[API] GET ${req.params.id}`);
        var item = await getItemByUUID(req.params.id);
        if (!item) {
            console.log("-> Not Found");
            res.status(404);
            res.send("Item not found");
            return;
        }
        res.send(JSON.stringify(item));
        console.log(`-> OK`);
    });

    app.patch("/api/item/:id", async (req, res) => {
        console.log(`[API] PATCH ${req.params.id}`);
        var iold = await getItemByUUID(req.params.id);
        if (!iold) throw { status: 400, message: "Invalid UUID" };
        if (!validateItem(req.body)) {
            res.status(400);
            res.send("Invalid Item");
            return;
        }
        var inew: Item = req.body;
        if (inew.id != iold.id || inew.type != iold.type)
            throw {
                status: 400,
                message: "Cannot change id or type of item with patch.",
            };
        await patchItemLinks(iold, inew);
        if (inew.type == "collection") await patchCollectionLinks(iold, inew);
        await dboi.replaceOne({ id: req.params.id }, inew);
        res.send("OK");
    });

    app.delete("/api/item/:id", async (req, res) => {
        console.log(`[API] DELETE ${req.params.id}`);
        var i = await getItemByUUID(req.params.id);
        if (!i) throw { status: 400, message: "Invalid UUID" };
        var hasFiles = itemWithFiles(i);
        if (hasFiles) {
            console.log(`DELETE: ${filenameOfItem(i)}`);
            //await unlink(filenameOfItem(i))
        }
        await dboi.deleteOne({ id: i.id });
        res.send("OK");
    });
}

export async function patchItemLinks(iold: Item, inew: Item) {
    var links_added = inew.containedIn.filter(
        (l) => !iold.containedIn.includes(l)
    );
    var links_removed = iold.containedIn.filter(
        (l) => !inew.containedIn.includes(l)
    );
    for (const lid of links_added) {
        console.log(`New link from ${inew.id} to ${lid}`);
        var target_item_col: Item | null = await dboi.findOne({ id: lid });
        if (!target_item_col) {
            console.log(
                `[${inew.type} ${inew.id}] Cannot add link to invalid collection ${lid}`
            );
            continue;
        }
        if (target_item_col.type != "collection") {
            console.log(
                `[${inew.type} ${inew.id}] Item would be linked to a non-collection item`
            );
            continue;
        }
        var target_col: Collection = target_item_col.a;
        if (target_col.content.includes(inew.id)) {
            console.log(
                `[${inew.type} ${inew.id}] Item was already linked to a collection`
            );
            continue;
        }
        target_col.content.push(inew.id);
        await dboi.replaceOne({ id: lid }, target_item_col);
    }
    for (const lid of links_removed) {
        console.log(`Link removed from ${inew.id} to ${lid}`);
        var target_item_col: Item | null = await dboi.findOne({ id: lid });
        if (!target_item_col) {
            console.log(
                `[${inew.type} ${inew.id}] Cannot remove invalid link to ${lid} removed`
            );
            continue;
        }
        if (target_item_col.type != "collection") {
            console.log(
                `[${inew.type} ${inew.id}] Item was linked to a non-collection item`
            );
            continue;
        }
        var target_col: Collection = target_item_col.a;
        if (!target_col.content.includes(inew.id)) {
            console.log(
                `[${inew.type} ${inew.id}] Item was not linked to a collection`
            );
            continue;
        }
        target_col.content.splice(
            target_col.content.findIndex((e) => e == inew.id),
            1
        );
        await dboi.replaceOne({ id: lid }, target_item_col);
    }
}

export async function patchCollectionLinks(cold: Item, cnew: Item) {
    var content_added = cnew.containedIn.filter(
        (l) => !cold.containedIn.includes(l)
    );
    var content_removed = cold.containedIn.filter(
        (l) => !cnew.containedIn.includes(l)
    );
    for (const lid of content_added) {
        var target_item: Item | null = await dboi.findOne({ id: lid });
        if (!target_item) {
            console.log(
                `[${cold.type} ${cold.id}] Cannot add link to invalid item ${lid}`
            );
            continue;
        }
        if (target_item.containedIn.includes(cnew.id)) {
            console.log(
                `[${cold.type} ${cold.id}] Collection was already linked to this item`
            );
            continue;
        }
        target_item.containedIn.push(cnew.id);
        await dboi.replaceOne({ id: lid }, target_item);
    }
    for (const lid of content_removed) {
        var target_item: Item | null = await dboi.findOne({ id: lid });
        if (!target_item) {
            console.log(
                `[${cold.type} ${cold.id}] Cannot remove invalid link to ${lid}`
            );
            continue;
        }
        if (!target_item.containedIn.includes(cnew.id)) {
            console.log(
                `[${cold.type} ${cold.id}] Collection was not linked to a item`
            );
            continue;
        }
        target_item.containedIn.splice(
            target_item.containedIn.findIndex((e) => e == cnew.id),
            1
        );
        await dboi.replaceOne({ id: lid }, target_item);
    }
}
