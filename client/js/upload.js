
const ITEM_ATTRIBUTE_INPUTS = {
    collection: (target) => [
        ...genericInputSetter("title", "text", target),
        ...genericInputSetter("artist", "text", target),
        ...genericInputSetter("note", "textarea", target),
    ],
    picture: (target) => [
        ...genericInputSetter("title", "text", target),
        ...genericInputSetter("note", "textarea", target),
    ],
    video: (target) => [
        ...genericInputSetter("title", "text", target),
        ...genericInputSetter("note", "textarea", target),
    ],
    audio: (target) => [
        ...genericInputSetter("title", "text", target),
        ...genericInputSetter("artist", "text", target),
    ]
}

function selectType(onchange) {
    var select = document.createElement("select")
    for (const type in TYPE_DISPLAY) {
        if (TYPE_DISPLAY.hasOwnProperty(type)) {
            const display = TYPE_DISPLAY[type];
            var opt = document.createElement("option")
            opt.setAttribute("value", type)
            opt.textContent = display
            select.appendChild(opt)
        }
    }
    select.onchange = (ev) => {
        onchange(ev.target.value)
    }
    return select
}



async function uploadItemButton() {
    var el = document.createElement("div")
    el.classList.add("overlay-upload")

    var type_spec_target = {}
    var type_spec_inputs = document.createElement("div")
    type_spec_inputs.classList.add("type-spec-inputs")

    var select = selectType((value) => {
        type_spec_inputs.innerHTML = ""
        type_spec_inputs.append(...ITEM_ATTRIBUTE_INPUTS[value](type_spec_target))
    })

    el.appendChild(select)
    el.appendChild(type_spec_inputs)

    var submit = document.createElement("input"); submit.type = "button"
    var cancel = document.createElement("input"); cancel.type = "button"
    submit.classList.add("button-big")
    cancel.classList.add("button-big","button-cancel")

    submit.value = "Add Item"
    cancel.value = "Cancel"

    submit.onclick = () => {

    }
    cancel.onclick = () => {
        popOverlay()
    }

    el.append(cancel, submit)

    pushOverlay(el, (escape) => {
        if (escape) {
            console.log("UI Escaped");
        }
    }, true)
}

