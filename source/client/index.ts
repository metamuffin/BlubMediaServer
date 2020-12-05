import { Item } from "../types"
import { geti } from "./helper";
import { uploadItemButton } from "./upload";
import { updateViewer } from "./viewer";

const ROOT_COLLECTION = "00000000-0000-0000-0000-000000000000"

export var viewerItemId: string;
export var viewerItem: Item;

var path = []



async function loadItemPathed(id: string) {
    viewerItemId = id
    path.push(id)
    window.history.pushState({id: id}, document.title)
    updateViewer()
}

window.onpopstate = function (ev: any) {
    var state = ev.state
    if (state.id != viewerItem.id) {
        viewerItem.id = state.id
        updateViewer()
    }
}


window.onload = function () {
    updateToolbar()
    loadItemPathed(ROOT_COLLECTION)
}

export function updateToolbar() {
    geti("toolbar").innerHTML = ""
    var d = geti("toolbar")

    var b_upload = document.createElement("input")
    b_upload.type = "button"
    b_upload.value = "Upload"
    b_upload.onclick = uploadItemButton
    d.appendChild(b_upload)

}