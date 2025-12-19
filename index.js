const items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const template = document.getElementById("to-do__item-template");

let currentTasks = [];

function loadTasks() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks !== null) {
        return JSON.parse(savedTasks);
    } else {
        return items;
    }
}

function handleDeleteClick(event) {
  const listItem = event.currentTarget.closest(".to-do__item");
  listItem.remove();
  currentTasks = getTasksFromDOM();
  saveTasks(currentTasks);
}

function handleDuplicateClick(event) {
  const listItem = event.currentTarget.closest(".to-do__item");
  const textElement = listItem.querySelector(".to-do__item-text");
  const itemText = textElement.textContent;

  const newItem = createItem(itemText);
  listElement.prepend(newItem);

  currentTasks = getTasksFromDOM();
  saveTasks(currentTasks);
}

function handleEditClick(event) {
  const listItem = event.currentTarget.closest(".to-do__item");
  const textElement = listItem.querySelector(".to-do__item-text");

  textElement.setAttribute("contenteditable", "true");
  textElement.focus();
  textElement.select();
}

function handleTextBlur(event) {
  const textElement = event.currentTarget;
  textElement.setAttribute("contenteditable", "false");

  currentTasks = getTasksFromDOM();
  saveTasks(currentTasks);
}

function handleTextKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    event.currentTarget.blur();
  }
}

function createItem(itemText) {
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(
    ".to-do__item-button_type_duplicate"
  );
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = itemText;

  deleteButton.addEventListener("click", handleDeleteClick);
  duplicateButton.addEventListener("click", handleDuplicateClick);
  editButton.addEventListener("click", handleEditClick);
  textElement.addEventListener("blur", handleTextBlur);
  textElement.addEventListener("keydown", handleTextKeydown);

  return clone;
}

function getTasksFromDOM() {
  const itemsNamesElements = listElement.querySelectorAll(".to-do__item-text");
  const tasks = [];

  itemsNamesElements.forEach((element) => {
    const text = element.textContent;
    tasks.push(text);
  });

  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function handleFormSubmit(event) {
  event.preventDefault();

  const text = inputElement.value.trim();

  if (text === "") {
    return;
  }

  listElement.prepend(createItem(text));

  currentTasks = getTasksFromDOM();
  saveTasks(currentTasks);

  inputElement.value = "";
}
currentTasks = loadTasks();
currentTasks.forEach((item) => {
  const itemElement = createItem(item);
  listElement.append(itemElement);
});
formElement.addEventListener("submit", handleFormSubmit);
