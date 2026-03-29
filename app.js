const fs = require('fs');
const readline = require('readline');

const FILE = 'notes.json';

// загрузка заметок
function loadNotes() {
    try {
        const data = fs.readFileSync(FILE);
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// сохранение
function saveNotes(notes) {
    fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

let notes = loadNotes();

function greet() {
    console.log("Добро пожаловать в приложение заметок!");
}

function addNote(text) {
    notes.push(text);
    saveNotes(notes);
    console.log("Добавлено:", text);
}

function showAllNotes() {
    console.log("Все заметки:");
    notes.forEach((note, i) => console.log(`${i + 1}. ${note}`));
}

function showNote(index) {
    console.log(notes[index] || "Заметка не найдена");
}

function deleteNote(index) {
    if (notes[index]) {
        console.log("Удалено:", notes[index]);
        notes.splice(index, 1);
        saveNotes(notes);
    }
}

function menu() {
    console.log(`
1. Добавить
2. Все заметки
3. Одна заметка
4. Удалить
5. Выход
`);
}

function runApp() {
    greet();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function ask() {
        menu();

        rl.question("Выбор: ", (a) => {
            if (a === '1') {
                rl.question("Текст: ", t => {
                    addNote(t);
                    ask();
                });
            } else if (a === '2') {
                showAllNotes();
                ask();
            } else if (a === '3') {
                rl.question("Номер: ", n => {
                    showNote(n - 1);
                    ask();
                });
            } else if (a === '4') {
                rl.question("Номер: ", n => {
                    deleteNote(n - 1);
                    ask();
                });
            } else {
                rl.close();
            }
        });
    }

    ask();
}

runApp();