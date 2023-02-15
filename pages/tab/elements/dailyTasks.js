const loadDailyTasksOnTab = () => {
    // Process Daily Tasks
    chrome.storage.local.get(["dailyTasks"], (result) => {
        for (let i = 0; i < result.dailyTasks.length; i++) {
            let dailyTaskNode = new DOMParser().parseFromString(
                `<div class="form-check" daily-task="${result.dailyTasks[i].taskName}">
                    <input daily-task="${result.dailyTasks[i].taskName}"
                        class="form-check-input" type="checkbox"
                        ${result.dailyTasks[i].doneToday ? "checked": ''}
                    >
                    <label class="form-check-label checkbox-inline">
                        ${result.dailyTasks[i].taskName}
                    </label>
                </div>`,
                "text/html"
            ).children[0].children[1].children[0];

            dailyTaskNode.addEventListener("click", evt => {
                chrome.storage.local.get(["dailyTasks"], (result) => {
                    let dtCopy = JSON.parse(JSON.stringify(result.dailyTasks));
                    dtCopy[i].doneToday = dailyTaskNode.children[0].checked;

                    chrome.storage.local.set({dailyTasks: dtCopy}, () => {});
                });
            });

            document.getElementById("daily-tasks").appendChild(dailyTaskNode);
        }
    });

    document.getElementById("daily-tasks").addEventListener("click", (evt) => {
        let checkedTasks = [];
        const formCheckDivs = document.getElementById("daily-tasks").children;
        for (let i = 0; i < formCheckDivs.length; i++) {
            checkedTasks.push({
                taskName: formCheckDivs[i].children[1].textContent.trim(),
                doneToday: formCheckDivs[i].children[0].checked
            });
        }

        chrome.storage.local.set({dailyTasks: checkedTasks}, () => {});
    });
}