import { Item, ItemType, ROOT_COLLECTION } from "../types"
import { addItem } from "./api"
import { fileSelectInput, genericInputSetter, ITEM_SPEC_GEN, para, TYPE_DISPLAY } from "./helper"
import { popOverlay, pushOverlay } from "./overlay"
import { updateViewer } from "./viewer"

const ITEM_ATTRIBUTE_INPUTS: {[key:string]: (a:any) => HTMLElement[]} = {
    collection: (target) => [
        ...genericInputSetter("title", "text", target),
        ...genericInputSetter("artist", "text", target),
        ...genericInputSetter("note", "textarea", target),
    ],
    picture: (target) => [
        ...genericInputSetter("title", "text", target),
        ...genericInputSetter("note", "textarea", target),
    ],
    video: (target) => [
        ...genericInputSetter("title", "text", target),
        ...genericInputSetter("note", "textarea", target),
    ],
    audio: (target) => [
        ...genericInputSetter("title", "text", target),
        ...genericInputSetter("artist", "text", target),
    ]
}

export function genCollectionInput(target: any,onlyCollections?: boolean) {
    var div = document.createElement("div")
    var list = document.createElement("table")
    var refresh_list = () => {
        list.innerHTML = ""
        for (const id of target) {
            var tr = document.createElement("tr")
            var name = document.createElement("td")
            var remove = document.createElement("td")
            var remove_button = document.createElement("input")
            remove_button.type = "button"
            remove_button.value = "X"
            remove_button.onclick = () => {
                target.splice(target.findIndex((e:any) => e == id))
                refresh_list()
            }
            name.textContent = id
            remove.appendChild(remove_button)
            tr.append(name,remove)
            list.appendChild(tr)
        }
    }
    var add_button = document.createElement("input")
    add_button.type = "button"
    add_button.value = onlyCollections ? "Select Collection" : "Select Item"
    add_button.onclick = () => {
        var id = prompt("UUID please!",ROOT_COLLECTION)
        target.push(id)
        refresh_list()
    }
    div.append(list,add_button)
    div.classList.add("box")
    return div
}


export function selectType(onchange: (val: any) => any) {
    var select = document.createElement("select")
    for (const type in TYPE_DISPLAY) {
        if (TYPE_DISPLAY.hasOwnProperty(type)) {
            const display = TYPE_DISPLAY[type];
            var opt = document.createElement("option")
            opt.setAttribute("value", type)
            opt.textContent = display
            select.appendChild(opt)
        }
    }
    select.onchange = (ev) => {
        //@ts-ignore
        onchange(ev?.target?.value)
    }
    return select
}

export function genericItemInputs(target: any) {

    return [para("Contained in:"),genCollectionInput(target.containedIn)]
}

export async function uploadItemButton() {
    var formdata = new FormData()
    var res_item: Item = {
        type: "collection",
        containedIn: [],
        id: "[PLACEHOLDER]",
        a: {},
        timestamp: 0
    }

    var el = document.createElement("div")
    el.classList.add("overlay-upload")
    
    var type_spec_inputs = document.createElement("div")
    type_spec_inputs.classList.add("type-spec-inputs")

    var type_spec_inputs_update = (value: ItemType) => {
        res_item.a = ITEM_SPEC_GEN[value]()
        res_item.type = value
        type_spec_inputs.innerHTML = ""
        type_spec_inputs.append(...ITEM_ATTRIBUTE_INPUTS[value](res_item.a))
        if (value != "collection") {
            type_spec_inputs.append(para("File: "), fileSelectInput("upload",formdata,"*"))
        }
    }
    var select = selectType(type_spec_inputs_update)
    select.value = res_item.type
    type_spec_inputs_update("collection")
    
    el.append(...genericItemInputs(res_item))
    el.appendChild(select)
    el.appendChild(type_spec_inputs)

    var submit = document.createElement("input"); submit.type = "button"
    var cancel = document.createElement("input"); cancel.type = "button"
    submit.classList.add("button-big")
    cancel.classList.add("button-big","button-cancel")

    submit.value = "Add Item"
    cancel.value = "Cancel"

    submit.onclick = async () => {
        await addItem(res_item,formdata)
        updateViewer()
        popOverlay()
    }
    cancel.onclick = () => {
        popOverlay()
    }

    el.append(cancel, submit)

    pushOverlay(el, (escape) => {
        if (escape) {
            console.log("UI Escaped");
        }
    }, true)
}

