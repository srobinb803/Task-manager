import { useEffect, useRef } from "react";

interface Task {
  name:string
  completed:boolean
  id:string
 }
interface AppProps {
  taskList: Task[];
 }

function HeadingText(props: AppProps){
   const completedCount = props.taskList.filter(task => task.completed).length;
   const remainingCount = props.taskList.length - completedCount;

  const completedNoun = completedCount === 1 ? 'task' : 'tasks';
  const remainingNoun = remainingCount === 1 ? 'task' : 'tasks';

   const headingRef = useRef<HTMLHeadingElement>(null); 
   
   function usePrevious<T>(value: T, initial?: T):T | undefined{
    const ref = useRef(initial);
    useEffect(()=>{
      ref.current = value;
    });
    return ref.current;
   }

   const prevTaskLength = usePrevious(props.taskList.length);

   useEffect(()=>{
    if(prevTaskLength !== undefined && props.taskList.length < prevTaskLength){
      headingRef.current?.focus();
    }
   },[props.taskList.length, prevTaskLength])

  if (props.taskList.length === 0) {
    return <h2 className="heading" ref={headingRef} tabIndex={-1} >No task available</h2>;
  }

  if (completedCount === 0) {
    return (
      <h2 className="heading" ref={headingRef} tabIndex={-1}>
        Active <span className="remaining-noun">{remainingNoun}</span>:{" "}
        <span className="remaining-count">{remainingCount}</span>
      </h2>
    );
  }

  if (remainingCount === 0) {
    return (
      <h2 className="heading" ref={headingRef} tabIndex={-1}>
        Completed <span className="completed-noun">{completedNoun}</span>:{" "}
        <span className="completed-count">{completedCount}</span> | Active task: 0
      </h2>
    );
  }

  return (
    <h2 className="heading" ref={headingRef} tabIndex={-1}>
      Completed <span className="completed-noun">{completedNoun}</span>:{" "}
      <span className="completed-count">{completedCount}</span> | Active{" "}
      <span className="remaining-noun">{remainingNoun}</span>:{" "}
      <span className="remaining-count">{remainingCount}</span>
    </h2>
  );
}

export default HeadingText