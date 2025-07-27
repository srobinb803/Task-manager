import { useEffect,useState, useRef } from "react"

interface AppProps {
  reminderDate?: Date
  name:string
  completed:boolean
  id:string
  toggleTaskCompleted:(id:string) =>void
  deleteTask:(id:string) =>void
  editTask:(id:string, newName:string) =>void
  onSetReminder:(id:string, reminderDate:Date) =>void
  onClearReminder:(id:string) => void
 }

function Todo(props:AppProps) {

  

  const[timePicker, showTimePicker] = useState(false);
  const[selectedTime, setSelectedTime] = useState('');

 async function handelReminderClick(e:React.MouseEvent) {
  e.preventDefault(); 
  if (!("Notification" in window)) {
    alert("This browser doesn't support desktop notifications");
    return;
  }
  try {
     if (Notification.permission === "granted") {
      showTimePicker(true);
    } else if (Notification.permission === "denied") {
      alert("Please enable notifications in browser settings ");
    } else {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        showTimePicker(true);
      } else {
        alert("Reminders require notification permissions");
      }
    }
  } catch (error) {
    console.error("Notification error:", error);
    alert("Error requesting notification permissions");
  }
};

function handelTimeChange(e:any){
    setSelectedTime(e.target.value)
  }
  
function getLocalDatetime(){
  const now:any = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 16);
  }
  
function isPastTime(selected: string){
  const now = new Date();
  const selectedDate = new Date(selected);
  return selectedDate <= now;
};

function handelSetReminder(){
    if (!selectedTime || isPastTime(selectedTime)) {
    alert('Please select a valid time');
    return
    }
      const reminderDate = new Date (selectedTime);
      props.onSetReminder(props.id, reminderDate);
      showTimePicker(false);
    }
  


  const [newName, setNewName] = useState(''); 
  function  handleChange(e: { target: { value: string } }){
    setNewName(e.target.value)
  }

  function handelsubmit(e: { preventDefault: () => void; }){
    e.preventDefault();
    if (newName.trim() === ''){
      alert('Please enter text to edit the task');
      return;
    }
    props.editTask(props.id, newName);
    setNewName('');
    setEditing(false);
  }
 

  const [isEditing, setEditing] = useState(false);

  const editButtonRef = useRef<HTMLButtonElement>(null);
  const editFieldRef = useRef<HTMLInputElement>(null);

  

  function usePrevious<T>(value: T, initial?:T): T | undefined {
  const ref = useRef<T>(initial);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

  const wasEditing = usePrevious(isEditing);
  
  useEffect(()=>{
    if(!wasEditing && isEditing){
      editFieldRef.current?.focus();
    }else if(wasEditing && !isEditing){
      editButtonRef.current?.focus();
    }
  },[wasEditing, isEditing]);
  
  const editingTemplate = (
  <form className="todo stack-small" onSubmit={handelsubmit}>
    <div className="c-cbe">
      <label className="todo-label" htmlFor={props.id}>
        New name for {props.name}
      </label>
      <input id={props.id} className="todo-text" type="text" value={newName} onChange={handleChange} ref={editFieldRef}/>
    </div>
    <div className="btn-group">
      <button type="button" className="btn todo-cancel" onClick={()=> setEditing(false)}>
        Cancel
        <span className="visually-hidden">renaming {props.name}</span>
      </button>
      <button type="submit" className="btn btn__primary todo-edit">
        Save
        <span className="visually-hidden">new name for {props.name}</span>
      </button>
    </div>
  </form>
);


const viewTemplate = (
  <div className="todo stack-small">
    <div className="c-cb">
      <input
        id={props.id}
        type="checkbox"
        checked={props.completed}
        onChange={() => props.toggleTaskCompleted(props.id)}
      />
      <label className="todo-label" htmlFor={props.id}>
        {props.name}
      </label>
    </div>
    <div className="btn-group">
      <button type="button" className="btn" onClick={handelReminderClick} >
        {props.reminderDate? 'Edit reminder' : 'Remind me'}
        <span className="visually-hidden">for {props.name}</span>
      </button>
      <button type="button" className="btn" onClick={()=> setEditing(true)} ref={editButtonRef}>
        Edit <span className="visually-hidden">{props.name}</span>
      </button>
      <button
        type="button"
        className="btn btn__danger"
        onClick={() => props.deleteTask(props.id)}
      >
       <svg 
         width="22" 
         height="12" 
         viewBox="0 0 22 12" 
         xmlns="http://www.w3.org/2000/svg" 
         fill="none" 
         stroke="currentColor" 
         stroke-width="1" 
         stroke-linecap="round" 
         stroke-linejoin="round"
        >
         <polyline points="6.5 3 7.5 3 15.5 3" />
         <path d="M14.5 3v7a1 1 0 0 1-1 1H8.5a1 1 0 0 1-1-1V3m1.5 0V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" />
         <line x1="10" y1="5.5" x2="10" y2="8.5" />
         <line x1="12" y1="5.5" x2="12" y2="8.5" />
       </svg>
       <span className="visually-hidden">delete {props.name}</span>
     </button>
     {timePicker && (
      <div className="reminder-control" >
        <input 
        type="datetime-local"
        className="todo-text" 
        value={selectedTime}
        onChange={handelTimeChange}
        min={getLocalDatetime()}
        style={{marginTop:'5px'}}
        />
          <div className="btn-group" >
            <button type="button" className="btn" onClick={handelSetReminder} >
              Set <span className="visually-hidden">reminder {props.reminderDate?.toLocaleString()}</span>
            </button>
            <button type="button" className="btn" onClick={()=>showTimePicker(false)}>
              Cancel <span className="visually-hidden">reminder</span>
            </button>
          </div>
      </div>
     )}
     {props.reminderDate && (
      <div className="reminder-display"  style={{ marginTop: '10px' }}>
        <small>
          Reminder: {new Date(props.reminderDate).toLocaleString()}
        </small>
        <button 
        type="button" 
        className="btn btn__danger" 
        style={{ marginLeft: '10px', padding: '2px 5px' }} 
        onClick={()=> props.onClearReminder(props.id)}
        >
          X <span className="visually-hidden">clear reminder</span>
        </button>
      </div>
     )}
    </div>
  </div>
);

return(
   <>
  <li>{isEditing ? editingTemplate : viewTemplate}</li>
   </>
  )
}

export default Todo;