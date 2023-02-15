setVariables();

const urlRegex = /(https?:\/\/)?(www\.)?.*?\..*/;

document.getElementById("search").addEventListener("keydown", (evt) => {
    let searchInput = document.getElementById("search").value;
    if ((evt.key === "Enter") && (!evt.shiftKey)) {
        if (urlRegex.test(searchInput)) {
            if (searchInput.startsWith("http://")) {
                window.location.href = searchInput;
            } else {
                window.location.href = `http://${searchInput}`;
            }
        } else {
            window.location.href =
                `https://www.google.com/search?q=${searchInput}&sourceid=chrome&ie=UTF-8`;
        }
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
                let tasksDone = result.dailyTasks.filter(task => task.doneToday).length;
                givePoints(tasksDone * 5, false, false);

                let dtCopy = JSON.parse(JSON.stringify(result.dailyTasks));
                for (let i = 0; i < dtCopy.length; i++) { dtCopy[i].doneToday = false; }
                chrome.storage.local.set({dailyTasks: dtCopy}, () => {
                    loadDailyTasksOnTab();
                });
            } else {
                chrome.storage.local.set({dailyTasks: []}, () => {
                    loadDailyTasksOnTab();
                });
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
    } else {
        loadDailyTasksOnTab();
    }
});

// Show points
chrome.storage.local.get(["allPoints"], result => {
    document.getElementById("all-points").innerText = `${result.allPoints}`;
});