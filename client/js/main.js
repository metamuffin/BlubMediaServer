


window.addEventListener("load",function () {
    updateIndex(updateLists)
});


function updateLists() {
    var table = document.getElementById("main-track-list");
    for(const track of tracks) {
        var tr = trackListItem(track);
        table.appendChild(tr);
    }
}

function safeText(s) {
    return s.replace("<","&lt;").replace(">","&gt;")
}

function getProposedDownloadName(track){
    return `${safeText(track.title)} - ${safeText(track.artist)}.${safeText(track.ext)}`
}

function trackListItem(track) {
    var tr = document.createElement("tr")
    tr.innerHTML = `<td>
                <p>${safeText(track.title)}</p>
            </td>
            <td>
                <p class="artist">${safeText(track.artist)}</p>
            </td>
            <td>
                <input type="button" value="Play" onclick="javascript:playTrack('${track.id}')" />
                <a href="/media/track/${track.id}" download="${getProposedDownloadName(track)}">Download</a>
            </td>
            
            `
    return tr
}

function playTrack(id) {
    console.log(id);
    var audioplayer = document.getElementById("audioplayer")
    audioplayer.src = `/media/track/${id}`
    audioplayer.play()
}