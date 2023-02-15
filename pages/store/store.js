chrome.storage.local.get(["rewardOptions"], (result) => {
    if (!result.rewardOptions) {
        chrome.storage.local.set({rewardOptions: []}, () => {});
        return;
    } else {
        let sortedRewardOptions = result.rewardOptions.sort((a, b) => a.price - b.price);

        for (let i = 0; i < sortedRewardOptions.length; i++) {
            let rewardNode = new DOMParser().parseFromString(
                `<div class="reward-item vstack text-center">
                    <p style="margin: 0;">${sortedRewardOptions[i].name}</p>
                    <button class="buy" 
                        price="${sortedRewardOptions[i].price}" action-reward="${sortedRewardOptions[i].name}"
                    >Buy for ${sortedRewardOptions[i].price} Points</button>
                </div>`,
                "text/html"
            ).children[0].children[1].children[0];

            rewardNode.children[1].addEventListener("click", (evt) => {
                let storePrice = sortedRewardOptions[i].price;
                let actionReward = sortedRewardOptions[i].name;
                purchase(storePrice, () => {
                    chrome.storage.local.get(["storedRewards"], (result) => {
                        if (Object.keys(result).length < 1) {
                            chrome.storage.local.set({storedRewards: [actionReward]}, () => {
                                alert("Action reward purchased!");
                            });
                        } else {
                            chrome.storage.local.set({storedRewards: [
                                ...result.storedRewards, actionReward
                            ]}, () => {
                                alert("Action reward purchased!");
                            });
                        }
                    });
                });
            })

            document.getElementById("reward-options").appendChild(rewardNode);
        }
    }
});

const updatePoints = () => {
    chrome.storage.local.get(["allPoints"], (pointsObj) => {
        document.getElementById("allPoints").innerText = `${pointsObj.allPoints}`;
    });
}
updatePoints();

const invButton = document.createElement("button", {});
invButton.classList.add("use-item");
invButton.classList.add("m-2");
let lastItemState = ["non-existent item"];

const updateInventory = () => {
    chrome.storage.local.get(["storedRewards"], (result) => {
        if (JSON.stringify(lastItemState) !== JSON.stringify(result.storedRewards)) {
            while (document.getElementById("inventory-items").lastElementChild) {
                document.getElementById("inventory-items").removeChild(
                    document.getElementById("inventory-items").lastElementChild
                );
            }

            if (JSON.stringify(result.storedRewards) === JSON.stringify([])) {
                let emptyInvElement = document.createElement("p");
                emptyInvElement.textContent = "You do not have any items.";
                document.getElementById("inventory-items").append(emptyInvElement);
            } else {
                const uniqueInvItems = result.storedRewards.filter((value, index, self) => {
                    return self.indexOf(value) === index;
                });
            
                let buttonData = uniqueInvItems.map(item => {
                    return {
                        item: item,
                        qty: result.storedRewards.filter(reward => reward === item).length
                    }
                });
                
                buttonData.forEach(item => {
                    const invButtonClone = invButton.cloneNode();
                    invButtonClone.innerText = `${item.item} (${item.qty})`;
                    invButtonClone.setAttribute("action-reward", item.item);
                    document.getElementById("inventory-items").append(invButtonClone);
    
                    invButtonClone.addEventListener("click", (evt) => {
                        if (confirm("Are you sure you want to use this reward?")) {
                            let rewardName = parseInt(invButtonClone.getAttribute("action-reward"));
                            chrome.storage.local.get(["storedRewards"], (result) => {
                                let updatedRewards = JSON.parse(JSON.stringify(result.storedRewards));
                                updatedRewards.splice(result.storedRewards.indexOf(rewardName), 1);
                                chrome.storage.local.set({storedRewards: updatedRewards}, () => {
                                    alert("Item used.");
                                });
                            });
                        }
                    });
                });
            }

            lastItemState = result.storedRewards;
        }
    });
}
updateInventory();
setInterval(updateInventory, 3000);

let purchase = (cost, give) => {
    chrome.storage.local.get(["allPoints"], (pointObj) => {
        if (pointObj.allPoints >= cost) {
            chrome.storage.local.get(["allPoints"], (pointsObjToUpdate) => {
                let spentPoints = pointsObjToUpdate.allPoints - cost;
                chrome.storage.local.set({allPoints: spentPoints}, () => {
                    give();
                    updatePoints();
                });
            });
        } else {
            alert("You do not have enough points for that reward.");
        }
    });
}