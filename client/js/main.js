


window.addEventListener("load",function () {
    updateIndex(updateLists)
});


function updateLists() {
    var ul = document.getElementById("main-track-list");
    for(const track of tracks) {
        var li = trackListItem(track);
        ul.appendChild(li);
    }
}

function safeText(s) {
    return s.replace("<","&lt;").replace(">","&gt;")
}

function trackListItem(track) {
    var li = document.createElement("li")
    li.innerHTML = `
        <tr>
            <td>
                <p>${safeText(track.title)}</p>
            </td>
            <td>
                <p class="artist>${safeText(track.artist)}</p>
            </td>
            <td>
                <input type="button" value="Play" onclick="javascript:playTrack('${track.id}')" />
            </td>
        </tr>`
    return li
}

function playTrack(id) {
    console.log(id);
    var audioplayer = document.getElementById("audioplayer")
    audioplayer.src = `/media/track/${id}`
    audioplayer.play()
}