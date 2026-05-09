//DOM elements
const tabs = [document.getElementById("chords"), document.getElementById("scales")];
const lists = [document.getElementById("chords-selector"), document.getElementById("scales-selector")];
const listElements = [...lists[0].children, ...lists[1].children];
const roots = [...document.getElementById("root-selector").children];
const title = document.getElementById("title");

let SELECTED = {
    tab: tabs[0],
    list: lists[0],
    listElement: listElements[0],
    root: roots[0]
}

function getNotes() {    //returns a list of notes and sets the title
    let rootIndex = SELECTED.root.value;
    title.innerHTML = `
        ${!flat ? notes[rootIndex].base + (notes[rootIndex].flat ? "#" : "") : (notes[rootIndex].flat ? notes[rootIndex].flat + "b" : notes[rootIndex].base)
        } ${SELECTED.listElement.innerHTML.toUpperCase()} ${SELECTED.tab == tabs[0] ? "CHORD" : "SCALE"}
    `;
    let shape = SHAPES[SELECTED.tab == tabs[0] ? "CHORDS" : "SCALES"][SELECTED.listElement.getAttribute("value")];
    return generateNotes(rootIndex, shape);
}

function setRootNotes() {   //fills in symbols for all of the root notes
    roots.forEach((el, i) => {
        if (!notes[i].flat) {
            el.innerHTML = notes[i].base;
        }
        else if (!flat) {
            el.innerHTML = notes[i].base;
            el.innerHTML += `<span class="sharp">#</span>`;
        } else {
            el.innerHTML = notes[i].flat;
            el.innerHTML += `<span class="sharp">b</span>`;
        }
    })
}

function setActiveUI() {    //refreshes the currecntly active UI element
    tabs.forEach(el => el.classList.toggle("active", el == SELECTED.tab));
    lists.forEach(el => el.classList.toggle("active", el == SELECTED.list));
    listElements.forEach(el => el.classList.toggle("active", el == SELECTED.listElement));
    roots.forEach(el => el.classList.toggle("active", el == SELECTED.root));

    fretboard_filtered = filterFretboard(getNotes()); //TODO
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

tabs.forEach(el => el.addEventListener("click", () => setSelectedTab(el)));
listElements.forEach(el => el.addEventListener("click", () => setSelectedElement(el)));
roots.forEach(el => el.addEventListener("click", () => setSelectedRoot(el)));

setRootNotes();
setActiveUI();