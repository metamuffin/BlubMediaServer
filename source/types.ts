
export type ItemType = "audio"|"picture"|"video"|"collection"

export interface Item {
    type: ItemType,
    id: string,
    a: any
    containedIn: Array<string>,
    file?: string
}


export interface Audio {
    title: string,
    artist: string,
}

export interface Picture {
    title: string,
    note: string,
    meta: any,
}

export interface Video {
    title: string,
    note: string,
    meta: any
}

export interface Collection {
    title: string,
    artist: string,
    note: string,
    content: Array<string>,
}

export const ROOT_COLLECTION = "00000000-0000-0000-0000-000000000000";
