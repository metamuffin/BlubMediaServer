
import Express from "express"
import { bindDownload } from "./download"
import { join } from "path"
import { MongoClient, Db } from "mongodb";
import { bindApi } from "./api";

export var db: MongoClient;
export var dbo: Db;

export const errMessage = "We got a lot of problems like this. please report this, even if you already reported 5 bugs today.";

async function main(){
    db = await MongoClient.connect("mongodb://localhost:27017/media")
    dbo = db.db("media")

    const app = Express()
    
    app.get("/",(req,res) => {
        res.sendFile(join(__dirname, "../client/index.html"))
    })
    
    bindDownload(app);
    bindApi(app)
    
    app.listen(8000,"0.0.0.0",() => {
        console.log("Listening...");
        
    })
}

main()
