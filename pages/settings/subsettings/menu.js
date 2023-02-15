// Initialize elements for toggling main menu buttons
chrome.storage.local.get(["menuButtons"], result => {
    for (let i = 0; i < result.menuButtons.length; i++) {
        let btnQuery = `input[button-text='${result.menuButtons[i].buttonText}']`;
        console.log(btnQuery);
        document.querySelector(btnQuery).checked = result.menuButtons[i].checked;
    }
});

// Toggle main menu buttons
let updateMenuButtons = () => {
    let updatedMenuButtonObj = [];
    document.querySelectorAll("input.form-check-input.menu-input").forEach(input => {
        updatedMenuButtonObj.push({
            buttonText: input.getAttribute("button-text"),
            pageURL: input.getAttribute("page-url"),
            checked: input.checked,
            importance: parseInt(input.getAttribute("importance"))
        });
    });
    chrome.storage.local.set({menuButtons: updatedMenuButtonObj}, () => {});
}

document.getElementById("menu-button").addEventListener("click", evt => {
    updateMenuButtons();
});