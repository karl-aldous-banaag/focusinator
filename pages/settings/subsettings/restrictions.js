chrome.storage.local.get(["bannedWebsites", "blacklistWords"], (result) => {
    if (!result.bannedWebsites) {
        chrome.storage.local.set({bannedWebsites: []}, () => {});
    } else {
        for (let i = 0; i < result.bannedWebsites.length; i++) {
            let bannedWebsiteNode = new DOMParser().parseFromString(
                `<div class="banned-website hstack">
                    <button type="button" banned-website="${result.bannedWebsites[i]}" class="delete-task btn-close float-start">
                    </button>
                    <p></p>
                    <label class="form-check-label">
                        ${result.bannedWebsites[i]}
                    </label>
                </div>`,
                "text/html"
            ).children[0].children[1].children[0];

            bannedWebsiteNode.children[0].addEventListener("click", evt => {
                chrome.storage.local.get(["bannedWebsites"], result => {
                    chrome.storage.local.set({
                        bannedWebsites: result.bannedWebsites.filter(
                            website => website !== bannedWebsiteNode
                                .children[0]
                                .getAttribute("banned-website")
                                .toLowerCase()
                        )
                    }, () => {});
                });
            })

            document.getElementById("banned-websites-list").appendChild(bannedWebsiteNode);
        }
    }

    if (!result.blacklistWords) {
        chrome.storage.local.set({blacklistWords: []}, () => {});
    } else {
        for (let i = 0; i < result.blacklistWords.length; i++) {
            let blacklistWordNode = new DOMParser().parseFromString(
                `<div class="blacklist-word hstack">
                    <button type="button" blacklist-word="${result.blacklistWords[i]}" class="delete-task btn-close float-start">
                    </button>
                    <p></p>
                    <label class="form-check-label">
                        ${result.blacklistWords[i]}
                    </label>
                </div>`,
                "text/html"
            ).children[0].children[1].children[0];

            blacklistWordNode.children[0].addEventListener("click", evt => {
                chrome.storage.local.get(["blacklistWords"], result => {
                    chrome.storage.local.set({
                        blacklistWords: result.blacklistWords.filter(
                            website => website !== blacklistWordNode
                                .children[0]
                                .getAttribute("blacklist-word")
                                .toLowerCase()
                        )
                    }, () => {});
                });
            })

            document.getElementById("blacklist-words-list").appendChild(blacklistWordNode);
        }
    }

    // Remove words when deleted
    document.querySelectorAll("button.delete-task").forEach(button => {
        button.addEventListener("click", evt => {
            button.parentNode.remove();
        })
    });
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

// Add Banned Website
document.getElementById("add-banned-website-btn").addEventListener("click", evt => {
    chrome.storage.local.get(["bannedWebsites"], (result) => {
        chrome.storage.local.set(
            {bannedWebsites: [
                ...result.bannedWebsites,
                document.getElementById("add-banned-website-input").value.toLowerCase()
            ]},
            () => {
                window.alert("Website added to banned websites.");
                location.reload();
            }
        );
    });
});

// Add Blacklist Word
document.getElementById("add-blacklist-words-btn").addEventListener("click", evt => {
    chrome.storage.local.get(["blacklistWords"], (result) => {
        chrome.storage.local.set(
            {blacklistWords: [
                ...result.blacklistWords,
                document.getElementById("add-blacklist-words-input").value.toLowerCase()
            ]},
            () => {
                window.alert("Blacklist word added to blacklist words.");

                let blacklistWord = document
                    .getElementById("add-blacklist-words-input")
                    .value
                    .toLowerCase();
                let blacklistWordNode = new DOMParser().parseFromString(
                    `<div class="blacklist-word hstack">
                        <button type="button" blacklist-word="${blacklistWord}" class="delete-task btn-close float-start">
                        </button>
                        <p></p>
                        <label class="form-check-label">
                            ${blacklistWord}
                        </label>
                    </div>`,
                    "text/html"
                ).children[0].children[1].children[0];
    
                blacklistWordNode.children[0].addEventListener("click", evt => {
                    chrome.storage.local.get(["blacklistWords"], result => {
                        chrome.storage.local.set({
                            blacklistWords: result.blacklistWords.filter(
                                website => website !== blacklistWord
                            )
                        }, () => {});
                    });

                    evt.target.parentNode.remove();
                });
    
                document.getElementById("blacklist-words-list").appendChild(blacklistWordNode);
                document.getElementById("add-blacklist-words-input").value = '';
                initializeDarkMode();
            }
        );
    });
});

initializeDarkMode();