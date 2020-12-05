import { geti } from "./helper"


var overlay_onpop_stack: ((a:any) => any)[] = []

export function pushOverlay(el: HTMLElement,onpop: (a:any) => any,escapable?: boolean) {
    var div = document.createElement("div")
    div.classList.add("overlay")
    div.appendChild(el)
    
    var cont = geti("overlay-container")
    if (escapable) cont.onclick = () => popOverlay(true)
    if (escapable) div.onclick = (ev) => ev.stopPropagation()
    cont.appendChild(div)
    overlay_onpop_stack.push(onpop)
    cont.classList.add("overlay-container-active")
}

export function popOverlay(escape?: any) {
    var cont = geti("overlay-container")
    var top = cont.children[cont.children.length - 1]
    console.log(top);
    
    cont.removeChild(top)
    var p = overlay_onpop_stack.pop()
    if (p) p(escape)
    if (cont.children.length == 0) {
        cont.classList.remove("overlay-container-active")
    }   
}