import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, copyFileSync, existsSync, mkdirSync } from 'fs';

// Funktion, um JavaScript-Dateien manuell zu kopieren
function copyJSFiles() {
  if (!existsSync('dist')) {
    mkdirSync('dist');
  }
  
  // JS-Dateien, die wir kopieren müssen
  const jsFiles = ['pomodoro.js'];
  
  // Prüfen, ob die Dateien im src-Ordner oder im Root liegen
  jsFiles.forEach(file => {
    // Prüfen, ob die Datei im Stammverzeichnis existiert
    if (existsSync(file)) {
      copyFileSync(file, `dist/${file}`);
    } 
    // Wenn nicht, prüfen, ob sie im src-Ordner existiert
    else if (existsSync(`src/${file}`)) {
      copyFileSync(`src/${file}`, `dist/${file}`);
    }
  });
}

export default defineConfig({
  // Verwende relative Pfade für Assets im Production-Build
  base: './',
  
  build: {
    // Ausgabeverzeichnis für den Production-Build
    outDir: 'dist',
    
    // Stelle sicher, dass Assets korrekt kopiert werden
    assetsInlineLimit: 0,

    // Rollup-Optionen für die Eingabedateien
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pomodoro: resolve(__dirname, 'pages/pomodoro.html'),
        todo: resolve(__dirname, 'pages/todo.html'),
        binaryGame: resolve(__dirname, 'pages/binary-game.html'),
      }
    },
    
    // Hook für den Build-Prozess
    emptyOutDir: true,
  },
  
  // Verwende Plugins für den Build-Prozess
  plugins: [
    {
      name: 'copy-js-files',
      closeBundle() {
        // Nach dem Build werden die JS-Dateien kopiert
        copyJSFiles();
      }
    }
  ]
});