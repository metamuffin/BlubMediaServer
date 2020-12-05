import { Item } from "../types"


const API_ENDPOINT = "/api"


export async function getItemById(id: string) {
    var res = await fetch(API_ENDPOINT + `/item/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    var rjson = await res.json()
    return rjson
}


export async function addItem(item: Item,formdata: any) {
    var res = await fetch(API_ENDPOINT + `/add-item?json=${encodeURI(JSON.stringify(item))}`, {
        method: "POST",
        body: formdata,
        //headers: {
        //    'Content-Type': 'multipart/form-data'
        //},
    })
    return res.status
}

export function downloadUrlOfItem(item: Item) {
    return API_ENDPOINT + `/item-dl/${item.id}`
}