
var tracks = {}
var albums = {}

function updateIndex(cb) {(async () => {
    var response = await fetch("/api/index")
    var j = await response.json()
    tracks = j.tracks; albums = j.albums
})().then(cb)}
