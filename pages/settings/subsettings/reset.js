// Program reset buttons
document.getElementById("reset-menu-buttons").addEventListener("click", (evt) => {
    if (confirm("Are you sure you want to reset the menu buttons?")) {
        chrome.storage.local.set({ menuButtons: {} }, () => {
            alert("Menu buttons reset.");
        });
    }
});

document.getElementById("reset-checklist").addEventListener("click", (evt) => {
    if (confirm("Are you sure you want to reset the checklist?")) {
        chrome.storage.local.set({ checklistTasks: [] }, () => {
            alert("Checklist reset.");
        });
    }
});

document.getElementById("reset-points").addEventListener("click", (evt) => {
    if (confirm("Are you sure you want to reset all your points?")) {
        chrome.storage.local.set({
            allPoints: 0,
            dailyPoints: 0
        }, () => {
            alert("Points reset.");
        });
    }
});

document.getElementById("reset-all").addEventListener("click", (evt) => {
    if (confirm("Are you sure you want to reset all settings?")) {
        chrome.storage.local.clear(() => { alert("All settings reset."); });
    }
});