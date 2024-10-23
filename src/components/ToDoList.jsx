import React,{ useState, useEffect } from 'react'

function ToDoList(){
    const [text, setText] = useState(""); // dane wprowadzone przez uzytkownika
  const [tasks, getTasks] = useState([]); // tablica z zadaniami
  const [Filter, setFilter] = useState("All"); // filtr zastosowany do wyswietlania
  useEffect(()=>{
    getTasks(()=>{
      let storedTasks = JSON.parse(localStorage.getItem("zadania")); // POBRANIE TABLICY ZADAŃ Z LOCALSTORAGE
      if(storedTasks != null){ // SPRAWDZENIE CZY ISTNIEJE
        return storedTasks;
      }
    });
    
    
  },[]);


  // OBSŁUGA PRZYCISKU "DODAJ ZADANIE"
  const handleSave = () => { 
    if(text.trim()){ // SPRAWDZENIE CZY UŻYTKOWNIK COŚ WPISAŁ
      let storedTasks = JSON.parse(localStorage.getItem("zadania")) == null ? new Array() : JSON.parse(localStorage.getItem("zadania"));
      // UTWORZENIE OBIEKTU DLA ZADANIA
      let task = {
        id: storedTasks.length == null ? 0 : storedTasks.length,
        title: text,
        done: false
      }
      storedTasks.push(task); // WSTAWIENIE OBIEKTU DO TABLICY
      let temp = JSON.stringify(storedTasks); // PARSOWANIE TABLICY
      localStorage.setItem("zadania", temp); // AKTUALIZACJA TABLICY W LOCALSTORAGE
      getTasks(storedTasks); // AKTUALIZACJA ZMIENNEJ tasks
    }
    else{
      alert("Uzupełnij pole!!!"); // KOMUNIKAT O NIEPOPRAWNYM WPISANIU DANYCH
    }
  }

  // OBSŁUGA PRZYCISKU "USUŃ"
  const deleteTask = (e) =>{
    let task = e.target.parentElement; // POBIERANIE RODZICA ELEMENTU DLA KTÓREGO ZOSTAŁ KLIKNIĘTY PRZYCISK
    let tempTasks = tasks.concat([]);
    let usuniete = false; // POLE KTÓRE MÓWI CZY Z TABLICY USUNIĘTY JUŻ ELEMENT
    for(let i = 0; i < tempTasks.length; i++){
      if(tempTasks[i].id == task.id){ 
        tempTasks.splice(i, 1); // USUNIĘCIE ELEMENTU Z TABLICY
         usuniete = true;
      }
      if(usuniete && tempTasks.length != 0 && tempTasks[i] != null)
        tempTasks[i].id = i; // ZMIANA ID DLA POZOSTAŁYCH ELEMENTÓW ZGODNIE Z KOLEJNOŚCIĄ
    }


    let temp = JSON.stringify(tempTasks); // PARSOWANIE TABLICY 
    localStorage.setItem("zadania", temp); // AKTUALIZACJA TABLICY W LOCALSTORAGE
    getTasks(tempTasks);
    
  }


  // OBSŁUGA KLIKNIĘCA POLA "WYKONANE"
  const doneCheck = (e) =>{
    let task = e.target.parentElement.parentElement; // POBRANIE RODZICA - DIVA CAŁEGO ZADANIA KTÓREGO PRZYCISK ZOSTAŁ KLIKNIĘTY
    let storedTasks = JSON.parse(localStorage.getItem("zadania")) == null ? new Array() : JSON.parse(localStorage.getItem("zadania"));
    for(let i = 0; i < storedTasks.length; i++){
      if(storedTasks[i].id == task.id){
         storedTasks[i].done = e.target.checked; // ZAMIANA WARTOŚCI "done" DLA OBIEKTU
      }
    }
    let temp = JSON.stringify(storedTasks);
    localStorage.setItem("zadania", temp); // AKTUALIZACJA TABLICY W LOCALSTORAGE
    getTasks(storedTasks);
  }

  const usunWszystkie = () =>{
    localStorage.setItem("zadania", JSON.stringify([]));
    getTasks([]);
  }

  return (
    <>
    <h1>Dodaj zadanie</h1>
    <div id='inp'>
     <input
      type='text'
      placeholder='nazwa zadania'
      onChange={(e) => setText(e.target.value)}
      
      />
      <button onClick={handleSave} type='submit' id='addBtn'>Dodaj zadanie</button>
      </div>
      <div> 
        <input type="radio" name="filtr" value="All" onChange={(e) => setFilter(e.target.value)} checked={Filter == "All"}/> Wszystkie
        <input type="radio" name="filtr" value="Done" onChange={(e) => setFilter(e.target.value)} checked={Filter == "Done"}/> Wykonane
        <input type="radio" name="filtr" value="Undone" onChange={(e) => setFilter(e.target.value)} checked={Filter == "Undone"}/> Niewykonane
      </div>
      <h2>Zadania:</h2>
      <ol id='zadania'>
        {
          
          // PRZEJŚCIE PRZEZ KAŻDY ELEMENT TABLICY TASKS ZAWIERAJĄCEJ WSZYSTKIE ZADANIA
          (tasks ? tasks : [] ).map(function(task){

            // Stworzenie pola listy zadań
            let item =  <li id={task.id} className={task.done ? "task doneT" : "task"} key={task.id}>
                          <span>{task.id +1}. {task.title}</span>
                          <span className='done'>wykonane <input type='checkbox' onChange={doneCheck} checked={task.done}/></span>
                          <button onClick={deleteTask} className='deleteButton'>Usuń</button>
                        </li>;

            if(Filter == "Done" && task.done){ // Filtr wykonanych
              return item;
            }
            else if(Filter == "Undone" && !task.done){ // Filtr niewykonanych
              return item;
            }
            else if(Filter == "All"){ // Filtr wszystkich
                return item;
            }
          })
          
        }
      </ol>
      <div>
        <button onClick={usunWszystkie}>USUŃ WSZYSTKIE</button>
      </div>
    </>
  )
}

export default ToDoList