const createNewCategory = (categoryName) => {
    return new DOMParser().parseFromString(
`<div class="m-3 task-category-div" task-category="${categoryName}">
    <h3 class="text-center">${categoryName}</h3>
    <div class="task-category-items"></div>
    <div class="m-2 text-center">
        <button class="add-task-btn" task-category="${categoryName}">Add Task</button>
        <input class="add-task-input" task-category="${categoryName}" type="text">
    </div>
</div>`
    ,
        "text/html"
    ).children[0].children[1].children[0];
};

const createNewTask = (categoryName, taskName, completed) => {
    return new DOMParser().parseFromString(
`<div class="form-check">
    <input class="form-check-input" type="checkbox"
        task-name="${taskName}" task-category="${categoryName}"
        ${( () => { if (completed) { return "checked" } else { return '' } } )()}
    ></input>
    <label class="form-check-label">
        ${taskName}
    </label>
    <button type="button" class="delete-task btn-close float-end"
        task-name="${taskName}" task-category="${categoryName}"
    ></button>
</div>`
        ,
        "text/html"
    ).children[0].children[1].children[0];
}

document.getElementById("create-category").addEventListener("click", evt => {
    let categoryName = prompt("Enter category name:");
    if (!categoryName) { return; }

    let firstTask = prompt("Please write the first task for this category.");
    if (!firstTask) { return; }

    chrome.storage.local.get(["checklistTasks"], result => {
        chrome.storage.local.set(
            {checklistTasks: [...result.checklistTasks, {
                name: firstTask,
                category: categoryName,
                completed: false
            }]}, () => {
                alert("Category added.");
                location.reload();
            });
    });
});

document.getElementById("collect-rewards").addEventListener("click", evt => {
    if (confirm("Are you sure you want to get your rewards?")) {
        chrome.storage.local.get(["checklistTasks"], result => {
            let allTasksLength = result.checklistTasks.length;
            let remainingTasks = result.checklistTasks.filter(task => !task.completed);

            chrome.storage.local.set({checklistTasks: remainingTasks}, () => {
                givePoints((allTasksLength - remainingTasks.length) * 5, false, false);
                alert("Rewards collected");
                location.reload();
            });
         });
    }
});

chrome.storage.local.get(["checklistTasks"], result => {
    if (Object.keys(result).length < 1) {
        chrome.storage.local.set({checklistTasks: []}, () => {});
    } else {
        let checklistTasks = result.checklistTasks;

        let checklistCategories = checklistTasks.map(task => task.category);
        checklistCategories = checklistCategories.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        checklistTasks.sort((task1, task2) => task1.importance - task2.importance);

        for (let i = 0; i < checklistCategories.length; i++) {
            let categoryTasks = checklistTasks.filter(task => task.category === checklistCategories[i]);

            let category = createNewCategory(checklistCategories[i]);
            for (let j = 0; j < categoryTasks.length; j++) {
                let taskNode = createNewTask(
                    checklistCategories[i],
                    categoryTasks[j].name,
                    categoryTasks[j].completed
                );
                taskNode.addEventListener("click", evt => {
                    chrome.storage.local.get(["checklistTasks"], result => {
                        let updatedChecklistTasks = result.checklistTasks;

                        document.querySelectorAll(
                            `input[class="form-check-input"][type="checkbox"]`
                        ).forEach(button => {
                            let btnTaskName = button.getAttribute("task-name");
                            let btnTaskCat  = button.getAttribute("task-category");

                            updatedChecklistTasks.find(
                                task => (task.name === btnTaskName) && (task.category === btnTaskCat)
                            ).completed = button.checked;
                        });

                        chrome.storage.local.set({checklistTasks: updatedChecklistTasks}, () => {});

                        if (evt.target.tagName.toLowerCase() === "button") {
                            let btnTaskName = evt.target.getAttribute("task-name");
                            let btnTaskCat  = evt.target.getAttribute("task-category");

                            if (confirm("Are you sure you want to delete this task?")) {
                                chrome.storage.local.get(["checklistTasks"], result => {
                                    chrome.storage.local.set({
                                        checklistTasks: result.checklistTasks.filter((task) => {
                                            return !((task.name === btnTaskName) && (task.category === btnTaskCat))
                                        })
                                    }, () => { location.reload(); })
                                });
                            }
                        }
                    });
                })
                category.childNodes[3].appendChild(taskNode)
            }
            document.getElementById("all-tasks").appendChild(category);
        }

        document.querySelectorAll("button.add-task-btn").forEach(button => {
            button.addEventListener("click", evt => {
                let categoryName = button.getAttribute("task-category");
                let taskName = 
                    document.querySelector(`input.add-task-input[task-category="${categoryName}"]`).value;

                chrome.storage.local.get(["checklistTasks"], result => {
                    chrome.storage.local.set(
                        {checklistTasks: [...result.checklistTasks, {
                            name: taskName,
                            category: categoryName,
                            completed: false
                        }]}, () => {
                            alert("Task added.");
                            location.reload();
                        });
                });
            });
        });
    }
});

// Initialize dark mode
chrome.storage.local.get(["darkMode"], result => {
    if (result.darkMode) {
        document.querySelectorAll("body, #main-content, h2, h3, h4, h5, h6, a").forEach(element => {
            element.classList.add("dark-mode");
        });
        document.querySelectorAll("button.btn-close").forEach(element => {
            element.classList.add("btn-close-white");
        });
    }
});