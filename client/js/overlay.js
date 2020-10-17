

var overlay_onpop_stack = []

function pushOverlay(el,onpop,escapable) {
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

function popOverlay(escape) {
    var cont = geti("overlay-container")
    var top = cont.children[cont.children.length - 1]
    console.log(top);
    
    cont.removeChild(top)
    overlay_onpop_stack.pop()(escape)
    if (cont.children.length == 0) {
        cont.classList.remove("overlay-container-active")
    }   
}