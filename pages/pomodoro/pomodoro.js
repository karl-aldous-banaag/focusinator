let rounds = 0;
let stage = "work";
let secsTillFinish = 60 * 25;
let activated = false;

let intervalCountdown;

if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

const displayTime = () => {
    document.getElementById("mins").textContent = JSON.stringify(Math.floor(secsTillFinish / 60));
    document.getElementById("secs").textContent = JSON.stringify(secsTillFinish % 60);
    if (document.getElementById("secs").textContent.length < 2) {
        document.getElementById("secs").textContent = '0' + document.getElementById("secs").textContent;
    }
}

const processTimerEnd = () => {
    activated = false;

    let notifBody = "";
    if (stage === "work") {notifBody = "Let's take a break." }
    if (stage === "break") { notifBody = "Let's get to work." }

    if (Notification.permission === "granted") {
        new Notification("Timer Ended", {
            body: notifBody
        });
    }

    if (stage === "work") {
        stage = "break";
        if (rounds % 4 == 3) {
            secsTillFinish = 60 * 15;
        } else {
            secsTillFinish = 60 * 5;
        }
    } else if (stage === "break") {
        stage = "work";
        secsTillFinish = 60 * 25;
    }

    if (stage === "work") {
        rounds += 1;
        document.getElementById("round-number").textContent = JSON.stringify(rounds);
    }
    
    document.getElementById("timer-button").textContent = "Start Timer";
    displayTime();

    if (stage === "work") {
        document.getElementById("stage-label").textContent = "Work";
    } else {
        document.getElementById("stage-label").textContent = "Break";
    }
}

document.getElementById("timer-button").addEventListener("click", evt => {
    activated = !activated;

    if (activated) {
        document.getElementById("timer-button").textContent = "Pause Timer";
        intervalCountdown = setInterval(() => {
            secsTillFinish -= 1;
            displayTime();

            if (secsTillFinish <= 0) {
                clearInterval(intervalCountdown);
                processTimerEnd();
            }
        }, 1000);
    } else {
        document.getElementById("timer-button").textContent = "Resume Timer";
        clearInterval(intervalCountdown);
    }
})

document.getElementById("reset-button").addEventListener("click", evt => {
    rounds = 0;
    stage = "work";
    secsTillFinish = 60 * 25;
    activated = false;

    displayTime();
    document.getElementById("stage-label").textContent = "Work";
    document.getElementById("round-number").textContent = JSON.stringify(0);
});