

const API_ENDPOINT = "/api"


async function getItemById(id) {
    var res = await fetch(API_ENDPOINT + `/item/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    var rjson = await res.json()
    return rjson
}


async function addItem(item,formdata) {
    var res = await fetch(API_ENDPOINT + `/add-item?json=${encodeURI(JSON.stringify(item))}`, {
        method: "POST",
        body: formdata,
        //headers: {
        //    'Content-Type': 'multipart/form-data'
        //},
    })
    return res.status
}

function downloadUrlOfItem(item) {
    return API_ENDPOINT + `/item-dl/${item.id}`
}