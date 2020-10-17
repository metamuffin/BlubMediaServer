
const ROOT_COLLECTION = "00000000-0000-0000-0000-000000000000"

var viewerItem = undefined

var path = []



async function loadItemPathed(id) {
    var item = await getItemById(id)
    if (!item) return alert("This Item doesn't exist!")
    path.push(item)
    viewerItem = item
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