chrome.storage.local.get(["dailyTasks"], (result) => {
    if (!result.dailyTasks) {
        chrome.storage.local.set({dailyTasks: []}, () => {});
    } else {
        for (let i = 0; i < result.dailyTasks.length; i++) {
            let dailyTaskNode = new DOMParser().parseFromString(
                `<div class="daily-task hstack">
                    <button type="button" daily-task="${result.dailyTasks[i].taskName}" class="delete-task btn-close float-start">
                    </button>
                    <label class="form-check-label">
                        ${result.dailyTasks[i].taskName}
                    </label>
                </div>`,
                "text/html"
            ).children[0].children[1].children[0];

            dailyTaskNode.children[0].addEventListener("click", evt => {
                chrome.storage.local.get(["dailyTasks"], result => {
                    chrome.storage.local.set({
                        dailyTasks: result.dailyTasks.filter(
                            dailyTask => dailyTask.taskName.toLowerCase() !== dailyTaskNode
                                .children[0]
                                .getAttribute("daily-task")
                                .toLowerCase()
                        )
                    }, () => {});
                });
                dailyTaskNode.remove();
            })

            document.getElementById("daily-tasks-list").appendChild(dailyTaskNode);
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
document.getElementById("add-daily-task-btn").addEventListener("click", evt => {
    chrome.storage.local.get(["dailyTasks"], (result) => {
        chrome.storage.local.set(
            {dailyTasks: [
                ...result.dailyTasks,
                {
                    taskName: document.getElementById("add-daily-task-input").value,
                    doneToday: false
                }
            ]},
            () => {
                window.alert("Task added to daily tasks.");

                let addedTaskName = document.getElementById("add-daily-task-input").value;
                let dailyTaskNode = new DOMParser().parseFromString(
                    `<div class="daily-task hstack">
                        <button type="button" daily-task="${addedTaskName}" class="delete-task btn-close float-start">
                        </button>
                        <label class="form-check-label">
                            ${addedTaskName}
                        </label>
                    </div>`,
                    "text/html"
                ).children[0].children[1].children[0];

                dailyTaskNode.children[0].addEventListener("click", evt => {
                    chrome.storage.local.get(["dailyTasks"], result => {
                        chrome.storage.local.set({
                            dailyTasks: result.dailyTasks.filter(
                                dailyTask => dailyTask.taskName.toLowerCase() !== addedTaskName
                                    .toLowerCase()
                            )
                        }, () => {});
                    });
                    dailyTaskNode.remove();
                })
    
                document.getElementById("daily-tasks-list").appendChild(dailyTaskNode);
                document.getElementById("add-daily-task-input").value = "";
                initializeDarkMode();
            }
        );
    });
});

initializeDarkMode();