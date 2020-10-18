
const TYPE_DISPLAY = {
    audio: "Audio",
    picture: "Picture",
    video: "Video",
    collection: "Collection"
}
const KEY_DISPLAY = {
    title: "Title: ",
    note: "Note or Description: ",
    meta: "Metadata: ",
    artist: "Artist: ",

}
const ITEM_SPEC_GEN = {
    audio: () => ({title: "", artist: ""}),
    picture: () => ({title: "", note: "", meta: ""}),
    video: () => ({title: "", note: "", meta: ""}),
    collection: () => ({title: "", artist: "", note: "", content: []}),
}

function sleep(ms) {
    return new Promise((r, _) => {
        setTimeout(r, ms)
    })
}

function geti(id) {
    return document.getElementById(id)
}

function para(text) {
    var p = document.createElement("p")
    p.textContent = text
    return p
}

function genSpinner() {
    var spinner = document.createElement("div")
    spinner.classList.add("loader-box-spinner")
    for (let i = 0; i < 8; i++) {
        var e = document.createElement("div")
        spinner.appendChild(e)
    }
    return spinner
}

function genericInputSetter(key, type, target, attr) {
    var label = document.createElement("label")
    var inp = document.createElement((type != "textarea") ? "input" : type)
    if (type != "textarea") inp.type = type
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
        inp.setAttribute("rows",5)    
    }

    var br = document.createElement("br")
    return [label, inp, br]
}

function fileSelectInput(key,target,accept) {
    var div = document.createElement("div")
    var inp = document.createElement("input")
    inp.type = "file"
    inp.onchange = (ev) => {
        div.children[0].style.display = "none"
        div.append(para("File ready to upload!"))
        
        var file = ev.target.files[0]
        console.log(ev.target.files[0]);
        
        target.set("file",file)
    }
    inp.setAttribute("accept",accept)
    inp.setAttribute("name","fileuploader")
    inp.setAttribute("value","Select File")
    div.appendChild(inp)
    return div
}

function randomId(len) {
    var out = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < len; i++) {
        out += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return out;
}
