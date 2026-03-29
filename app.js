const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');

const { reindexNotes, getStats } = require('./utils/notesUtils');

const FILE = 'notes.json';

// загрузка
function loadNotes() {
    try {
        return JSON.parse(fs.readFileSync(FILE));
    } catch {
        return [];
    }
}

// сохранение
function saveNotes(notes) {
    fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

let notes = loadNotes();

// очистка экрана
function clear() {
    console.clear();
}

// время
function getTime() {
    return new Date().toLocaleString();
}

// приветствие
function greet() {
    clear();
    console.log(chalk.green.bold("🚀 NOTES APP"));
    console.log(chalk.gray("Умное консольное приложение\n"));
}

// добавление
function addNote(text) {
    const note = {
        text,
        created: getTime()
    };

    notes.push(note);
    notes = reindexNotes(notes);
    saveNotes(notes);

    console.log(chalk.blue("✔ Добавлено:"), text);
}

// все заметки
function showAllNotes() {
    console.log(chalk.yellow("\n📋 Все заметки:\n"));

    if (notes.length === 0) {
        console.log(chalk.red("Нет заметок"));
        return;
    }

    notes.forEach((note) => {
        console.log(chalk.cyan(`${note.id}. ${note.text}`));
        console.log(chalk.gray(`   ${note.created}\n`));
    });
}

// одна заметка
function showNote(index) {
    const note = notes[index];

    if (!note) {
        console.log(chalk.red("Заметка не найдена"));
        return;
    }

    console.log(chalk.magenta(`\n${note.text}`));
    console.log(chalk.gray(note.created));
}

// удаление
function deleteNote(index) {
    if (!notes[index]) {
        console.log(chalk.red("Заметка не найдена"));
        return;
    }

    console.log(chalk.red("Удалено:"), notes[index].text);
    notes.splice(index, 1);
    notes = reindexNotes(notes);
    saveNotes(notes);
}

// поиск
function searchNotes(query) {
    console.log(chalk.yellow("\n🔍 Результаты:\n"));

    const results = notes.filter(n =>
        n.text.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
        console.log(chalk.red("Ничего не найдено"));
        return;
    }

    results.forEach((note) => {
        console.log(chalk.green(`${note.id}. ${note.text}`));
    });
}

// статистика
function showStats() {
    const stats = getStats(notes);

    console.log(chalk.yellow("\n📊 Статистика:\n"));
    console.log("Всего заметок:", stats.total);
    console.log("Последняя создана:", stats.lastCreated);
}

// меню
function menu() {
    console.log(chalk.white(`
1. ➕ Добавить
2. 📋 Все заметки
3. 🔎 Одна заметка
4. ❌ Удалить
5. 🔍 Поиск
6. 🧹 Очистить экран
7. 📊 Статистика
8. 🚪 Выход
`));
}

// запуск
function runApp() {
    greet();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function ask() {
        menu();

        rl.question(chalk.gray("👉 Выбор: "), (a) => {

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

            } else if (a === '6') {
                clear();
                ask();

            } else if (a === '7') {
                showStats();
                ask();

            } else {
                console.log(chalk.green("Пока 👋"));
                rl.close();
            }
        });
    }

    ask();
}

runApp();