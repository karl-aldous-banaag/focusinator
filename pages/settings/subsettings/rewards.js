chrome.storage.local.get(["rewardOptions"], (result) => {
    if (!result.rewardOptions) {
        chrome.storage.local.set({rewardOptions: []}, () => {});
    } else {
        let sortedRewardOptions = result.rewardOptions.sort((a, b) => b.price - a.price);

        for (let i = 0; i < sortedRewardOptions.length; i++) {
            let rewardNode = new DOMParser().parseFromString(
                `<div class="reward-name hstack">
                    <button type="button" reward-name="${sortedRewardOptions[i].name}"
                        class="delete-task btn-close float-start">
                    </button>
                    <label class="form-check-label">
                        <code>[${sortedRewardOptions[i].price} points]</code> ${sortedRewardOptions[i].name}
                    </label>
                </div>`,
                "text/html"
            ).children[0].children[1].children[0];

            rewardNode.children[0].addEventListener("click", evt => {
                chrome.storage.local.get(["rewardOptions"], result => {
                    chrome.storage.local.set({
                        rewardOptions: result.rewardOptions.filter(
                            rewardOption => rewardOption.name.toLowerCase() !== rewardNode
                                .children[0]
                                .getAttribute("reward-name")
                                .toLowerCase()
                        )
                    }, () => {});
                });
                rewardNode.remove();
            })

            document.getElementById("rewards-list").appendChild(rewardNode);
        }
    }

    // Remove words when deleted
    document.querySelectorAll("button.delete-task").forEach(button => {
        button.addEventListener("click", evt => {
            button.parentNode.remove();
        })
    });
});

// Add daily task
document.getElementById("add-reward-btn").addEventListener("click", evt => {
    chrome.storage.local.get(["rewardOptions"], (result) => {
        chrome.storage.local.set(
            {rewardOptions: [
                ...result.rewardOptions,
                {
                    name: document.getElementById("add-reward-name-input").value,
                    price: JSON.parse(document.getElementById("add-reward-price-input").value)
                }
            ]},
            () => {
                window.alert("Reward added to store.");

                let addedRewardName = document.getElementById("add-reward-name-input").value;
                let addedRewardPrice = document.getElementById("add-reward-price-input").value;
                let rewardNode = new DOMParser().parseFromString(
                    `<div class="reward-name hstack">
                        <button type="button" reward-name="${addedRewardName}"
                            class="delete-task btn-close float-start">
                        </button>
                        <label class="form-check-label">
                            <code>[${addedRewardPrice} points]</code> ${addedRewardName}
                        </label>
                    </div>`,
                    "text/html"
                ).children[0].children[1].children[0];

                rewardNode.children[0].addEventListener("click", evt => {
                    chrome.storage.local.get(["rewardOptions"], result => {
                        chrome.storage.local.set({
                            rewardOptions: result.rewardOptions.filter(
                                rewardOption => rewardOption.name.toLowerCase() !== addedRewardName
                                    .toLowerCase()
                            )
                        }, () => {});
                    });
                    rewardNode.remove();
                })
    
                document.getElementById("rewards-list").appendChild(rewardNode);
                document.getElementById("add-reward-name-input").value = '';
                document.getElementById("add-reward-price-input").value = '';
                initializeDarkMode();
            }
        );
    });
});

initializeDarkMode();