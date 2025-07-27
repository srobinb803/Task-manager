import './App.css'
import Todo from './components/todo'
import Form from './components/Form'
import Filterbutton from './components/FilterButton'
import { useState, useEffect, useCallback }  from 'react'
import { nanoid } from 'nanoid'
import HeadingText from './components/Headingtest'

interface Task {
  name:string
  completed:boolean
  id:string
  reminderDate?:Date
 }

const FILTER_MAP: any = {
  All: ()=> true,
  Active: (task: { completed: boolean })=> !task.completed,
  Completed: (task: { completed: boolean })=> task.completed,
}
const FILTER_NAMES =  Object.keys(FILTER_MAP);

function App() {

  const[theme, setTheme] = useState<'light'|'dark'>(()=>{
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || null;
    if(savedTheme) return savedTheme;
    const preferTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return preferTheme? 'dark' : 'light';
  })

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },[theme])

  function toggleTheme(){
    setTheme((theme)=>{
      return theme == 'light' ? 'dark' : 'light'}) 
  }

  const [tasks, settask] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
   })
  
   useEffect(() => {
    if (!localStorage.getItem('tasks')) {
      fetch('/tasks.json')
        .then((r) => {
          if (!r.ok) throw new Error('Failed to load tasks.json')
          return r.json()
        })
        .then((data: Task[]) => {
          settask(data)
          localStorage.setItem('tasks', JSON.stringify(data))
        })
        .catch((err) => console.error(err))
    }
    }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function setreminder(id: string, reminderDate: Date ){
    const setreminder = tasks.map((task)=> task.id === id ? {...task, reminderDate: reminderDate } : task);
    settask(setreminder);
  }

 
  const clearreminder =useCallback((id: string)=>{ 
      settask(tasks=>tasks.map((task)=> task.id ===id ?{...task, reminderDate: undefined}: task));
   },[])
  

 useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    tasks.forEach(task => {
      if (task.reminderDate && now >= task.reminderDate) {
        if (Notification.permission === 'granted') {
          new Notification(`Reminder: ${task.name}`, {
            body: `Task due at ${task.reminderDate.toLocaleString()}`,
          });
        }else {
          console.log('Notifications not allowed');
        }
        clearreminder(task.id);
      }
    });
  }, 60000);

  return () => clearInterval(interval);
}, [tasks, clearreminder]);

  function clearAll() {
    settask([])
    localStorage.removeItem('tasks')
  }
    
  function editTask(id: string, newName: string){
    const editTaskList = tasks.map((task)=>{
      if (id === task.id){
        return {...task, name: newName};
      }
      return task;
    });
    settask(editTaskList);
  }
 
  function addTask(name: string):void{
    const newTask = {id: `todo-${nanoid()}`, name, completed: false, };
    settask([...tasks, newTask]);
  }

  function toggleTaskCompleted(id: any):void{
    const updateTask = tasks.map((task)=>{
      if(id===task.id){
        return {...task, completed: !task.completed};
      }
      return task;
    });
    settask(updateTask);
  }

  function deleteTask(id:any):void{
   const remaingTask = tasks.filter(task=> id !== task.id);
   settask(remaingTask);
  }
  
  const [filter, setFilter] = useState('All');
  const filetList= FILTER_NAMES.map((name)=>(
    <Filterbutton key={name} name={name} aria={name===filter} setFilter={setFilter}/>
  )
  )

  const taskList = tasks.filter(FILTER_MAP[filter]).map(
      (task) => <Todo name={task.name}
    completed={task.completed}
    id={task.id}
    key={task.id}
    toggleTaskCompleted={toggleTaskCompleted}
    deleteTask={deleteTask}
    editTask={editTask}
    onSetReminder={setreminder}
    onClearReminder={clearreminder} 
    reminderDate={task.reminderDate}/>
                    );
  const dark = (<div className='dark'>
    <svg 
  xmlns="http://www.w3.org/2000/svg"
   width="24" 
   height="24" 
   viewBox="0 0 24 24" 
   fill="none" 
   stroke="currentColor" 
   stroke-width="2" 
   stroke-linecap="round" 
   stroke-linejoin="round"
   >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    </div>
)

  const light = (<div>
    <svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="24" 
  height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
  </svg>
  </div>
)
 return (
    <div className="todoapp stack-large">
      <div className='head'>
      <h1>To Do</h1>
      <button className='btn toggle-theme' onClick={toggleTheme} aria-label='Toggle light mode/dark mode'>
      {theme==='light'? dark: light}
      </button>
      </div>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
        {filetList}
      </div>
      <div>
        <HeadingText taskList={tasks} />
      </div>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
       {taskList}
      </ul>
      <div className='clear btn-group stack-exception'>
      {tasks.length>0 && (
        <button type="button" onClick={clearAll} className="btn btn-clear">
        Clear All
      </button>
    )}
    </div>
    </div>
  );
}

export default App
