// renderer.js
const { ipcRenderer } = require('electron');

const saveBtn = document.getElementById('save-btn');
const noteTextarea = document.getElementById('note-textarea');
const noteList = document.getElementById('note-list');

saveBtn.addEventListener('click', () => {
  const note = noteTextarea.value.trim();
  if (note) {
    ipcRenderer.send('save-note', note);
  }
});

ipcRenderer.on('note-saved', (event, notes) => {
  displayNotes(notes);
  noteTextarea.value = ''; // Clear textarea after saving
});

ipcRenderer.on('notes-loaded', (event, notes) => {
  displayNotes(notes);
});

// Load notes on startup
ipcRenderer.send('load-notes');

function displayNotes(notes) {
  noteList.innerHTML = '';
  notes.forEach((note, index) => {
    const li = document.createElement('li');
    li.textContent = `Note ${index + 1}: ${note}`;
    li.addEventListener('click', () => {
      noteTextarea.value = note;
    });
    noteList.appendChild(li);
  });
}
