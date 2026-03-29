const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');

const { reindexNotes, getStats } = require('./utils/notesUtils');

const FILE = 'notes.json';

const commands = ['add', 'list', 'view', 'delete', 'search', 'stats', 'clear', 'help', 'exit'];

function completer(line) {
    const hits = commands.filter(c => c.startsWith(line));
    return [hits.length ? hits : commands, line];
}

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

function clear() {
    console.clear();
}

function getTime() {
    return new Date().toLocaleString();
}

function greet() {
    clear();
    console.log(chalk.green.bold("🚀 NOTES APP PRO MAX"));
    console.log(chalk.gray("Нажми TAB для автодополнения"));
    console.log(chalk.gray("help — список команд\n"));
}

function showHelp() {
    console.log(chalk.yellow(`
📖 Команды:
add <текст>
list
view <номер>
delete <номер>
search <текст>
stats
clear
exit
`));
}

function addNote(text) {
    const note = { text, created: getTime() };
    notes.push(note);
    notes = reindexNotes(notes);
    saveNotes(notes);
    console.log(chalk.blue("✔ Добавлено"));
}

function showAllNotes() {
    console.log(chalk.yellow("\n📋 Все заметки:\n"));
    if (!notes.length) return console.log(chalk.red("Пусто"));

    notes.forEach(note => {
        console.log(chalk.cyan(`${note.id}. ${note.text}`));
        console.log(chalk.gray(`   ${note.created}\n`));
    });
}

function showNote(index) {
    const note = notes[index];
    if (!note) return console.log(chalk.red("Нет"));
    console.log(chalk.magenta(note.text));
}

function deleteNote(index, rl, callback) {
    const note = notes[index];
    if (!note) return callback();

    rl.question(chalk.red(`Удалить "${note.text}"? (y/n): `), a => {
        if (a === 'y') {
            notes.splice(index, 1);
            notes = reindexNotes(notes);
            saveNotes(notes);
            console.log(chalk.red("Удалено"));
        }
        callback();
    });
}

function searchNotes(query) {
    console.log(chalk.yellow("\n🔍 Поиск:\n"));

    notes.forEach(note => {
        if (note.text.toLowerCase().includes(query.toLowerCase())) {
            const highlighted = note.text.replace(
                new RegExp(query, 'gi'),
                m => chalk.bgYellow.black(m)
            );
            console.log(chalk.green(`${note.id}. ${highlighted}`));
        }
    });
}

function showStats() {
    const stats = getStats(notes);
    console.log(chalk.blue("\n📊 Статистика:"));
    console.log("Всего:", stats.total);
}

function runApp() {
    greet();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer
    });

    function ask() {
        rl.question(chalk.gray("\n👉 Команда: "), input => {

            const [cmd, ...args] = input.split(" ");

            if (cmd === 'add') {
                addNote(args.join(" "));
                ask();

            } else if (cmd === 'list') {
                showAllNotes();
                ask();

            } else if (cmd === 'view') {
                showNote(Number(args[0]) - 1);
                ask();

            } else if (cmd === 'delete') {
                deleteNote(Number(args[0]) - 1, rl, ask);

            } else if (cmd === 'search') {
                searchNotes(args.join(" "));
                ask();

            } else if (cmd === 'stats') {
                showStats();
                ask();

            } else if (cmd === 'clear') {
                clear();
                ask();

            } else if (cmd === 'help') {
                showHelp();
                ask();

            } else if (cmd === 'exit') {
                console.log(chalk.green("Пока 👋"));
                rl.close();

            } else {
                console.log(chalk.red("Неизвестная команда"));
                ask();
            }
        });
    }

    ask();
}

runApp();