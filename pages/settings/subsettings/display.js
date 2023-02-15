// Initialize dark mode
chrome.storage.local.get(["darkMode"], result => {
    if (result.darkMode) {
        document.querySelector("#dark-mode").checked = result.darkMode;
    }
});

// Toggle dark mode
document.querySelector("#dark-mode").addEventListener("click", (evt) => {
    chrome.storage.local.set({
        darkMode: document.querySelector("#dark-mode").checked
    }, () => { location.reload(); });
});