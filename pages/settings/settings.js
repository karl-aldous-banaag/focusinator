chrome.storage.local.get([
    "menuButtons", "allPoints", "lastDayChecked",
    "dailyPoints", "dailyGoodWebsites", "dailyTasks",
    "enabledSites", "daysOn", "storedRewards",
    "notepadContent", "checklistTasks", "bannedWebsites",
    "blacklistWords"
], (storageValsObj) => {
    document.getElementById("storage-vals").innerHTML = JSON.stringify(storageValsObj, null, 4);
});

// Toggle divs in settings
document.querySelectorAll("h4").forEach((h4) => {
    h4.addEventListener("click", (evt) => {
        if (h4.id.endsWith("toggle")) {
            const divIdPrefix = h4.id.slice(0, h4.id.indexOf("-toggle"));
            let currentState = document.getElementById(`${divIdPrefix}`).hidden;
            document.getElementById(`${divIdPrefix}`).hidden = !currentState;
        }
    })
});

// Expand menus
document.querySelectorAll(".collapser").forEach(collapser => {
    collapser.addEventListener("click", (evt) => {
        setTimeout(() => {
            const showing = document.querySelector(collapser.getAttribute("href")).classList.contains("show");

            if (showing) {
                collapser.childNodes[1].childNodes[3].innerHTML = '-';
            } else {
                collapser.childNodes[1].childNodes[3].innerHTML = '+';
            }
        }, 500);
    })
});