
export const TYPE_DISPLAY: {[key:string]:string} = {
    audio: "Audio",
    picture: "Picture",
    video: "Video",
    collection: "Collection"
}
export const KEY_DISPLAY: {[key:string]:string} = {
    title: "Title: ",
    note: "Note or Description: ",
    meta: "Metadata: ",
    artist: "Artist: ",

}
export const ITEM_SPEC_GEN: {[key:string]: () => any} = {
    audio: () => ({title: "", artist: ""}),
    picture: () => ({title: "", note: "", meta: ""}),
    video: () => ({title: "", note: "", meta: ""}),
    collection: () => ({title: "", artist: "", note: "", content: []}),
}

export function sleep(ms: number) {
    return new Promise((r, _) => {
        setTimeout(r, ms)
    })
}

export function geti(id: string): HTMLElement {
    var el = document.getElementById(id)
    if (!el) throw new Error("Element not found: " + id);
    return el
}

export function para(text: string) {
    var p = document.createElement("p")
    p.textContent = text
    return p
}

export function genSpinner() {
    var spinner = document.createElement("div")
    spinner.classList.add("loader-box-spinner")
    for (let i = 0; i < 8; i++) {
        var e = document.createElement("div")
        spinner.appendChild(e)
    }
    return spinner
}

export function genericInputSetter(key: string, type: string, target: any, attr?: any) {
    var label = document.createElement("label")
    var inp = document.createElement((type != "textarea") ? "input" : type)
    if (type != "textarea") inp.setAttribute("type",type)
    var id = randomId(10)

    if (attr) for (const attr_name in attr) {
        if (attr.hasOwnProperty(attr_name)) inp.setAttribute(attr_name, attr[attr_name])
    }
    inp.value = target[key] || ""
    target[key] = inp.value

    inp.onchange = () => {
        console.log("Input onchange: " + inp.value);
        target[key] = inp.value
    }
    inp.setAttribute("id",id)

    label.textContent = KEY_DISPLAY[key]
    label.setAttribute("for",id)

    if (type == "textarea") {
        inp.setAttribute("rows","5")    
    }

    var br = document.createElement("br")
    return [label, inp, br]
}

export function fileSelectInput(key: string,target: any,accept: string) {
    var div = document.createElement("div")
    var inp = document.createElement("input")
    inp.type = "file"
    inp.onchange = (ev) => {
        //@ts-ignore
        div.children[0].style.display = "none"
        div.append(para("File ready to upload!"))
        
        //@ts-ignore
        var file = ev?.target.files[0]
        //@ts-ignore
        console.log(ev?.target.files[0]);
        
        target.set("file",file)
    }
    inp.setAttribute("accept",accept)
    inp.setAttribute("name","fileuploader")
    inp.setAttribute("value","Select File")
    div.appendChild(inp)
    return div
}

export function randomId(len: number) {
    var out = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < len; i++) {
        out += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return out;
}
