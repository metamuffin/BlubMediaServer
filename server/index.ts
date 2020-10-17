import Express, { static as estatic } from "express";
import { join } from "path";
import { MongoClient, Db, Collection as MCollection} from "mongodb";
import { urlencoded, json } from "body-parser";
import fileUpload from "express-fileupload";
import { bindApi } from "./api";
import { bindDownload } from "./download";
import { Item, Collection } from "./types";

export var db: MongoClient;
export var dbo: Db;
export var dboi: MCollection;

export const errMessage =
    "We got a lot of problems like this. please report this, even if you already reported 5 bugs today.";
export const ROOT_COLLECTION = "'00000000-0000-0000-0000-000000000000'";

async function main() {
    db = await MongoClient.connect("mongodb://localhost:27017/media");
    dbo = db.db("media");
    dboi = dbo.collection("item");

    const app = Express();

    app.use(
        fileUpload({
            createParentPath: true,
            limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
        })
    );

    app.use(json());
    app.use(urlencoded({ extended: true }));

    app.get("/", (req, res) => {
        res.sendFile(join(__dirname, "../client/index.html"));
    });

    app.get("/favicon.ico", (req, res) => {
        res.sendFile(join(__dirname, "../client/favicon.ico"));
    });

    app.use("/static", estatic(join(__dirname, "../client")));

    bindDownload(app);
    bindApi(app);

    app.use((req, res, next) => {
        res.status(404);
        res.send(
            "Sadly, we cant find anything associated to the link you manually typed in the url-bar to get this error."
        );
    });

    if (!(await dboi.findOne({ id: ROOT_COLLECTION }))) {
        var c: Collection = {
            artist: "",
            content: [],
            note: "All Contents of this Mediaserver",
            title: "Root"
        }
        var i: Item = {
            id: ROOT_COLLECTION,
            a: c,
            containedIn: [],
            type: "collection"
        };
        await dboi.insertOne(i);
        console.log("Created new Root Collection");   
    }

    app.listen(8080, "0.0.0.0", () => {
        console.log("Listening...");
    });
}

main();
