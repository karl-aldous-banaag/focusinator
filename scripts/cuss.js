const cussWords = [
    "cuck", "tard", "fuck", "dick", 
    "pussy", "incel", "bitch", "slut", 
    "cunt", "shit", "nigga", "nigger", 
    "moron", "stupid"
];

let getLastWord = (bigString) => { return bigString.toLowerCase().split(' ').pop(); }
let cussAlert = (cussWord) => { alert(`Bad word ${cussWord} found. Please think about what you're typing.`); }
let removeCussWord = (bigString, cussWord) => {
    let cussIndex = bigString.toLowerCase().indexOf(cussWord);
    let firstPart = bigString.slice(0, cussIndex);
    let lastPart = bigString.slice(cussIndex + cussWord.length, bigString.length);
    return firstPart + lastPart;
}

document.addEventListener("keyup", evt => {
    let lastWord = "";
    if (evt.target.tagName.toLowerCase() === "input") {
        lastWord = getLastWord(evt.target.value);
    } else {
        lastWord = getLastWord(evt.target.textContent);
    }

    let foundCussWord = cussWords.find(
        cussWord => lastWord.includes(cussWord)
    );
    
    if (foundCussWord) {
        cussAlert(foundCussWord);

        if (evt.target.tagName.toLowerCase() === "input") {
            evt.target.value = removeCussWord(evt.target.value, foundCussWord);
        }

        let allOfThatElement = document.querySelectorAll(evt.target.tagName);
        for (let i = 0; i < allOfThatElement.length; i++) {
            let origString = allOfThatElement[i].innerHTML;
            if (!origString.toLowerCase().includes(foundCussWord)) {
                continue;
            } else {
                let origString = allOfThatElement[i].innerHTML;
                allOfThatElement[i].innerHTML = removeCussWord(origString, foundCussWord);
                break;
            }
        }
    }
});