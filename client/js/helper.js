
var tracks = []
var albums = []

function updateIndex(cb) {(async () => {
    var response = await fetch("/api/index")
    var j = await response.json()
    tracks = j.tracks; albums = j.albums
})().then(cb)}

function trackById(id) {
    return tracks.find((v) => v.id == id)
}
function albumById(id) {
    return albums.find((v) => v.id == id)
}



function safeText(s) {
    return s.replace("<","&lt;").replace(">","&gt;")
}

function getProposedDownloadName(track){
    return `${safeText(track.title)} - ${safeText(track.artist)}.${safeText(track.ext)}`
}


function getProposedAlbumDownloadName(track){
    return `${safeText(track.title)} - ${safeText(track.artist)}.tar.gz`
}

function tracksOfAlbum(al) {
    var a = []
    if (!al) return a
    for (const id of al.tracks) {
        a.push(trackById(id))
    }
    return a
}

// https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=None;Secure;";
}

// https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}