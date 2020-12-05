import { createServer, Socket } from "net";

interface FTPConnectionState {
    state: "fresh" | "awaiting-password" | "normal",
    username?: string,
    password?: string,
    pwd: string
}


async function dispatchCommand(bufline: string, sock: Socket, state: FTPConnectionState) {
    const err = (n:number,m:string) => {
        console.log(`[FTP-Error] ! ${n} ${m}`)
        sock.write(n.toString() + " " + m + "\n")
    }
    const ret = (n:number,m:string) => {
        console.log(`[FTP] < ${n} ${m}`)
        sock.write(n.toString() + " " + m + "\n")
    }
    const ignore = () => ret(200, "successfully ignored this command")

    var [com, ...args] = bufline.split(" ")

    if (state.state == "fresh") {
        if (com != "USER") return err(530,"Not logged in")
        if (!args[0]) return err(501,"Username missing")
        state.username = args[0]
        state.state = "awaiting-password"
        ret(331,"awaiting password")
    } else if (state.state == "awaiting-password") {
        if (com != "PASS") return err(503,"i need a password first")
        if (!args[0]) return err(501,"Password missing")
        state.password = args[0]
        state.state = "normal"
        ret(230,"logged in")
    } else if (state.state == "normal") {
        if (["OPTS","TYPE","PASV","PORT"].includes(com)) ignore()
        else if (com == "PWD") ret(257,`"${state.pwd}" is your f*cking location`)
        else if (com == "LIST") {
            ret(150,"Please wait for your file list... we will be right back")
            setTimeout(() => {
                ret(226,"well. thats it, thanks for waiting")
            },100)
        }
        else {
            return ret(502,"i cant do this.")
        }
    }
}


export async function ftpMain() {
    var server = createServer()

    var buf = ""
    server.on("connection", (sock) => {
        console.log("CONNECT");
        sock.write("220 semi-ftp-compatible blubmediaserver import-service ready\n")
        
        var state: FTPConnectionState = {
            state: "fresh",
            pwd: "/"
        }
        sock.on("data", chunk => {
            buf += chunk.toString()
            // TODO optimize this code
            var bsplit = buf.replace("\r\n","\n").split("\n")
            while (bsplit.length > 1) {
                var b = bsplit.shift()
                if (!b) continue
                console.log(`[FTP] > ${b}`);
                dispatchCommand(b, sock, state)
            }
            buf = bsplit[0]
        })
        sock.on("close",() => {
            console.log("DISCONNECT");
            
        })
    })


    server.listen(8880, "0.0.0.0", undefined, () => {
        console.log("semi-ftp-compatible server listening on 0.0.0.0:8880");
    })
}