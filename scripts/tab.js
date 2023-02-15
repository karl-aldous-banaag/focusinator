const setVariables = () => {
    chrome.storage.local.get([
        "menuButtons", "allPoints", "lastDayChecked",
        "dailyPoints", "dailyGoodWebsites", "dailyTasks",
        "enabledSites", "daysOn", "storedRewards",
        "notepadContent", "checklistTasks", "bannedWebsites"
    ], (result) => {
        if (!result.menuButtons) {
            chrome.storage.local.set({menuButtons: {}}, () => {});
        }

        if (!result.allPoints) {
            chrome.storage.local.set({allPoints: 0}, () => {});
        }

        if (!result.lastDayChecked) {
            chrome.storage.local.set({lastDayChecked: 0}, () => {});
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

        if (!result.bannedWebsites) {
            chrome.storage.local.set({bannedWebsites: []}, () => {})
        }
    });
}
setVariables();

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

chrome.runtime.onInstalled.addListener((reason) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({
            url: 'pages/tab/tab.html'
        });
    }
});


// Incentivize productivity
chrome.storage.local.get(["lastDayChecked"], (lastOpen) => {
    let dateObjToday = new Date();
    let dateString = `${dateObjToday.getMonth()+1}-${dateObjToday.getDate()}-${dateObjToday.getFullYear()}`;

    if (lastOpen.lastDayChecked !== dateString) {
        chrome.storage.local.set({lastDayChecked: dateString}, () => {
            chrome.storage.local.get(["daysOn"], (daysOnObj) => {
                alert(`You've kept this plugin on for ${daysOnObj.daysOn} day(s). Keep up the consistency!`);
                chrome.storage.local.set({daysOn: daysOnObj.daysOn + 1}, () => {});
            })
        });

        let startChecklist = {};
        for (let i = 0; i < goodWebsites.length; i++) { startChecklist[goodWebsites[i]] = false; }
        chrome.storage.local.set({dailyGoodWebsites: startChecklist}, () => {});
        chrome.storage.local.set({dailyPoints: 0}, () => {});

        chrome.storage.local.get(["dailyTasks"], (result) => {
            if (Object.keys(result).length > 0) {
                let tasksDone = result.dailyTasks.filter(task => task).length;
                givePoints(tasksDone * 5, false, false);
                chrome.storage.local.set({dailyTasks: []}, () => {});
            } else {
                chrome.storage.local.set({dailyTasks: []}, () => {});
            }
        });

        chrome.storage.local.get(["enabledSites"], (enabledSitesObj) => {
            if (Object.keys(enabledSitesObj).length < 1) {
                chrome.storage.local.set({
                    enabledSites: []
                }, () => {});
            } else {
                chrome.storage.local.set({
                    enabledSites: enabledSitesObj.enabledSites.filter(site => site.deadline > Date.now())
                }, () => {});
            }
        });
    }
});