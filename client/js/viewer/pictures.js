

async function renderPicture(i,meta) {
    var div = document.createElement("div")
    div.classList.add("item-picture", "item-picture-loading")
    if (meta.inlist) div.classList.add("item-picture-list")
    if (meta.ingrid) div.classList.add("item-picture-grid")

    var title = document.createElement("p")
    title.textContent = i.a.title
    title.classList.add("item-title")

    var img = document.createElement("img")
    img.src = downloadUrlOfItem(i)
    await new Promise((r,_) => {
        img.onload = r
        img.onerror = () => {
            div = undefined
            r()
        }
    })
    if (!div) return
    div.classList.remove("item-picture-loading")
    img.name = i.a.title
    img.title = i.a.note

    div.append(title,img)
    return div
}
