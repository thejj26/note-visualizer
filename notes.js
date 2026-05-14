/*
DEFAULT:
A, A#/Bb, B, ...

ALTERNATIVE:
A, B, h, ...

sharp notes are default and use a base as representation, the property "flat" refers to the base when treated as a flat
*/

class Note {

    constructor(base, flat = null) {
        this.base = base;
        this.flat = flat;
    }

}

function setFretRange(min, max) { }                                             //adjusts the fret range
function setTuning() { }                                                        //TODO
function fillFretboard() { }                                                    //fills the freatboard with indexes of the appropriate notes
function filterFretboard(notes, ignored_notes = [], ignored_strings = []) { }   //keeps the indexes of desired notes, all others are set to -1     
function generateNotes(root, shape) { }                                         //generates an array of note indexes used in the shape depending on the root note

const NOTES_DEFAULT = [
    new Note('A'),
    new Note('A', 'B'),
    new Note('B'),
    new Note('C'),
    new Note('C', 'D'),
    new Note('D'),
    new Note('D', 'E'),
    new Note('E'),
    new Note('F'),
    new Note('F', 'G'),
    new Note('G'),
    new Note('G', 'A')
];

const NOTES_ALT = [
    new Note('A'),
    new Note('B'),
    new Note('H'),
    new Note('C'),
    new Note('C', 'D'),
    new Note('D'),
    new Note('D', 'E'),
    new Note('E'),
    new Note('F'),
    new Note('F', 'G'),
    new Note('G'),
    new Note('G', 'A')
];

const SHAPES = {
    CHORDS: {
        "major": [0, 4, 7],
        "major7": [0, 4, 7, 11],
        "dominant7": [0, 4, 7, 10],
        "minor": [0, 3, 7],
        "minor7": [0, 3, 7, 10]
    },
    SCALES: {
        "major": [0, 2, 4, 5, 7, 9, 11],
        "minor": [0, 2, 3, 5, 7, 8, 10],
        "harmonic": [0, 2, 3, 5, 7, 8, 11],
        "major_pentatonic": [0, 2, 4, 7, 9],
        "minor_pentatonic": [0, 3, 5, 7, 10]
    }
};

//user settings
let SETTINGS = {
    notes: NOTES_DEFAULT,  //default or alternative note display
    flat: false,           //true=notes display as sharp, false=notes display as flat
    max_fret: 12,          //last fret
    min_fret: 0,           //first fret
    tuning: [7, 0, 5, 10]  //EADG is the standard tuning
}


let fretboard = fillFretboard();                //2D matrix - x=fret, y=string
let fretboard_filtered = filterFretboard([]);   //fretboard with only desired notes

function setMaxFret(min, max) {
    if (min < 0 || max > 21 || min > 12 || max < 4 || max - min < 4) {/*warn user*/ }
    else {
        min_fret = min;
        max_fret = max;
    }
}

function generateNotes(root, shape) {
    return shape.map(step => (root + step) % 12);
}

function fillFretboard() {
    let result = [];

    for (let i = 0; i < SETTINGS.tuning.length; i++) {   //adds an array for each string
        result.push([]);
        for (let j = SETTINGS.min_fret; j <= SETTINGS.max_fret; j++) result[i].push((j + SETTINGS.tuning[i]) % 12);   //fills the string array with an index for each fret
    }

    return result;
}

function filterFretboard(notes, ignored_notes = [], ignored_strings = []) {

    return fretboard.map((string, i) => {
        if (ignored_strings.includes(i)) return string.map(note => -1); //fills all notes in the string with -1 if the string is ignored
        else return string.map(note => notes.includes(note) && !ignored_notes.includes(note) ? note : -1);  //ignored and unused notes get set to -1
    });
}
