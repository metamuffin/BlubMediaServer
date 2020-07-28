
var playbackQueue = []
var currentTrack;
var playing = false;

var selectedAlbum;

window.addEventListener("load",function () {
    updateIndex(() => {
        updateTrackList()
        updateAlbumList()
        updateCurrentTrack()
        updatePlaybackQueue()
        updateFormAlbumDropdown()
    })
    var player = document.getElementById("audioplayer")
    player.volume = parseFloat(getCookie("volume")) || 1.0
    player.onvolumechange = () => {
        setCookie("volume",player.volume,10)
    }
});

function updateAlbumList() {
    var table = document.getElementById("album-list");
    table.innerHTML = ""
    for(const album of albums) {
        var isSelected = selectedAlbum && selectedAlbum.id == album.id
        var tr = albumListItem(album,isSelected);
        table.appendChild(tr);
    }
}

function updateTrackList() {
    var h = document.getElementById("track-list-headline")
    h.textContent = (selectedAlbum) ? `Tracks of ${safeText(selectedAlbum.title)}` : "All Tracks"
    var table = document.getElementById("track-list");
    
    table.innerHTML = ""
    var selTracks = (!selectedAlbum) ? tracks : tracksOfAlbum(selectedAlbum)
    for(const track of selTracks) {
        var tr = trackListItem(track);
        table.appendChild(tr);
    }
}

function updatePlaybackQueue() {
    var h = document.getElementById("playback-queue-headline")
    var skipbtn = document.getElementById("audioplayer-skip")
    var table = document.getElementById("playback-queue")
    
    h.textContent = (playbackQueue.length == 0) ? "No Tracks in enqueued" : "Playback queue:"
    table.innerHTML = ""
    for (const track of playbackQueue) {
        table.appendChild(trackListItem(track,true))
    }
    if (!playing) {
        skipbtn.setAttribute("disabled", "true")
    } else {
        skipbtn.removeAttribute("disabled")
    }
}

function updateCurrentTrack() {
    var div = document.getElementById("current-track")
    if (!currentTrack) return div.innerHTML = `<p>No Track playing right now</p>`
    div.innerHTML = `
        <p><bold>${safeText(currentTrack.title)}</bold> by ${safeText(currentTrack.artist)}</p>
    `
}


function trackListItem(track,queueMode) {
    var tr = document.createElement("tr")
    tr.classList.add("track-item")
    if (playbackQueue.find(t => t.id == track.id)){
        tr.classList.add("track-enqueued")
    }
    tr.innerHTML = `
        <td>
            <p>${safeText(track.title)}</p>
        </td>
        <td>
            <p class="artist">${safeText(track.artist)}</p>
        </td>
        <td>
            <input type="button" value="Add to queue" onclick="javascript:schedulePlayback('${track.id}')" />
            <a href="/media/track/${track.id}" download="${getProposedDownloadName(track)}">Download</a>
            ${queueMode ? `<input type="button" value="Remove from queue" onclick="javascript:removeTrackFromQueue('${track.id}')" />` : ""}
        </td>`
    return tr
}


function albumListItem(album,selected) {
    var tr = document.createElement("tr")
    tr.classList.add("album-item")
    if (selected) tr.classList.add("album-item-selected")
    tr.innerHTML = `
        <td>
            <p>${safeText(album.title)}</p>
        </td>
        <td>
            <p class="artist">${safeText(album.artist)}</p>
        </td>
        <td>
            <input type="button" value="Add to queue" onclick="javascript:scheduleAlbumPlayback('${album.id}')" />
            <a href="/media/album/${album.id}" download="${getProposedAlbumDownloadName(album)}">Download</a>
            ${(!selected) ? `<input type="button" value="View tracks" onclick="javascript:selectAlbum('${album.id}')" />`
                          : `<input type="button" value="Clear selection" onclick="javascript:selectAlbum()" />`}
        </td>`
    return tr
}


function schedulePlayback(id){
    console.log(`Scheduled playback of ${id}`);
    playbackQueue.push(trackById(id))
    setTimeout(updatePlaybackQueue)
    setTimeout(updateTrackList)
    if (!playing) playNextTrack()
}


function scheduleAlbumPlayback(id){
    console.log(`Scheduled album playback of ${id}`);
    var album = albumById(id)
    for (const track of album.tracks) {
        schedulePlayback(track)
    }
}

function playNextTrack() {
    var audioplayer = document.getElementById("audioplayer")
    currentTrack = playbackQueue.pop()
    setTimeout(updateCurrentTrack,0)
    setTimeout(updatePlaybackQueue,0)
    playing = false;
    if (!currentTrack) return audioplayer.src = ""
    playing = true;
    audioplayer.src = `/media/track/${currentTrack.id}`
    audioplayer.play()
    audioplayer.onended = playNextTrack
}

function removeTrackFromQueue(id){
    playbackQueue = playbackQueue.filter(t => t.id != id)
    updatePlaybackQueue()
}

function updateFormAlbumDropdown() {
    var sel = document.getElementById("album-select")
    sel.innerHTML = ""
    for (const album of albums) {
        var op = document.createElement("option")
        op.setAttribute("value", album.id)
        op.textContent = `${album.title} - ${album.artist}`
        sel.appendChild(op)
    }
    var op = document.createElement("option")
    op.setAttribute("value", "")
    op.textContent = "None"
    op.setAttribute("selected","")
    sel.appendChild(op)
}

function selectAlbum(id) {
    selectedAlbum = albumById(id)
    setTimeout(updateTrackList)
    setTimeout(updateAlbumList)
}
