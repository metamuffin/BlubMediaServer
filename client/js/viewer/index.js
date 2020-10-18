



const VIEWER_RENDER_ITEM = {
    picture: {
        display: "Picture",
        render: renderPicture
    },
    audio: {
        display: "Picture",
        render: async (i) => { throw new Error("No render function. :(") }
    },
    video: {
        display: "Picture",
        render: async (i) => { throw new Error("No render function. :(") }
    },
    collection: {
        display: "Collection",
        render: renderCollection
    }
}


function createLoaderBox(promise) {
    var box = document.createElement("div")
    box.classList.add("loader-box")
    box.classList.add("loader-box-loading")
    var spinner = genSpinner()
    box.appendChild(spinner)

    var err_handler = (err) => {
        box.innerHTML = ""
        box.classList.remove("loader-box-loading")
        box.classList.add("loader-box-failed")
    }

    promise.catch(err_handler)
    promise.then((el) => {
        if (!el) return err_handler()
        box.classList.remove("loader-box-loading")
        box.innerHTML = ""
        box.appendChild(el)
    })
    return box
}

function renderItem(id, meta) {
    var render_fn = async () => {
        var item = await getItemById(id)
        if (VIEWER_RENDER_ITEM.hasOwnProperty(item.type)) {
            var ifn = VIEWER_RENDER_ITEM[item.type]
            var new_meta = Object.assign({}, meta)
            new_meta.level += 1;
            return await ifn.render(item, new_meta).catch(e => { throw Error(e) })
        } else {
            throw Error("Unsupported Item type :( " + item.type)
        }
    }
    return createLoaderBox(
        render_fn()
    )
}

function updateViewer() {
    var viewer_el = renderItem(viewerItemId, { top: true, level: 0 })

    geti("viewer-content").innerHTML = ""
    geti("viewer-content").appendChild(viewer_el)
}
