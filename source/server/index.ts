import Express, { static as estatic, json } from "express";
import { join } from "path";
import { MongoClient, Db, Collection as MCollection } from "mongodb";
import { bindApi } from "./api";
import { bindDownload } from "./download";
import { Item, Collection, ROOT_COLLECTION } from "../types";
import fileUpload from "express-fileupload";
import Webpack from "webpack"
import WebpackDevMiddleware from "webpack-dev-middleware"

export var db: MongoClient;
export var dbo: Db;
export var dboi: MCollection;

export const errMessage =
    "We got a lot of problems like this. please report this, even if you already reported 5 bugs today.";

const SLOWDOWN_DEBUG = false;

async function main() {
    db = await MongoClient.connect("mongodb://localhost:27017/media");
    dbo = db.db("media");
    dboi = dbo.collection("item");

    const app = Express();

    const webpackConfig = require('../../webpack.config');
    const compiler = Webpack(webpackConfig)
    const devMiddleware = WebpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    })
    app.use("/scripts",devMiddleware)


    app.disable("x-powered-by");

    app.use(
        fileUpload({
            createParentPath: true,
            limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
            safeFileNames: true,
        })
    );

    app.use(json());
    //app.use(urlencoded({ extended: true }));

    app.get("/", (req, res) => {
        res.sendFile(join(__dirname, "../../public/index.html"));
    });

    app.use("/static", estatic(join(__dirname, "../../public")));

    app.get("/favicon.ico", (req, res) => {
        res.sendFile(join(__dirname, "../../public/favicon.ico"));
    });

    if (SLOWDOWN_DEBUG)
        app.use((req, res, next) => {
            setTimeout(next, 1000);
        });

    bindApi(app);
    bindDownload(app);

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
            title: "Root",
        };
        var i: Item = {
            id: ROOT_COLLECTION,
            a: c,
            containedIn: [],
            type: "collection",
            timestamp: 0,
        };
        await dboi.insertOne(i);
        console.log("Created new Root Collection");
    }


    app.listen(8080, "0.0.0.0", () => {
        console.log("Listening...");
    });
}

main();
