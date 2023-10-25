//#region Initial Data Source
let todosList = [
  { title: "Play Tennis", statusCode: "1" },
  { title: "Deliver JS Assignment", statusCode: "1" },
  { title: "Learn New Techs", statusCode: "1" },
];
let starTodosList = [];
//#endregion



//#region Evaluate Status
const getStatus = (statusCode) =>
  statusCode === "1"
    ? { status: "Not started", color: "bg-danger" }
    : statusCode === "2"
    ? { status: "In progress", color: "bg-primary" }
    : { status: "Done", color: "bg-success" };
//#endregion

//#region Create Todo List Item

let createTodos = (todo, isStarred, statusColor) => {
  const starItem = isStarred ? "favourite" : "notFavourite";
  return `<li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="col-md-5">
              <span class="todoName">${todo.title}</span>
            </div>
            <div class="col-md-7 d-flex justify-content-start pl-5">
                <span class="badge ${statusColor} currentStatus mx-1">${
                getStatus(todo.statusCode).status
                }</span>
                <select class="form-control-sm border-dark statusSelect mx-1">
                <option value="0" selected disabled>Status</option>
                <option value="2">In progress</option>
                <option value="3">Done</option>
                </select>
                <i class="far fa-trash-alt delete py-2 mx-1"></i>
                <i class="fas fa-star star ${starItem}"></i>
            </div>
          </li>`;
};






//#endregion

//#region Bind Todos To Dom


let bindTodosToDom = (todos) => {
  todosUL.innerHTML = todos.map((todo) => {
    const isStarred = starTodosList.includes(todo);
    const status = getStatus(todo.statusCode).color;

    return createTodos(todo, isStarred, status);
  }).join("");

  for (let i = 0; i < todos.length; i++) {
    if (starTodosList.includes(todos[i])) {
      const starIcons = todosUL.querySelectorAll(".star");
      starIcons[i].style.color = "yellow";
      starIcons[i].style.fontSize = "18px";
    }
  }
};

let bindSingleTodo = (todo)=>{
  const isStarred = starTodosList.includes(todo);
  const status = getStatus(todo.statusCode).color;
  todosUL.innerHTML += createTodos(todo, isStarred, status) ;
}
//#endregion


//#region call function
bindTodosToDom(todosList);
//#endregion


//#region Generate Options
const generateOptions = (selectedStatusCode) =>
  selectedStatusCode === "1"
    ? `<option value="0" selected disabled>Status</option>
                  <option value="2">In progress</option>
                  <option value="3">Done</option>`
    : selectedStatusCode === "2"
    ? `<option value="0" selected disabled>Status</option>
                  <option value="1">To do</option>
                  <option value="3">Done</option>`
    : `<option value="0" selected disabled>Status</option>
                  <option value="1">To do</option>
                  <option value="2">In progress</option>`;
//#endregion




//#region Function to search for todos
let filteredTodos=[]
let searchTodosList = (searchText , list) =>{
  let searchedTextToLowerCase = searchText.toLowerCase(); 
  filteredTodos = list.filter( (todo) => todo.title.toLowerCase().includes(searchedTextToLowerCase));

}
//#endregion


//#region function to add new todo 
let addNewTodo =(list,todo) =>{
  let todotobepushed = {title: todo , statusCode: "1" };
list.push(todotobepushed);
bindSingleTodo(todotobepushed)
}
//#endregion





//#region Events Handlers


window.addEventListener("DOMContentLoaded", ()=>{
const todosUL = document.getElementById("todosUL");
const searchForm = document.getElementById("searchForm");
const searchText = document.getElementById("searchText");
const noSearchText = document.getElementById("noSearchText");
const addForm = document.getElementById("addForm");
const addText = document.getElementById("addText");
const btn = document.getElementById("btn");
const noFavouriteTodos = document.getElementById("noFavouriteTodos");
const Showbtn = document.getElementById("Showbtn");
//Search Event
if(searchForm){
  searchForm.addEventListener("keyup" , (e) =>{
    e.preventDefault();
    let searchedText = searchText.value;
    searchTodosList(searchedText , todosList)


    if (filteredTodos.length == 0) {
      bindTodosToDom([]);
      noSearchText.style.display="block";
    } else {
      bindTodosToDom(filteredTodos);
      noSearchText.style.display = "none";
    }

    })

};
//add Event
if(addForm){
  addForm.addEventListener("submit" , (e)=>{
    e.preventDefault();
    let addedText = addText.value;
    if(addedText.trim().length != 0){
      addNewTodo(todosList,addedText)
    }
    addText.value =""
  })
};
//Delete Event
if(todosUL)
{
  todosUL.addEventListener("click" , (e) =>{
    if(e.target.classList.contains("delete")){
     let todoToBeDelete = e.target.parentElement.previousElementSibling.firstElementChild.innerHTML;
    let indexToBeDeleted = todosList.findIndex(
      (todo) => todo.title === todoToBeDelete
    );
    todosList.splice(indexToBeDeleted, 1);
    }
  })

//Fav Event
  todosUL.addEventListener("click", (e) => {
    if (e.target.classList.contains("star")) {
      const todoItem = e.target.closest(".list-group-item"); //li
      const todoName = todoItem.querySelector(".todoName").textContent; //innerHtml of span 
    
      if (!starTodosList.find((todo) => todo.title === todoName)) {
        const newStarredTodo = todosList.find((todo) => todo.title === todoName);
        starTodosList.push(newStarredTodo);
  
        e.target.style.fontSize = "18px";
        e.target.style.color = "yellow";
      } else {
        starTodosList = starTodosList.filter((todo) => todo.title !== todoName);
  
        e.target.style.fontSize = "";
        e.target.style.color = "";
      }
    }
  
    if (e.target.classList.contains("delete")) {
      const todoItem = e.target.closest(".list-group-item"); //li
      const todoName = todoItem.querySelector(".todoName").textContent; //innerHtml of span
      todosList = todosList.filter((todo) => todo.title !== todoName);
      starTodosList = starTodosList.filter((todo) => todo.title !== todoName);
      todoItem.remove();
    }
   
    

  });

 
  todosUL.addEventListener("change", (e) => {
    if (e.target.classList.contains("statusSelect")) {
      let selectedStatus = e.target.value;
      e.target.innerHTML = generateOptions(selectedStatus);
      let newStatus = getStatus(selectedStatus);
      e.target.previousElementSibling.innerHTML = newStatus.status;
      e.target.previousElementSibling.className = `badge currentStatus mx-1 ${newStatus.color}`;
  
      // Update status and color in todosList array
      const todoItem = e.target.closest(".list-group-item"); //li
      const todoName = todoItem.querySelector(".todoName").textContent; //span innerHtml
      const todoIndex = todosList.findIndex((todo) => todo.title === todoName);
      todosList[todoIndex].statusCode = selectedStatus;
      todosList[todoIndex].color = newStatus.color;
  
      // Update status and color in starTodosList array
      const starredTodoIndex = starTodosList.findIndex((todo) => todo.title === todoName);
      if (starredTodoIndex !== -1) {
        starTodosList[starredTodoIndex].statusCode = selectedStatus;
        // starTodosList[starredTodoIndex].color = newStatus.color === "bg-danger" ? "" : "bg-primary";
      }
    }
  });
};
if(btn){
  btn.addEventListener("click" ,() =>{

    if (starTodosList.length == 0) {
      bindTodosToDom([]);
      noFavouriteTodos.style.display = "block";
      
    } else {
      bindTodosToDom(starTodosList)
      noFavouriteTodos.style.display = "none";
    }
  })
  
};

if(Showbtn){
  
Showbtn.addEventListener("click" , ()=>{
  
  bindTodosToDom(todosList)
  noFavouriteTodos.style.display = "none";
  
  })
}
});



//#endregion
