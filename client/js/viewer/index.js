



const VIEWER_RENDER_ITEM = {
    picture: {
        display: "Picture",
        render: async (i) => {throw new Error("No render function. :(")}
    },
    audio: {
        display: "Picture",
        render: async (i) => {throw new Error("No render function. :(")}
    },
    video: {
        display: "Picture",
        render: async (i) => {throw new Error("No render function. :(")}
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
    
    promise.catch((err) => {
        box.classList.remove("loader-box-loading")
        box.classList.innerHTML = ""
        box.classList.add("loader-box-failed")
    })
    promise.then((el) => {
        box.classList.remove("loader-box-loading")
        box.innerHTML = ""
        box.appendChild(el)
    })
    return box
}

function renderItem(item,level,meta) {
    console.log(item.type);
    if (VIEWER_RENDER_ITEM.hasOwnProperty(item.type)) {
        var ifn = VIEWER_RENDER_ITEM[item.type]
        var new_meta = Object.assign({},meta)
        new_meta.level += 1;
        return createLoaderBox(
            ifn.render(item,new_meta)
        )
    } else {
        throw Error("Unsupported Item type :(")
    }
}

function updateViewer() {
    var viewer_el_loader = createLoaderBox((async () => {
        viewerItem = await getItemById(viewerItemId)
        var viewer_el = renderItem(viewerItem,{top:true,level:0})
        return viewer_el
    })())

    geti("viewer-content").innerHTML = ""
    geti("viewer-content").appendChild(viewer_el_loader)
}
