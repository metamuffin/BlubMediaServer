import { Item } from "../types"
import { getItemById } from "./api";
import { geti } from "./helper";
import { uploadItemButton } from "./upload";
import { updateViewer } from "./viewer";

const ROOT_COLLECTION = "00000000-0000-0000-0000-000000000000"

export var viewerItemId: string;
export var viewerItem: Item;

var path = []

export async function updateViewerItem() {
    viewerItem = await getItemById(viewerItemId)
}

export async function loadItemPathed(id: string) {
    viewerItemId = id
    path.push(id)
    //window.location.hash = id
    console.log("pushstate: " + id)
    window.history.pushState({id}, document.title)
    updateViewer()
}

window.onpopstate = function (ev: any) {
    var state = ev.state
    if (!ev.state) return console.log("onpopstate without state")
    console.log(ev.state);
    if (state.id != viewerItem.id) {
        viewerItemId = state.id
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
