// Import seasonal images for Vite bundling
import springImage from './img/gif/japan-chill-sakura2.gif';
import summerImage from './img/gif/japan-chill-summer.webp';
import autumnImage from './img/gif/japan-chill-autumn.gif';
import winterImage from './img/gif/japan-chill-winter.gif';

// Initial bookmarks and images data
let images = [];
let bookmarks = {
    general: [
        { name: 'ChatGPT', url: 'https://chat.openai.com' },
        { name: 'Claude', url: 'https://claude.ai' },
        { name: 'Reddit', url: 'https://www.reddit.com' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com' },
        { name: 'YouTube', url: 'https://www.youtube.com' },
        { name: 'Gmail', url: 'https://mail.google.com' },
        { name: 'Calendar', url: 'https://calendar.proton.me/u/2/' },
        { name: 'Proton Drive', url: 'https://drive.proton.me' }
    ],
    learning: [
        { name: 'Roadmap.sh', url: 'https://roadmap.sh' },
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'Udemy', url: 'https://www.udemy.com' },
        { name: 'W3Schools', url: 'https://www.w3schools.com' },
        { name: 'Explainshell', url: 'https://explainshell.com' },
        { name: 'ArchWiki', url: 'https://wiki.archlinux.org' },
        { name: 'NetAcad', url: 'https://www.netacad.com' },
        { name: 'MonkeyType', url: 'https://monkeytype.com' }
    ],
    productivity: [
        { name: 'Todoist', url: 'https://app.todoist.com/app' },
        { name: 'Flocus', url: 'https://app.flocus.com/' },
        { name: 'Firebase Studio', url: 'https://studio.firebase.google.com/' },
        { name: 'Vercel', url: 'https://vercel.com/' },
        { name: 'v0 Builder', url: 'https://v0.app/' },
        { name: 'Teams', url: 'https://teams.microsoft.com/v2/' },
        { name: 'Outlook', url: 'https://outlook.office.com/mail/' }
    ],
    others: [
        { name: 'RedHat Topics', url: 'https://www.redhat.com/de/topics' },
        { name: 'Anthropic RedTeam', url: 'https://red.anthropic.com/' },
        { name: 'WD MyCloud EX2 Ultra', url: 'http://mycloudex2ultra/' },
        { name: 'Router', url: 'http://192.168.1.1/' },
        { name: 'TailScale', url: 'https://login.tailscale.com/admin' },
        { name: 'ZHAW (MSE CyberSecurity)', url: 'https://www.zhaw.ch/de/engineering/studium/masterstudium/information-and-cyber-security' },
        { name: 'MyJourney', url: 'https://journey.jairomorales.ch/' }
    ],
    abbts: [
        { name: 'ABB-TS | Informatik HF', url: 'https://www.abbts.ch/bildungsangebot/hoehere-fachschule/informatik' },
        { name: 'Infopoint', url: 'https://abbtsch.sharepoint.com/sites/Infopoint' },
        { name: 'Betriebswirtschaft verstehen (Capaul)', url: 'https://app.edubase.ch/#doc/57879/1' },
        { name: 'Rechnungswesen als Führungsinstrument', url: 'C:\\Users\\jairo\\OneDrive - ABB Technikerschule\\1. Semester\\BWL\\RW\\rw-theorie-aufgaben_11A.pdf' },
        { name: 'ABB-TS Website', url: 'https://www.abbts.ch/' }
    ],
    kalaidos: [
        { name: 'Kalaidos BSc - HFI+', url: 'https://www.kalaidos-fh.ch/de-CH/Studiengaenge/Plus-Bachelor-Informatik-integrativ-mit-HFI' },
        { name: 'Kalaidos Campus', url: 'https://campus.kalaidos-fh.ch/' },
        { name: 'Kalaidos OpenOlat', url: 'https://openolat.kalaidos-fh.ch/auth/MyCoursesSite/' },
        { name: 'Kalaidos Portal', url: 'https://www.kalaidos-fh.ch/' }
    ]
};

// Default image paths if none exist in LocalStorage
const defaultImages = [
    springImage,
    summerImage,
    autumnImage,
    winterImage
];

// Cache DOM elements
let settingsBtn, settingsPanel, overlay, closeBtn, mainImage, importInput, terminalInput,
    suggestions, dateTimeElement, seasonIndicator;

// Initialize DOM elements and start application
function initializeApp() {
    console.log('initializeApp() called');

    // Initialize DOM elements
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

    // Verify critical elements exist
    if (!mainImage) console.error('mainImage element not found!');
    if (!dateTimeElement) console.error('datetime element not found!');
    if (!seasonIndicator) console.error('seasonIndicator element not found!');

    // Add event listeners
    if (mainImage) mainImage.addEventListener('error', handleImageError);
    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
    if (closeBtn) closeBtn.addEventListener('click', closeSettings);
    if (overlay) overlay.addEventListener('click', closeSettings);
    if (importInput) importInput.addEventListener('change', handleImport);

    // Initialize application
    init();
    setupTerminal();
}

// DOM ready event listener with fallback
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM already loaded
    initializeApp();
}

// Initialize page
function init() {
    console.log('Initializing startpage...');

    loadSettings();
    addNetworkingSection();
    renderBookmarks();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Use default images if none exist
    if (!images || images.length === 0) {
        images = [...defaultImages];
        saveSettings();
    }

    updateSeasonalGif();
    highlightCurrentPage();

    console.log('Startpage initialization complete');
}

// Handle image loading errors
function handleImageError() {
    let currentSrc = mainImage.src;

    // Try without leading dot
    if (currentSrc.includes('./')) {
        mainImage.src = currentSrc.replace('./', '/');
        return;
    }

    // Use random fallback image
    let fallbackImages = [...defaultImages];
    fallbackImages = fallbackImages.concat(defaultImages.map(img => img.replace('./', '/')));

    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    mainImage.src = fallbackImages[randomIndex];
}

// Settings panel functions
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

// Bookmark management
function renderBookmarks() {
    console.log('Rendering bookmarks for categories:', Object.keys(bookmarks));

    Object.keys(bookmarks).forEach(category => {
        const container = document.getElementById(`${category}-links`);
        if (container) {
            const links = bookmarks[category]
                .map(bookmark => `<a href="${bookmark.url}" target="_blank">${bookmark.name}</a>`)
                .join('');
            container.innerHTML = links;
            console.log(`Rendered ${bookmarks[category].length} links for ${category}`);
        } else {
            console.warn(`Container not found for category: ${category}`);
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

// Image management
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

// Terminal functionality
function setupTerminal() {
    if (!terminalInput || !suggestions) return;

    terminalInput.addEventListener('input', handleTerminalInput);
    terminalInput.addEventListener('keydown', handleTerminalKeydown);

    // Hide suggestions when clicking outside
    document.addEventListener('click', () => {
        suggestions.style.display = 'none';
    });
}

function handleTerminalInput(e) {
    const query = terminalInput.value.toLowerCase();
    
    if (!query) {
        suggestions.style.display = 'none';
        return;
    }

    // Check search aliases
    const searchAliases = {
        'g ': 'https://www.google.com/search?q=',
        'd ': 'https://duckduckgo.com/?q=',
        'gh ': 'https://github.com/search?q=',
        's ': 'https://stackoverflow.com/search?q=',
        'r ': 'https://www.reddit.com/search/?q=',
        'w ': 'https://en.wikipedia.org/wiki/Special:Search?search='
    };

    // Check if query starts with search alias
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

    // Search bookmarks if no search alias used
    let matches = [];
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

        const searchAliases = {
            'g ': 'https://www.google.com/search?q=',
            'd ': 'https://duckduckgo.com/?q=',
            'gh ': 'https://github.com/search?q=',
            's ': 'https://stackoverflow.com/search?q=',
            'r ': 'https://www.reddit.com/search/?q=',
            'w ': 'https://en.wikipedia.org/wiki/Special:Search?search='
        };

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
        
        // Use first suggestion if available
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

// Date and time functions
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

// Set random image
function setRandomImage() {
    if (!mainImage || !images.length) return;
    
    const randomIndex = Math.floor(Math.random() * images.length);
    mainImage.src = images[randomIndex];
}

// Determine current season and set appropriate GIF
function updateSeasonalGif() {
    if (!mainImage) {
        console.warn("mainImage element not found");
        return;
    }

    const date = new Date();
    const month = date.getMonth(); // 0-11 (Jan-Dec: 0=Jan, 1=Feb, ..., 11=Dec)
    const day = date.getDate();

    let season;
    let gifPath;

    // Determine season based on meteorological seasons
    // Using more accurate seasonal boundaries
    if (month === 2 || month === 3 || month === 4) {
        // Spring: March (2), April (3), May (4)
        season = "Spring";
        gifPath = springImage;
    } else if (month === 5 || month === 6 || month === 7) {
        // Summer: June (5), July (6), August (7)
        season = "Summer";
        gifPath = summerImage;
    } else if (month === 8 || month === 9 || month === 10) {
        // Fall: September (8), October (9), November (10)
        season = "Fall";
        gifPath = autumnImage;
    } else {
        // Winter: December (11), January (0), February (1)
        season = "Winter";
        gifPath = winterImage;
    }

    console.log(`Detected season: ${season} (month: ${month}, day: ${day})`);

    // Update the GIF
    mainImage.src = gifPath;
    mainImage.onerror = function() {
        console.error("Failed to load seasonal GIF:", gifPath);
        const altPath = gifPath.replace('./', '/');
        mainImage.src = altPath;
        mainImage.onerror = function() {
            console.error("Failed to load seasonal GIF with absolute path");
            setRandomImage();
        };
    };

    // Update season indicator
    if (seasonIndicator) {
        seasonIndicator.textContent = season;
        seasonIndicator.className = 'season-indicator ' + season.toLowerCase();
        console.log(`Season indicator updated: ${season}`);
    } else {
        console.warn("Season indicator element not found");
    }

    return { season, gifPath };
}

// Function to test different seasons
function testSeason(seasonName) {
    let gifPath;
    
    // Set GIF based on season name
    switch(seasonName.toLowerCase()) {
        case 'spring':
            gifPath = springImage;
            break;
        case 'summer':
            gifPath = summerImage;
            break;
        case 'fall':
        case 'autumn':
            gifPath = autumnImage;
            break;
        case 'winter':
            gifPath = winterImage;
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

// Load/save settings
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('startpageSettings');
        const SETTINGS_VERSION = '2.1'; // Increment this to force reset

        if (savedSettings) {
            const settings = JSON.parse(savedSettings);

            // Check version and reset if outdated or corrupted
            if (settings.version !== SETTINGS_VERSION) {
                console.log('Settings version mismatch or outdated, resetting to defaults');
                resetToDefaults();
                return;
            }

            if (settings.bookmarks) {
                bookmarks = settings.bookmarks;
            } else {
                resetToDefaults();
                return;
            }

            if (settings.images && settings.images.length > 0) {
                images = settings.images;
            } else {
                images = [...defaultImages];
                saveSettings();
            }
        } else {
            resetToDefaults();
        }
    } catch (error) {
        console.error("Error loading settings:", error);
        resetToDefaults();
    }
}

function resetToDefaults() {
    // Reset to default bookmarks
    bookmarks = {
        general: [
            { name: 'ChatGPT', url: 'https://chat.openai.com' },
            { name: 'Claude', url: 'https://claude.ai' },
            { name: 'Reddit', url: 'https://www.reddit.com' },
            { name: 'LinkedIn', url: 'https://www.linkedin.com' },
            { name: 'YouTube', url: 'https://www.youtube.com' },
            { name: 'Gmail', url: 'https://mail.google.com' },
            { name: 'Calendar', url: 'https://calendar.proton.me/u/2/' },
            { name: 'Proton Drive', url: 'https://drive.proton.me' }
        ],
        learning: [
            { name: 'Roadmap.sh', url: 'https://roadmap.sh' },
            { name: 'GitHub', url: 'https://github.com' },
            { name: 'Udemy', url: 'https://www.udemy.com' },
            { name: 'W3Schools', url: 'https://www.w3schools.com' },
            { name: 'Explainshell', url: 'https://explainshell.com' },
            { name: 'ArchWiki', url: 'https://wiki.archlinux.org' },
            { name: 'NetAcad', url: 'https://www.netacad.com' },
            { name: 'MonkeyType', url: 'https://monkeytype.com' }
        ],
        productivity: [
            { name: 'Todoist', url: 'https://app.todoist.com/app' },
            { name: 'Flocus', url: 'https://app.flocus.com/' },
            { name: 'Firebase Studio', url: 'https://studio.firebase.google.com/' },
            { name: 'Vercel', url: 'https://vercel.com/' },
            { name: 'v0 Builder', url: 'https://v0.app/' },
            { name: 'Teams', url: 'https://teams.microsoft.com/v2/' },
            { name: 'Outlook', url: 'https://outlook.office.com/mail/' }
        ],
        others: [
            { name: 'RedHat Topics', url: 'https://www.redhat.com/de/topics' },
            { name: 'Anthropic RedTeam', url: 'https://red.anthropic.com/' },
            { name: 'WD MyCloud EX2 Ultra', url: 'http://mycloudex2ultra/' },
            { name: 'Router', url: 'http://192.168.1.1/' },
            { name: 'TailScale', url: 'https://login.tailscale.com/admin' },
            { name: 'ETHZ (CyberSecurity MSc)', url: 'https://ethz.ch/de/studium/master/studienangebot/ingenieurwissenschaften/cyber-security.html' },
            { name: 'MyJourney', url: 'https://journey.jairomorales.ch/' }
        ],
        abbts: [
            { name: 'ABB-TS | Informatik HF', url: 'https://www.abbts.ch/bildungsangebot/hoehere-fachschule/informatik' },
            { name: 'Infopoint', url: 'https://abbtsch.sharepoint.com/sites/Infopoint' },
            { name: 'Betriebswirtschaft verstehen (Capaul)', url: 'https://app.edubase.ch/#doc/57879/1' },
            { name: 'Rechnungswesen als Führungsinstrument', url: 'C:\\Users\\jairo\\OneDrive - ABB Technikerschule\\1. Semester\\BWL\\RW\\rw-theorie-aufgaben_11A.pdf' },
            { name: 'ABB-TS Website', url: 'https://www.abbts.ch/' }
        ],
        kalaidos: [
            { name: 'Kalaidos BSc - HFI+', url: 'https://www.kalaidos-fh.ch/de-CH/Studiengaenge/Plus-Bachelor-Informatik-integrativ-mit-HFI' },
            { name: 'Kalaidos Campus', url: 'https://campus.kalaidos-fh.ch/' },
            { name: 'Kalaidos OpenOlat', url: 'https://openolat.kalaidos-fh.ch/auth/MyCoursesSite/' },
            { name: 'Kalaidos Portal', url: 'https://www.kalaidos-fh.ch/' }
        ]
    };
    images = [...defaultImages];
    saveSettings();
}

function saveSettings() {
    try {
        const SETTINGS_VERSION = '2.1';
        localStorage.setItem('startpageSettings', JSON.stringify({
            version: SETTINGS_VERSION,
            bookmarks,
            images
        }));
    } catch (error) {
        console.error("Error saving settings:", error);
    }
}

// Import/export functionality
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

// Highlight current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Add networking section
function addNetworkingSection() {
    const networkingLinks = [
        { name: 'Networking Homepage', url: 'https://jairomorales.ch/networking' },
        { name: 'Cisco Learning', url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications.html' },
        { name: 'CBT Nuggets', url: 'https://www.cbtnuggets.com/' },
        { name: 'Binary Game', url: './pages/binary-game.html' }
    ];

    // Add networking to bookmarks if it doesn't exist
    if (!bookmarks.networking) {
        bookmarks.networking = networkingLinks;
        saveSettings();
        renderBookmarks();
    }
}

// Make functions globally available
window.updateSeasonalGif = updateSeasonalGif;
window.testSeason = testSeason;
window.resetToDefaults = resetToDefaults;