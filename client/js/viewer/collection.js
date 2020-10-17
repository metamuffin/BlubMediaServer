

async function renderCollection(item, meta) {
    if (meta.level <= 1) {
        var div = document.createElement("div")
        div.classList.add("viewer-content-collection")
        var title_p = document.createElement("h3")
        title_p.textContent = item.a.title
        div.appendChild(title_p)
        var inner = await VIEWER_MODES_COLLECTION[viewerCollectionMode].render(item,meta)
        div.appendChild(inner)
        return div
    } else {
        var div = document.createElement("div")
        div.classList.add("viewer-content-collection", "viewer-content-collection-hide-content")
        var title_p = document.createElement("h4")
        title_p.textContent = item.a.title
        div.appendChild(title_p)
        return div
    }
}


function updateViewerCollectionMode() {
    var viewer_sel = geti("viewer-sel")
    viewer_sel.innerHTML = ""
    if (viewerItem.type != "collection") return
    for (const iname in VIEWER_MODES_COLLECTION) {
        if (VIEWER_MODES_COLLECTION.hasOwnProperty(iname)) {
            const mode = VIEWER_MODES_COLLECTION[iname];
            var mode_el = document.createElement("input")
            mode_el.type = "button"
            mode_el.value = mode.display
            mode_el.onclick = () => {
                viewerMode = iname
                updateViewer()
            }
            mode_el.classList.add("viewer-mode-button")
            viewer_sel.appendChild(mode_el)
        }
    }
}

var viewerCollectionMode = "normal_list"

const VIEWER_MODES_COLLECTION = {
    normal_list: {
        display: "Normal (List)",
        render: async (i,level,meta) => {
            var list = document.createElement("ul")
            list.classList.add("viewer-content-normal-list")
            for (const item of i.a.content) {
                var li = document.createElement("li")
                console.log(item);
                var item_el = renderItem(item,meta)
                li.appendChild(item_el)
                list.appendChild(li)
            }
            return list
        }
    },
    normal_grid: {
        display: "Normal (Grid)",
        render: async (item,meta) => {
            throw new Error("Unimplemtnetssasf uhatv zhkt")
        }
    }
}