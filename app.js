const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');

const FILE = 'notes.json';

function loadNotes() {
    try {
        return JSON.parse(fs.readFileSync(FILE));
    } catch {
        return [];
    }
}

function saveNotes(notes) {
    fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

let notes = loadNotes();

function greet() {
    console.log(chalk.green("Добро пожаловать в Notes App 🚀"));
}

function addNote(text) {
    notes.push(text);
    saveNotes(notes);
    console.log(chalk.blue("Добавлено:"), text);
}

function showAllNotes() {
    console.log(chalk.yellow("\nВсе заметки:"));
    notes.forEach((note, i) => {
        console.log(chalk.cyan(`${i + 1}. ${note}`));
    });
}

function showNote(index) {
    console.log(chalk.magenta(notes[index] || "Заметка не найдена"));
}

function deleteNote(index) {
    if (notes[index]) {
        console.log(chalk.red("Удалено:"), notes[index]);
        notes.splice(index, 1);
        saveNotes(notes);
    }
}

function searchNotes(query) {
    console.log(chalk.yellow("\nРезультаты поиска:"));
    notes.forEach((note, i) => {
        if (note.toLowerCase().includes(query.toLowerCase())) {
            console.log(chalk.green(`${i + 1}. ${note}`));
        }
    });
}

function menu() {
    console.log(chalk.white(`
1. Добавить
2. Все заметки
3. Одна заметка
4. Удалить
5. Поиск
6. Выход
`));
}

function runApp() {
    greet();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function ask() {
        menu();

        rl.question(chalk.gray("Выбор: "), (a) => {
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
            } else if (a === '5') {
                rl.question("Поиск: ", q => {
                    searchNotes(q);
                    ask();
                });
            } else {
                console.log(chalk.green("Выход..."));
                rl.close();
            }
        });
    }

    ask();
}

runApp();