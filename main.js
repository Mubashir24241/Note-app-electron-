// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const NOTES_FILE = path.join(app.getPath('userData'), 'notes.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadFile('index.html');
}

// Handle saving notes
ipcMain.on('save-note', (event, note) => {
  let notes = loadNotes();
  notes.push(note);
  saveNotes(notes);
  event.reply('note-saved', notes);
});

// Handle loading notes
ipcMain.on('load-notes', (event) => {
  const notes = loadNotes();
  event.reply('notes-loaded', notes);
});

// Helper functions for file operations
function loadNotes() {
  try {
    const data = fs.readFileSync(NOTES_FILE);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
