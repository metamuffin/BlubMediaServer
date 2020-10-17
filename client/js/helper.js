

function sleep(ms) {
    return new Promise((r,_) => {
        setTimeout(r,ms)
    })
}

function geti(id) {
    return document.getElementById(id)
}
