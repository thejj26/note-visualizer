//DOM elements
const title = document.getElementById("title");

const tabs = [document.getElementById("chords"), document.getElementById("scales")];
const lists = [document.getElementById("chords-selector"), document.getElementById("scales-selector")];
const listElements = [...lists[0].children, ...lists[1].children];
const roots = [...document.getElementById("root-selector").children];

const noteStyles = [document.getElementById("default-notes"), document.getElementById("alternative-notes")];
const semitones = [document.getElementById("sharp-notes"), document.getElementById("flat-notes")]
const minFret = document.getElementById("input-min");
const maxFret = document.getElementById("input-max");

const noteFilter = document.getElementById("note-filter");

let SELECTED = {
    tab: tabs[0],
    list: lists[0],
    listElement: listElements[0],
    root: roots[0]
}

function showShapeNotes() {
    let _html = "";
    noteFilter.innerHTML = "";
    shape_notes.forEach(i => {
        _html += `
        <div class="note">
            <input type="checkbox" id="note-${i}" value="${i}" checked="true">
            <p>${roots[i].innerHTML}</p>
        </div>
        `;
        noteFilter.innerHTML = _html;
    });
}

function getNotes() {    //returns a list of notes and handles shape dependent elements
    let rootIndex = SELECTED.root.value;

    title.innerHTML = `
        ${!SETTINGS.flat ? SETTINGS.notes[rootIndex].base + (SETTINGS.notes[rootIndex].flat ? "#" : "") : (SETTINGS.notes[rootIndex].flat ? SETTINGS.notes[rootIndex].flat + "b" : SETTINGS.notes[rootIndex].base)
        } ${SELECTED.listElement.innerHTML.toUpperCase()} ${SELECTED.tab == tabs[0] ? "CHORD" : "SCALE"}
    `;

    let shape = SHAPES[SELECTED.tab == tabs[0] ? "CHORDS" : "SCALES"][SELECTED.listElement.getAttribute("value")];

    shape_notes = generateNotes(rootIndex, shape);

    showShapeNotes();
}

function setNoteStyle() {   //fills in symbols for all of the root notes
    roots.forEach((el, i) => {
        if (!SETTINGS.notes[i].flat) {
            el.innerHTML = SETTINGS.notes[i].base;
        }
        else if (!SETTINGS.flat) {
            el.innerHTML = SETTINGS.notes[i].base;
            el.innerHTML += `<span class="sharp">#</span>`;
        } else {
            el.innerHTML = SETTINGS.notes[i].flat;
            el.innerHTML += `<span class="sharp">b</span>`;
        }
    });

    [...noteFilter.children].forEach(el => {
        el.children[1].innerHTML = roots[el.children[0].getAttribute("value")].innerHTML;
    });
}

function setActiveUI() {    //refreshes the currecntly active UI element
    tabs.forEach(el => el.classList.toggle("active", el == SELECTED.tab));
    lists.forEach(el => el.classList.toggle("active", el == SELECTED.list));
    listElements.forEach(el => el.classList.toggle("active", el == SELECTED.listElement));
    roots.forEach(el => el.classList.toggle("active", el == SELECTED.root));
    noteStyles.forEach(el => el.classList.toggle("active", SETTINGS.notes[2].base == el.getAttribute("value")));
    semitones.forEach(el => el.classList.toggle("active", SETTINGS.flat == !!el.getAttribute("value")));
}

function setSelectedTab(tab) {  //sets the active tab
    SELECTED.tab = tab;
    SELECTED.list = lists[tabs.indexOf(SELECTED.tab)];

    if (SELECTED.listElement.parentElement != SELECTED.list) SELECTED.listElement = SELECTED.list.children[0];

    setActiveUI();
}

function setSelectedElement(element) {  //sets the active element
    SELECTED.listElement = element;

    setActiveUI();
}

function setSelectedRoot(note) {    //sets the active root note
    SELECTED.root = note;

    setActiveUI();
}

function setSelectedStyle(style) {
    SETTINGS.notes = style == noteStyles[0] ? NOTES_DEFAULT : NOTES_ALT;

    setActiveUI();
    setNoteStyle();
}

function setSelectedSemitone(semi) {
    SETTINGS.flat = !!semi.getAttribute("value");

    setActiveUI();
    setNoteStyle();
}

tabs.forEach(el => el.addEventListener("click", () => setSelectedTab(el)));
listElements.forEach(el => el.addEventListener("click", () => setSelectedElement(el)));
roots.forEach(el => el.addEventListener("click", () => setSelectedRoot(el)));
noteStyles.forEach(el => el.addEventListener("click", () => setSelectedStyle(el)));
semitones.forEach(el => el.addEventListener("click", () => setSelectedSemitone(el)));

setNoteStyle();
setActiveUI();
getNotes();