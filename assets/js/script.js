var pageContentE1 = document.querySelector("#page-content");
var taskIDCounter = 0;
var formE1 = document.querySelector('#task-form')
var tasksToDoE1 = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //check to see if the input values have empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formE1.reset();

    var isEdit = formE1.hasAttribute("data-task-id");
    // has data attribute, so get the task id and call function to complete the editing process
    if (isEdit) {
        var taskId = formE1.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    //no data attribute, so create object as normal and pass to createtaskide1 function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }

        createTaskEl(taskDataObj);
    }

};

var createTaskEl = function(taskDataObj) {
    //create list item
    var listItemE1 = document.createElement("li");
    listItemE1.className = "task-item";

    // adding task id as a custom attribute
    listItemE1.setAttribute("data-task-id", taskIDCounter);

    //create div to hold the task info and add to the list item
    var taskInfoE1 = document.createElement("div");
    //provide a class name
    taskInfoE1.className = "task-info";
    //add the HTML content to div
    taskInfoE1.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class ='task-type'>" + taskDataObj.type + "</span>";
    
    var taskActionsE1 = createTaskActions(taskIDCounter);
    listItemE1.appendChild(taskActionsE1);
    
    listItemE1.appendChild(taskInfoE1);
    taskDataObj.id = taskIDCounter;

    tasks.push(taskDataObj);

    saveTasks();
    
    //adds the entire list item to list
    tasksToDoE1.appendChild(listItemE1);

    //To increase task counter for next unique id
    taskIDCounter++;
    console.log(taskDataObj);
    console.log(taskDataObj.status);
};

var createTaskActions = function(taskID) {
    var actionContainerE1 = document.createElement("div");
    actionContainerE1.className = "task-actions";

    //create edit button
    var editButtonE1 = document.createElement("button");
    editButtonE1.textContent = "Edit";
    editButtonE1.className = "btn edit-btn";
    editButtonE1.setAttribute("data-task-id", taskID);
    actionContainerE1.appendChild(editButtonE1);

    //create delete button
    var deleteButtonE1 = document.createElement("button");
    deleteButtonE1.textContent = "Delete";
    deleteButtonE1.className = "btn delete-btn";
    deleteButtonE1.setAttribute("data-task-id", taskID);
    actionContainerE1.appendChild(deleteButtonE1);

    //drop down select
    var statusSelectE1 = document.createElement("select");
    statusSelectE1.className = "select-status";
    statusSelectE1.setAttribute("name", "status-change");
    statusSelectE1.setAttribute("data-task-id", taskID);
    actionContainerE1.appendChild(statusSelectE1);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionE1 = document.createElement("option");
        statusOptionE1.textContent = statusChoices[i];
        statusOptionE1.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectE1.appendChild(statusOptionE1);
    }

    return actionContainerE1;
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");

    saveTasks();

    formE1.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var taskButtonHandler = function(event) {
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
      }
};

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based ont he id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "'");

    if (statusValue === "to do") {
        tasksToDoE1.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    //update the tasks in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

var editTask = function(taskId) {
    console.log(taskId);
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    console.log(taskSelected);
  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);
  // write values of taskname and taskType to form to be edited
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formE1.setAttribute("data-task-Id", taskId);
};

var deleteTask = function(taskId) {
    console.log(taskId);
    // find task list element with taskId value and remove it
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through the current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of the taskId, keep the task and push it to a new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArray
    tasks = updatedTaskArr;
    saveTasks();
  };

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

formE1.addEventListener("submit", taskFormHandler);
pageContentE1.addEventListener("click", taskButtonHandler);
pageContentE1.addEventListener("change", taskStatusChangeHandler);