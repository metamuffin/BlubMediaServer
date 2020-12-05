import { Item, Picture } from "../../types";
import { editItem } from "../edit";
import { para } from "../helper";


export function buildHoverTooltip(i: Item): HTMLElement {
    var el = document.createElement("div")
    el.classList.add("hover-tooltip")

    if (i.type == "collection") {

    } else if (i.type == "picture") {
        var ic: Picture = i.a
        el.append(para(ic.title),para(ic.note,["note"]))
    } else if (i.type == "audio") {

    } else if (i.type == "video") {

    }
    var btnEdit = document.createElement("input")
    btnEdit.type = "button"
    btnEdit.value = "Edit"
    btnEdit.classList.add("btn-edit")
    btnEdit.onclick = () => editItem(i.id)
    
    el.appendChild(btnEdit)

    return el;
}