
const ROOT_COLLECTION = "00000000-0000-0000-0000-000000000000"

var viewerItemId = undefined
var viewerItem = undefined

var path = []



async function loadItemPathed(id) {
    viewerItemId = id
    path.push(id)
    window.history.pushState({id: id}, document.title)
    updateViewer()
}

window.onpopstate = function (ev) {
    var state = ev.state
    if (state.id != viewerItem.id) {
        viewerItem.id = state.id
        updateViewer()
    }
}


window.onload = function () {
    loadItemPathed(ROOT_COLLECTION)
}