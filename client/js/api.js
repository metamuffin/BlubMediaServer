const API_ENDPOINT = "/api"


async function getItemById(id) {
    var res = await fetch(API_ENDPOINT + `/item/${id}`, {
        method: "GET",
    })
    var rjson = await res.json()
    return rjson
}