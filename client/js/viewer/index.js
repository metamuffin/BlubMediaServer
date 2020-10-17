

var viewerMode = "normal_grid"

const VIEWER_MODES_COLLECTION = {
    normal_grid: {
        display: "Normal (Grid)",
        render: (i) => console.log("Errorroro")
    }
}

const VIEWER_RENDER_ITEM = {
    picture: {
        display: "Picture",
        render: (i) => console.log("No render function. :(")
    },
    audio: {
        display: "Picture",
        render: (i) => console.log("No render function. :(")
    },
    video: {
        display: "Picture",
        render: (i) => console.log("No render function. :(")
    },
    collection: {
        display: "Collection",
        render: renderCollection
    }
}

async function renderCollection(item) {

}

function createLoaderBox(promise) {
    var spinner = document.createElement("div")
    spinner.classList.add("loader-box-spinner")
    var box = document.createElement("div")
    box.classList.add("loader-box")
    box.classList.add("loader-box-loading")
    box.appendChild(spinner)
    promise.then((el) => {
        box.classList.remove("loader-box-loading")
        box.innerHTML = ""
        box.appendChild(el)
    })
    promise.catch((err) => {
        box.classList.remove("loader-box-loading")
        box.classList.innerHTML = ""
        box.classList.add("loader-box-failed")
    })
    return box
}

function renderItem(item) {
    console.log(item.type);
    if (VIEWER_RENDER_ITEM.hasOwnProperty(item.type)) {
        var ifn = VIEWER_RENDER_ITEM[item.type]
        return createLoaderBox(
            ifn.render(item)
        )
    } else {
        throw Error("Unsupported Item type :(")
    }
}

function updateViewer() {
    var viewer_el = renderItem(viewerItem)
    geti("viewer-content").innerHTML = ""
    geti("viewer-content").appendChild(viewer_el)
}

function updateViewerSel() {
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