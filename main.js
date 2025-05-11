// Initial bookmarks und images data
let images = [];
let bookmarks = {
    general: [
        { name: 'ChatGPT', url: 'https://chat.openai.com' },
        { name: 'Claude', url: 'https://claude.ai' },
        { name: 'Reddit', url: 'https://www.reddit.com' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com' },
        { name: 'YouTube', url: 'https://www.youtube.com' },
        { name: 'Gmail', url: 'https://mail.google.com' },
        { name: 'Gmail2', url: 'https://mail2.google.com' },
        { name: 'Proton Drive', url: 'https://drive.proton.me' }
    ],
    learning: [
        { name: 'Roadmap.sh', url: 'https://roadmap.sh' },
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'Udemy', url: 'https://www.udemy.com' },
        { name: 'W3Schools', url: 'https://www.w3schools.com' },
        { name: 'Explainshell', url: 'https://explainshell.com' },
        { name: 'ArchWiki', url: 'https://wiki.archlinux.org' },
        { name: 'NetAcad', url: 'https://www.netacad.com' }
    ],
    productivity: [
        { name: 'TasksBoard', url: 'https://tasksboard.com/app' },
        { name: 'Flocus', url: 'https://app.flocus.com/' },
        { name: 'Firebase Studio', url: 'https://studio.firebase.google.com/' },
    ],
    school: [
        { name: 'BBBaden', url: 'https://www.bbbaden.ch/' },
        { name: 'Moodle', url: 'https://moodle.bbbaden.ch/' },
        { name: 'OneDrive (BBBaden)', url: 'https://bbbaden-my.sharepoint.com/' },
        { name: 'OneNote (BBBaden)', url: 'https://bbbaden-my.sharepoint.com/:o:/g/personal/daniel_wuest_bbbaden_ch/Ei3c8fUbXC9PqoFVdyMp3VYBFkYXVmg2eo4NEkYZpVkOoA?e=PxdD24' },
        { name: 'Outlook', url: 'https://outlook.office.com/mail/' },
        { name: 'MonkeyType', url: 'https://monkeytype.com' },
        { name: 'Proton Drive', url: 'https://drive.proton.me' }
    ],
    abbts: [
        { name: 'ABB-TS Website', url: 'https://www.abbts.ch/' }
    ],
    kalaidos: [
        { name: 'Kalaidos Portal', url: 'https://www.kalaidos-fh.ch/' }
    ]
};

// Standard Bildpfade für den Fall, dass keine im LocalStorage existieren
const defaultImages = [
    "./img/gif/japan-chill-sakura2.gif",
    "./img/gif/japan-chill-summer.webp",
    "./img/gif/japan-chill-autumn.gif",
    "./img/gif/japan-chill-winter.gif"
];

// DOM Elemente cachen
let settingsBtn, settingsPanel, overlay, closeBtn, mainImage, importInput, terminalInput, 
    suggestions, dateTimeElement, seasonIndicator;

// DOM ready event listener
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemente initialisieren
    settingsBtn = document.getElementById('settingsBtn');
    settingsPanel = document.getElementById('settingsPanel');
    overlay = document.getElementById('overlay');
    closeBtn = document.getElementById('closeBtn');
    mainImage = document.getElementById('mainImage');
    importInput = document.getElementById('importInput');
    terminalInput = document.getElementById('terminalInput');
    suggestions = document.getElementById('suggestions');
    dateTimeElement = document.getElementById('datetime');
    seasonIndicator = document.getElementById('seasonIndicator');

    // Event-Listener für Bilder-Fehler hinzufügen
    if (mainImage) {
        mainImage.addEventListener('error', handleImageError);
    }

    // Event-Listener für Settings-Panel
    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
    if (closeBtn) closeBtn.addEventListener('click', closeSettings);
    if (overlay) overlay.addEventListener('click', closeSettings);
    if (importInput) importInput.addEventListener('change', handleImport);

    // Initialisierung starten
    init();
    
    // Terminal-Funktionalität aktivieren
    setupTerminal();
});

// Seiten-Initialisierung
function init() {
    loadSettings();
    renderBookmarks();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Prüfen ob Bilder vorhanden sind
    if (!images || images.length === 0) {
        images = [...defaultImages]; // Default-Bilder verwenden
        saveSettings();
    }
    
    // Je nach Saison ein Bild wählen
    updateSeasonalGif();
    
    // Aktuelle Seite in Navigation hervorheben
    highlightCurrentPage();
}

// Fehlerbehandlung für Bilder
function handleImageError() {
    console.log("Bild konnte nicht geladen werden, versuche Fallback...");
    
    // Fallback-Strategie 1: Versuche ohne führenden Punkt
    let currentSrc = mainImage.src;
    if (currentSrc.includes('./')) {
        mainImage.src = currentSrc.replace('./', '/');
        return;
    }
    
    // Fallback-Strategie 2: Verwende ein zufälliges Bild
    let fallbackImages = [...defaultImages];
    
    // Zusätzlich absolute Pfade hinzufügen
    fallbackImages = fallbackImages.concat(defaultImages.map(img => img.replace('./', '/')));
    
    // Zufälliges Bild wählen
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    mainImage.src = fallbackImages[randomIndex];
}

// Settings Panel-Funktionen
function openSettings() {
    if (!settingsPanel || !overlay) return;
    settingsPanel.classList.add('active');
    overlay.classList.add('active');
    renderImageList();
    renderBookmarksEditor();
}

function closeSettings() {
    if (!settingsPanel || !overlay) return;
    settingsPanel.classList.remove('active');
    overlay.classList.remove('active');
}

// Bookmark-Verwaltung
function renderBookmarks() {
    Object.keys(bookmarks).forEach(category => {
        const container = document.getElementById(`${category}-links`);
        if (container) {
            container.innerHTML = bookmarks[category]
                .map(bookmark => `<a href="${bookmark.url}" target="_blank">${bookmark.name}</a>`)
                .join('');
        }
    });
}

function renderBookmarksEditor() {
    const editor = document.getElementById('bookmarksEditor');
    if (!editor) return;

    editor.innerHTML = Object.keys(bookmarks)
        .map(category => `
            <div class="category-editor">
                <h4>${category.toUpperCase()}</h4>
                <div class="bookmark-list">
                    ${bookmarks[category].map((bookmark, index) => `
                        <div class="bookmark-item">
                            <input type="text" value="${bookmark.name}" 
                                onchange="updateBookmark('${category}', ${index}, 'name', this.value)">
                            <input type="text" value="${bookmark.url}" 
                                onchange="updateBookmark('${category}', ${index}, 'url', this.value)">
                            <button onclick="deleteBookmark('${category}', ${index})">🗑️</button>
                        </div>
                    `).join('')}
                    <button onclick="addBookmark('${category}')" class="add-bookmark-btn">+ Add Bookmark</button>
                </div>
            </div>
        `).join('');
}

window.updateBookmark = function(category, index, field, value) {
    bookmarks[category][index][field] = value;
    saveSettings();
    renderBookmarks();
};

window.deleteBookmark = function(category, index) {
    if (confirm('Are you sure you want to delete this bookmark?')) {
        bookmarks[category].splice(index, 1);
        saveSettings();
        renderBookmarks();
        renderBookmarksEditor();
    }
};

window.addBookmark = function(category) {
    bookmarks[category].push({ name: 'New Bookmark', url: 'https://' });
    saveSettings();
    renderBookmarks();
    renderBookmarksEditor();
};

// Bild-Verwaltung
function renderImageList() {
    const imageList = document.getElementById('imageList');
    if (!imageList) return;

    imageList.innerHTML = images
        .map((url, index) => `
            <div class="image-item">
                <input type="text" value="${url}" 
                    onchange="updateImage(${index}, this.value)">
                <button onclick="deleteImage(${index})">🗑️</button>
            </div>
        `).join('');
}

window.updateImage = function(index, newUrl) {
    images[index] = newUrl;
    saveSettings();
};

window.deleteImage = function(index) {
    if (images.length > 1 && confirm('Are you sure you want to delete this image?')) {
        images.splice(index, 1);
        saveSettings();
        renderImageList();
    } else if (images.length <= 1) {
        alert('You must keep at least one image!');
    }
};

window.addImageUrl = function() {
    const url = prompt('Enter image URL:');
    if (url) {
        images.push(url);
        saveSettings();
        renderImageList();
    }
};

// Terminal-Funktionalität
function setupTerminal() {
    console.log("Terminal-Setup wird ausgeführt...");
    
    if (!terminalInput || !suggestions) {
        console.error("Terminal-Elemente nicht gefunden!");
        return;
    }
    
    console.log("Terminal-Elemente gefunden, füge Event-Listener hinzu");
    
    // Input-Event-Listener für Live-Suche
    terminalInput.addEventListener('input', handleTerminalInput);
    
    // Keydown-Event-Listener für Enter-Taste
    terminalInput.addEventListener('keydown', handleTerminalKeydown);
    
    // Klick außerhalb des Terminals schließt Vorschläge
    document.addEventListener('click', function() {
        suggestions.style.display = 'none';
    });
    
    console.log("Terminal-Setup abgeschlossen");
}

function handleTerminalInput(e) {
    const query = terminalInput.value.toLowerCase();
    
    if (!query) {
        suggestions.style.display = 'none';
        return;
    }

    // Such-Aliase überprüfen
    const searchAliases = {
        'g ': 'https://www.google.com/search?q=',
        'd ': 'https://duckduckgo.com/?q=',
        'gh ': 'https://github.com/search?q=',
        's ': 'https://stackoverflow.com/search?q=',
        'r ': 'https://www.reddit.com/search/?q=',
        'w ': 'https://en.wikipedia.org/wiki/Special:Search?search='
    };

    // Prüfen ob die Anfrage mit einem Such-Alias beginnt
    for (const [prefix, searchUrl] of Object.entries(searchAliases)) {
        if (query.startsWith(prefix)) {
            const searchTerm = query.substring(prefix.length);
            if (searchTerm) {
                suggestions.innerHTML = `<div class="suggestion search-suggestion" data-url="${searchUrl}${encodeURIComponent(searchTerm)}">
                    Search ${getSearchEngineName(prefix)}: ${searchTerm}
                </div>`;
                suggestions.style.display = 'block';
                
                const searchSuggestion = suggestions.querySelector('.search-suggestion');
                if (searchSuggestion) {
                    searchSuggestion.addEventListener('click', function(e) {
                        e.stopPropagation();
                        window.open(searchSuggestion.dataset.url, '_blank');
                        terminalInput.value = '';
                        suggestions.style.display = 'none';
                    });
                }
                return;
            }
        }
    }

    // Lesezeichen durchsuchen, wenn kein Such-Alias verwendet wird
    let matches = [];
    
    // Alle Lesezeichen durchsuchen
    Object.values(bookmarks).forEach(category => {
        category.forEach(bookmark => {
            if (bookmark.name.toLowerCase().includes(query) || 
                bookmark.url.toLowerCase().includes(query)) {
                matches.push(bookmark);
            }
        });
    });

    if (matches.length > 0) {
        suggestions.innerHTML = matches
            .map(match => `<div class="suggestion" data-url="${match.url}">${match.name}</div>`)
            .join('');
        suggestions.style.display = 'block';

        const suggestionElements = suggestions.querySelectorAll('.suggestion');
        suggestionElements.forEach(element => {
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                window.open(element.dataset.url, '_blank');
                terminalInput.value = '';
                suggestions.style.display = 'none';
            });
        });
    } else {
        suggestions.style.display = 'none';
    }
}

function getSearchEngineName(prefix) {
    switch(prefix.trim()) {
        case 'g': return 'Google';
        case 'd': return 'DuckDuckGo';
        case 'gh': return 'GitHub';
        case 's': return 'Stack Overflow';
        case 'r': return 'Reddit';
        case 'w': return 'Wikipedia';
        default: return 'Search';
    }
}

function handleTerminalKeydown(e) {
    if (e.key === 'Enter') {
        const query = terminalInput.value.toLowerCase();
        
        // Such-Aliase überprüfen
        const searchAliases = {
            'g ': 'https://www.google.com/search?q=',
            'd ': 'https://duckduckgo.com/?q=',
            'gh ': 'https://github.com/search?q=',
            's ': 'https://stackoverflow.com/search?q=',
            'r ': 'https://www.reddit.com/search/?q=',
            'w ': 'https://en.wikipedia.org/wiki/Special:Search?search='
        };

        // Prüfen ob die Anfrage mit einem Such-Alias beginnt
        for (const [prefix, searchUrl] of Object.entries(searchAliases)) {
            if (query.startsWith(prefix)) {
                const searchTerm = query.substring(prefix.length);
                if (searchTerm) {
                    window.open(searchUrl + encodeURIComponent(searchTerm), '_blank');
                    terminalInput.value = '';
                    suggestions.style.display = 'none';
                    return;
                }
            }
        }
        
        // Wenn kein Such-Alias oder wenn Vorschläge angezeigt werden, den ersten Vorschlag verwenden
        if (suggestions.style.display === 'block') {
            const firstSuggestion = suggestions.querySelector('.suggestion');
            if (firstSuggestion) {
                window.open(firstSuggestion.dataset.url, '_blank');
                terminalInput.value = '';
                suggestions.style.display = 'none';
            }
        }
    }
}

// Datum und Uhrzeit-Funktionen
function updateDateTime() {
    if (!dateTimeElement) return;
    
    const now = new Date();
    const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    dateTimeElement.textContent = now.toLocaleDateString('en-US', options).toUpperCase();
}

// Zufälliges Bild setzen
function setRandomImage() {
    if (!mainImage || !images.length) return;
    
    const randomIndex = Math.floor(Math.random() * images.length);
    mainImage.src = images[randomIndex];
}

// Determine current season and set appropriate GIF
function updateSeasonalGif() {
    if (!mainImage) return;
    
    const date = new Date();
    const month = date.getMonth(); // 0-11 (Jan-Dec)
    
    let season;
    let gifPath;
    
    // Determine season based on month
    // Northern hemisphere seasons
    if (month >= 2 && month <= 4) {
        // Spring: March, April, May
        season = "Spring";
        gifPath = "./img/gif/japan-chill-sakura2.gif"; // Cherry blossoms for spring
    } else if (month >= 5 && month <= 7) {
        // Summer: June, July, August
        season = "Summer";
        gifPath = "./img/gif/japan-chill-summer.webp"; // Summer themed GIF
    } else if (month >= 8 && month <= 10) {
        // Fall: September, October, November
        season = "Fall";
        gifPath = "./img/gif/japan-chill-autumn.gif"; // Fall themed GIF
    } else {
        // Winter: December, January, February
        season = "Winter";
        gifPath = "./img/gif/japan-chill-winter.gif"; // Winter themed GIF
    }
    
    // Update the GIF with error handling
    mainImage.src = gifPath;
    
    // Add error handling for the image
    mainImage.onerror = function() {
        console.error("Failed to load seasonal GIF:", gifPath);
        // Try with absolute path if relative path fails
        mainImage.src = gifPath.replace('./', '/');
        
        // If that still fails, try a fallback
        mainImage.onerror = function() {
            console.error("Failed to load seasonal GIF with absolute path, trying fallback");
            setRandomImage();
        };
    };
    
    // Update season indicator with error handling
    if (seasonIndicator) {
        seasonIndicator.textContent = season;
        seasonIndicator.className = 'season-indicator ' + season.toLowerCase();
    } else {
        console.warn("Season indicator element not found");
    }
    
    // Store the current season in localStorage for settings
    try {
        localStorage.setItem('currentSeason', season);
    } catch (error) {
        console.warn("Could not save season to localStorage:", error);
    }
    
    console.log("Season updated to:", season);
    return { season, gifPath }; // Return for potential use elsewhere
}

// Function to test different seasons
function testSeason(seasonName) {
    let gifPath;
    
    // Set GIF based on season name
    switch(seasonName.toLowerCase()) {
        case 'spring':
            gifPath = "./img/gif/japan-chill-sakura2.gif";
            break;
        case 'summer':
            gifPath = "./img/gif/japan-chill-summer.webp";
            break;
        case 'fall':
        case 'autumn':
            gifPath = "./img/gif/japan-chill-autumn.gif";
            break;
        case 'winter':
            gifPath = "./img/gif/japan-chill-winter.gif";
            break;
        default:
            console.error('Invalid season name. Use: spring, summer, fall/autumn, or winter');
            return;
    }
    
    // Update the GIF
    if (mainImage) {
        mainImage.src = gifPath;
    } else {
        console.error("Main image element not found");
        return;
    }
    
    // Update season indicator
    if (seasonIndicator) {
        seasonIndicator.textContent = seasonName.charAt(0).toUpperCase() + seasonName.slice(1);
        seasonIndicator.className = 'season-indicator ' + seasonName.toLowerCase();
    } else {
        console.warn("Season indicator element not found");
    }
    
    console.log(`Switched to ${seasonName} theme`);
}

// Einstellungen laden/speichern
function loadSettings() {
    try {
        console.log("Versuche Einstellungen zu laden...");
        const savedSettings = localStorage.getItem('startpageSettings');
        
        if (savedSettings) {
            console.log("Gespeicherte Einstellungen gefunden");
            const settings = JSON.parse(savedSettings);
            
            // Lesezeichen laden, falls vorhanden
            if (settings.bookmarks) {
                console.log("Lesezeichen in den Einstellungen gefunden");
                bookmarks = settings.bookmarks;
            } else {
                console.log("Keine Lesezeichen gefunden, verwende Standard-Lesezeichen");
                // Setze Standard-Lesezeichen
                localStorage.setItem('startpageSettings', JSON.stringify({ bookmarks, images }));
            }
            
            // Bilder laden, falls vorhanden
            if (settings.images && settings.images.length > 0) {
                images = settings.images;
            } else {
                // Standardbilder verwenden, wenn keine gespeichert sind
                images = [...defaultImages];
                saveSettings();
            }
        } else {
            console.log("Keine gespeicherten Einstellungen gefunden, verwende Standards");
            // Wenn keine Einstellungen vorhanden sind, Standard-Werte setzen und speichern
            saveSettings();
        }
    } catch (error) {
        console.error("Fehler beim Laden der Einstellungen:", error);
        // Standardwerte verwenden
        images = [...defaultImages];
        saveSettings();
    }
    
    // Debugging: Zeige geladene Lesezeichen in der Konsole
    console.log("Geladene Lesezeichen:", Object.keys(bookmarks).map(k => `${k}: ${bookmarks[k].length}`));
}

function saveSettings() {
    try {
        localStorage.setItem('startpageSettings', JSON.stringify({ bookmarks, images }));
    } catch (error) {
        console.error("Fehler beim Speichern der Einstellungen:", error);
    }
}

// Import/Export-Funktionalität
window.exportSettings = function() {
    const settings = { bookmarks, images };
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'startpage-settings.json');
    linkElement.click();
};

window.importSettings = function() {
    if (importInput) importInput.click();
};

function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const settings = JSON.parse(e.target?.result);
            if (settings.bookmarks && settings.images) {
                bookmarks = settings.bookmarks;
                images = settings.images;
                saveSettings();
                renderBookmarks();
                renderImageList();
                renderBookmarksEditor();
                
                // Aktuelles Bild nach dem Import aktualisieren
                updateSeasonalGif();
                
                alert('Settings imported successfully!');
            } else {
                throw new Error('Invalid settings file');
            }
        } catch (error) {
            alert('Error importing settings: Invalid file format');
            console.error(error);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Aktuelle Seite in der Navigation hervorheben
function highlightCurrentPage() {
    // Aktuellen Seitennamen abrufen
    const currentPage = window.location.pathname.split('/').pop();
    
    // Alle Navigationslinks abrufen
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Aktive Klasse von allen Links entfernen
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Aktive Klasse zum aktuellen Seitenlink hinzufügen
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage || 
            (currentPage === '' && linkPage === 'index.html') || 
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Networking-Abschnitt basierend auf den Notizen hinzufügen
function addNetworkingSection() {
    const networkingLinks = [
        { name: 'Networking Homepage', url: 'https://jairomorales.ch/networking' },
        { name: 'Cisco Learning', url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications.html' },
        { name: 'CBT Nuggets', url: 'https://www.cbtnuggets.com/' },
        { name: 'Binary Game', url: './pages/binary-game.html' }
    ];

    // Füge Networking zu den bookmarks hinzu, wenn es noch nicht existiert
    if (!bookmarks.networking) {
        bookmarks.networking = networkingLinks;
        saveSettings();
        renderBookmarks();
    }
}

// Funktionen global verfügbar machen
window.updateSeasonalGif = updateSeasonalGif;
window.testSeason = testSeason;

// Networking-Sektion hinzufügen, wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', addNetworkingSection);

// Nach kurzer Verzögerung prüfen, ob Lesezeichen geladen wurden
// und falls nicht, Standard-Lesezeichen direkt in die DOM-Elemente einfügen
setTimeout(() => {
    // Prüfe ob einer der Link-Container leer ist
    Object.keys(bookmarks).forEach(category => {
        const container = document.getElementById(`${category}-links`);
        if (container && (!container.innerHTML || container.innerHTML.trim() === '')) {
            console.warn(`Container für ${category} ist leer, füge Standard-Links ein`);
            container.innerHTML = bookmarks[category]
                .map(bookmark => `<a href="${bookmark.url}" target="_blank">${bookmark.name}</a>`)
                .join('');
        }
    });
}, 1000);