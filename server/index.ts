
import Express, { static as estatic } from "express"
import { bindDownload } from "./download"
import { join } from "path"
import { MongoClient, Db } from "mongodb";
import { bindApi } from "./api";
import { urlencoded, json } from "body-parser";
import fileUpload from "express-fileupload";

export var db: MongoClient;
export var dbo: Db;

export const errMessage = "We got a lot of problems like this. please report this, even if you already reported 5 bugs today.";

async function main(){
    db = await MongoClient.connect("mongodb://localhost:27017/media")
    dbo = db.db("media")

    const app = Express()
    
    app.use(fileUpload({
        createParentPath: true,
        limits: { fileSize: 50 * 1024 * 1024 }
    }))

    app.use(json());
    app.use(urlencoded({extended: true}));

    app.get("/",(req,res) => {
        res.sendFile(join(__dirname, "../client/index.html"))
    })

    app.get("/favicon.ico", (req,res) => {
        res.sendFile(join(__dirname, "../client/favicon.ico"))
    })

    app.use("/static",estatic(join(__dirname, "../client")))

    bindDownload(app);
    bindApi(app)
    
    app.use((req,res,next) => {
        res.status(404)
        res.send("Sadly, we cant find anything associated to the link you manually typed in the url-bar to get this error.")
    })

    app.listen(8080,"0.0.0.0",() => {
        console.log("Listening...");
        
    })
}

main()
