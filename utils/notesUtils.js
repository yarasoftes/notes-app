function reindexNotes(notes) {
    return notes.map((note, index) => ({
        ...note,
        id: index + 1
    }));
}

function getStats(notes) {
    return {
        total: notes.length,
        lastCreated: notes.length ? notes[notes.length - 1].created : "нет"
    };
}

module.exports = {
    reindexNotes,
    getStats
};