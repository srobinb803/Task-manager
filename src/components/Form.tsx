import { useState } from "react";

interface AppProps {
  addTask: (name: any) => void
}

function Form(props:AppProps){
  const[name, setname] = useState('');
  
  function handleChange(event: { target: { value: string; }; }){
    setname(event.target.value)
  }
  
  function handelsubmit(event: { preventDefault: () => void; }){
    event.preventDefault();
    if (name.trim() == ''){
      alert('please enter the task');
      return;
    }
    props.addTask(name);
    setname('')
  }
    return(
    <form onSubmit={handelsubmit}>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            What needs to be done?
          </label>
        </h2>
        <div className="form-wrapper">
        <input
          type="text"
          id="new-todo-input"
          className="input input__lg"
          name="text"
          autoComplete="off"
          value={name}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn__primary btn__lg" >
          Add
        </button>
        </div>
      </form>
      )
}

export default Form