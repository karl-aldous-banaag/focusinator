const goodWebsites = [
    "foi",
    "mail.google",
    "forms.google",
    "slides.google",
    "docs.google.com",
    "mapua.blackboard"
];

const setVariables = () => {
    chrome.storage.local.get([
        "menuButtons", "allPoints", "lastDayChecked",
        "dailyPoints", "dailyGoodWebsites", "dailyTasks",
        "enabledSites", "daysOn", "storedRewards",
        "notepadContent", "checklistTasks", "darkMode", 
        "rewardOptions"
    ], (result) => {
        if (!result.menuButtons) {
            chrome.storage.local.set({menuButtons: {}}, () => {});
        }

        if (!result.allPoints) {
            chrome.storage.local.set({allPoints: 0}, () => {});
        }

        if (!result.lastDayChecked) {
            chrome.storage.local.set({lastDayChecked: "01-01-1970"}, () => {});
        }

        if (!result.dailyPoints) {
            chrome.storage.local.set({dailyPoints: 0}, () => {});
        }

        if (!result.dailyGoodWebsites) {
            let startChecklist = {};
            for (let i = 0; i < goodWebsites.length; i++) {
                startChecklist[goodWebsites[i]] = false;
            }
            chrome.storage.local.set({dailyGoodWebsites: startChecklist}, () => {});
        }

        if (!result.dailyTasks) {
            chrome.storage.local.set({dailyTasks: []}, () => {});
        }

        if (!result.enabledSites) {
            chrome.storage.local.set({enabledSites: []}, () => {});
        }

        if (!result.daysOn) {
            chrome.storage.local.set({daysOn: 0}, () => {});
        }

        if (!result.storedRewards) {
            chrome.storage.local.set({storedRewards: []}, () => {})
        }

        if (!result.notepadContent) {
            chrome.storage.local.set({notepadContent: ""}, () => {})
        }

        if (!result.checklistTasks) {
            chrome.storage.local.set({checklistTasks: []}, () => {})
        }

        if (!result.darkMode) {
            chrome.storage.local.set({darkMode: false}, () => {})
        }

        if (!result.rewardOptions) {
            chrome.storage.local.set({rewardOptions: []}, () => {})
        }
    });
}
setVariables();

// Initialize dark mode
chrome.storage.local.get(["darkMode"], result => {
    if (result.darkMode) {
        document.querySelectorAll("body, #main-content, h2, h3, h4, h5, h6, a").forEach(element => {
            element.classList.add("dark-mode");
        })
    }
    document.querySelectorAll("button.btn-close").forEach(element => {
        element.classList.add("btn-close-white");
    });
});

let givePoints = (points, updateDaily = true, giveAlert = false) => {
    if (updateDaily) {
        chrome.storage.local.get(["dailyPoints"], (results) => {
            if (Object.keys(results).length > 0) {
                let updatedPoints = results.dailyPoints + points;
                chrome.storage.local.set({dailyPoints: updatedPoints}, () => {
                    if (giveAlert) {
                        alert(`You now have ${updatedPoints} daily points. Keep up the good work!`);
                    }
                });
            } else {
                chrome.storage.local.set({dailyPoints: points}, () => {
                    if (giveAlert) {
                        alert(`You now have ${points} daily points. Keep up the good work!`);
                    }
                });
            }
        });
    }

    chrome.storage.local.get(["allPoints"], (results) => {
        if (Object.keys(results).length > 0) {
            let updatedPoints = results.allPoints + points;
            chrome.storage.local.set({allPoints: updatedPoints}, () => {});
        } else {
            chrome.storage.local.set({allPoints: points}, () => {});
        }
    });
}

const initializeDarkMode = () => {
    chrome.storage.local.get(["darkMode"], result => {
        if (result.darkMode) {
            document.querySelectorAll("body, #main-content, h2, h3, h4, h5, h6, a").forEach(element => {
                element.classList.add("dark-mode");
            });
            document.querySelectorAll("button.btn-close").forEach(element => {
                element.classList.add("btn-close-white");
            });
        }
    });
}