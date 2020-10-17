
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


function sleep(ms) {
    return new Promise((r, _) => {
        setTimeout(r, ms)
    })
}

function geti(id) {
    return document.getElementById(id)
}


function genIcon(name) {
    throw Error("TODO")
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

function fileSelectInput(key, formdata) {
    var inp = document.createElement("input")
    inp.type = "file"
    inp.onchange = (ev) => {
        var file = ev.target.files[0]
        formdata.set(key, file)
    }
    return inp
}

function randomId(len) {
    var out = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < len; i++) {
        out += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return out;
}