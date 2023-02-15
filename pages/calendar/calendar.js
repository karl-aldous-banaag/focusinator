let today = new Date();

const dayNumber = (number) => {
    return new DOMParser().parseFromString(
`<h6>${number}</h6>`
    ,
        "text/html"
    ).children[0].children[1].children[0];
};

const setCalendarVals = () => {
    document.getElementById("month-name").innerText = `${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`

    const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    ).getDate();
    const startingDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1, 
        -(today.getTimezoneOffset() / 60), 0, 0
    ).getDay();

    for (let i = 1; i <= 42; i++) {
        document.getElementById(`day-${i}`).innerHTML = "";
    }

    for (let i = 1; i <= daysInMonth; i++) {
        console.log(`day-${i + startingDay}`);
        document.getElementById(`day-${i + startingDay}`).appendChild(dayNumber(i));
    }

    if (today.getMonth() == new Date().getMonth()) {
        document.getElementById(`day-${today.getDate() + startingDay}`).children[0].classList.add("circle");
    }

    initializeDarkMode();
}
setCalendarVals();

// Day Names
const shortDayNames = () => {
    const ths = document.querySelectorAll("th");;
    ths[0].innerText = "S";
    ths[1].innerText = "M";
    ths[2].innerText = "T";
    ths[3].innerText = "W";
    ths[4].innerText = "Th";
    ths[5].innerText = "F";
    ths[6].innerText = "S";
}

const mediumDayNames = () => {
    const ths = document.querySelectorAll("th");;
    ths[0].innerText = "Sun";
    ths[1].innerText = "Mon";
    ths[2].innerText = "Tue";
    ths[3].innerText = "Wed";
    ths[4].innerText = "Thu";
    ths[5].innerText = "Fri";
    ths[6].innerText = "Sat";
}

const longDayNames = () => {
    const ths = document.querySelectorAll("th");;
    ths[0].innerText = "Sunday";
    ths[1].innerText = "Monday";
    ths[2].innerText = "Tuesday";
    ths[3].innerText = "Wednesday";
    ths[4].innerText = "Thursday";
    ths[5].innerText = "Friday";
    ths[6].innerText = "Saturday";
}

const resizeDayNames = () => {
    if (window.innerWidth > 720) { longDayNames(); }
    else if ((window.innerWidth > 440) && (window.innerWidth < 720)) { mediumDayNames(); }
    else { shortDayNames(); }
}

document.querySelectorAll("i.arrow").forEach(mc => {
    mc.addEventListener("click", evt => {
        let calendarMonth = today.getMonth();
        calendarMonth += parseInt(mc.getAttribute("month-change"));
        today.setMonth(calendarMonth);
        setCalendarVals();
    })
});

window.addEventListener("DOMContentLoaded", resizeDayNames);
window.addEventListener("resize", resizeDayNames);