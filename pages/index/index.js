setVariables();

const displayPoints = () => {
    chrome.storage.local.get(["allPoints"], (pointsObj) => {
        document.getElementById("allPoints").innerText = `${pointsObj.allPoints}`;
    });
}
displayPoints();

// Show activated menu buttons
let updateMenuButtons = () => {
    let menuButton = document.createElement("button");
    menuButton.classList.add("menu");
    
    chrome.storage.local.get(["menuButtons"], result => {
        let sortedButtons = result.menuButtons.sort((mb1, mb2) => mb1.importance - mb2.importance);

        for (let i = sortedButtons.length - 1; i > -1; i--) {
            if (sortedButtons[i].checked) {
                let buttonToPrepend = menuButton.cloneNode();
                buttonToPrepend.innerText = sortedButtons[i].buttonText;
                buttonToPrepend.addEventListener("click", evt => {
                    chrome.tabs.create({
                        url: sortedButtons[i].pageURL
                    })
                })
                document.getElementById("menu-button-div").prepend(buttonToPrepend);
            }
        }
    });
}
updateMenuButtons();

// Open tabs when clicking menu buttons
document.querySelectorAll("button.menu").forEach(button => {
    button.addEventListener("click", evt => {
        chrome.tabs.create({
            url: button.getAttribute("page-url")
        })
    });
});