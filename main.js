// Initial bookmarks and images data
let bookmarks = {
    general: [
        { name: 'ChatGPT', url: 'https://chat.openai.com' },
        { name: 'Claude', url: 'https://claude.ai' },
        { name: 'Twitter', url: 'https://twitter.com' },
        { name: 'Reddit', url: 'https://www.reddit.com' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com' },
        { name: 'YouTube', url: 'https://www.youtube.com' },
        { name: 'Gmail', url: 'https://mail.google.com' },
        { name: 'Canva', url: 'https://www.canva.com' },
        { name: 'Proton Drive', url: 'https://drive.proton.me' }
    ],
    learning: [
        { name: 'Roadmap.sh', url: 'https://roadmap.sh' },
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'Udemy', url: 'https://www.udemy.com' },
        { name: 'W3Schools', url: 'https://www.w3schools.com' },
        { name: 'Explainshell', url: 'https://explainshell.com' },
        { name: 'ArchWiki', url: 'https://wiki.archlinux.org' },
        { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org' },
        { name: 'NetAcad', url: 'https://www.netacad.com' }
    ],
    productivity: [
        { name: 'TasksBoard', url: 'https://tasksboard.com/app' },
        { name: 'Flocus', url: 'https://app.flocus.com/' },
        { name: 'IDX Dev', url: 'https://idx.dev/' },

    ],
    school: [
        { name: 'BBBaden', url: 'https://www.bbbaden.ch/' },
        { name: 'Moodle', url: 'https://moodle.bbbaden.ch/' },
        { name: 'NetAcad', url: 'https://www.netacad.com' },
        { name: 'OneDrive (BBBaden)', url: 'https://bbbaden-my.sharepoint.com/' },
        { name: 'OneNote (BBBaden)', url: 'https://bbbaden-my.sharepoint.com/:o:/g/personal/daniel_wuest_bbbaden_ch/Ei3c8fUbXC9PqoFVdyMp3VYBFkYXVmg2eo4NEkYZpVkOoA?e=PxdD24' },
        { name: 'Outlook', url: 'https://outlook.office.com/mail/' }
    ],
    utilities: [
        { name: 'MonkeyType', url: 'https://monkeytype.com' },
        { name: 'Proton Drive', url: 'https://drive.proton.me' },
        { name: 'Canva', url: 'https://www.canva.com' }
    ]
};



// DOM Elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const mainImage = document.getElementById('mainImage');
const importInput = document.getElementById('importInput');
const terminalInput = document.getElementById('terminalInput');
const suggestions = document.getElementById('suggestions');
const dateTimeElement = document.getElementById('datetime');

// Settings Panel Event Listeners
settingsBtn?.addEventListener('click', openSettings);
closeBtn?.addEventListener('click', closeSettings);
overlay?.addEventListener('click', closeSettings);
importInput?.addEventListener('change', handleImport);

function openSettings() {
    settingsPanel?.classList.add('active');
    overlay?.classList.add('active');
    renderImageList();
    renderBookmarksEditor();
}

function closeSettings() {
    settingsPanel?.classList.remove('active');
    overlay?.classList.remove('active');
}

// Bookmark Management
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

// Image Management
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

// Terminal Functionality
function setupTerminal() {
    terminalInput?.addEventListener('input', handleTerminalInput);
    terminalInput?.addEventListener('keydown', handleTerminalKeydown);
    document.addEventListener('click', () => {
        suggestions.style.display = 'none';
    });
}

function handleTerminalInput(e) {
    const query = e.target.value.toLowerCase();
    if (!query) {
        suggestions.style.display = 'none';
        return;
    }

    const matches = [];
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

        const suggestionElements = suggestions.getElementsByClassName('suggestion');
        Array.from(suggestionElements).forEach(element => {
            element.addEventListener('click', (e) => {
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

function handleTerminalKeydown(e) {
    if (e.key === 'Enter' && suggestions.style.display === 'block') {
        const firstSuggestion = suggestions.querySelector('.suggestion');
        if (firstSuggestion) {
            window.open(firstSuggestion.dataset.url, '_blank');
            e.target.value = '';
            suggestions.style.display = 'none';
        }
    }
}

// Pomodoro Timer Functions
function setupPomodoro() {
    startBtn?.addEventListener('click', startTimer);
    resetBtn?.addEventListener('click', resetTimer);
    modeBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            timeLeft = parseInt(btn.dataset.time) * 60;
            resetTimer();
        });
    });
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    if (!minutesDisplay || !secondsDisplay) return;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = 'Pause';
        timerId = setInterval(() => {
            timeLeft--;
            updatePomodoroDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                isRunning = false;
                startBtn.textContent = 'Start';
            }
        }, 1000);
    } else {
        clearInterval(timerId);
        isRunning = false;
        startBtn.textContent = 'Start';
    }
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    startBtn.textContent = 'Start';
    const activeMode = document.querySelector('.mode-btn.active');
    if (activeMode) {
        timeLeft = parseInt(activeMode.dataset.time) * 60;
    } else {
        timeLeft = 25 * 60;
    }
    updatePomodoroDisplay();
}

// Settings Storage
function loadSettings() {
    const savedSettings = localStorage.getItem('startpageSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        bookmarks = settings.bookmarks || bookmarks;
        images = settings.images || images;
    }
}

function saveSettings() {
    localStorage.setItem('startpageSettings', JSON.stringify({ bookmarks, images }));
}

// Import/Export functionality
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
    importInput?.click();
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
                setRandomImage();
                alert('Settings imported successfully!');
            } else {
                throw new Error('Invalid settings file');
            }
        } catch (error) {
            alert('Error importing settings: Invalid file format');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Date and Time
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

function setRandomImage() {
    if (!mainImage || !images.length) return;
    const randomIndex = Math.floor(Math.random() * images.length);
    mainImage.src = images[randomIndex];
}

// Initialize
function init() {
    loadSettings();
    renderBookmarks();
    setupTerminal();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setRandomImage();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);