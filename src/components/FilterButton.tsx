interface AppProps {
  setFilter(name: string): void;
  name:string
  aria: boolean
 }

function Filterbutton(props:AppProps){
    return(
<>
<button type="button" className="btn toggle-btn" aria-pressed={props.aria} onClick={()=>props.setFilter(props.name)}>
          <span className="visually-hidden">Show </span>
          <span>{props.name}</span>
          <span className="visually-hidden"> tasks</span>
        </button>
</>)
}

export default Filterbutton;