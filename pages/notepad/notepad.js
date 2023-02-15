chrome.storage.local.get(["notepadContent"], (result) => {
    if (Object.keys(result).length > 0) {
        document.getElementById("notepad-text-area").value = result.notepadContent;
    }
});

document.addEventListener("keydown", evt => {
    chrome.storage.local.set({
        notepadContent: document.getElementById("notepad-text-area").value
    }, () => {});
})