import { useReducer, useRef, useState } from "react";
import axios from "axios"
import SubmitStatus from "./SubmitStatus";
import QuestionList from "./QuestionList";

const URL="http://localhost:3000";

const Compiler=({Qid})=>{
    const code=useRef("");
    const [response,setResponse]=useState({"status":"","message":""});
    const handleChange=async()=>{ 
    }
    const  handleSubmit=async(event)=>{
        event.preventDefault();
        var res=await axios.post(`${URL}/submission`,{
          source_code:code.current.value,
          Qid:Qid,
        })
        res=res.data;
        
        setResponse((prev)=>{
         let nobj={
          status:res.status,
          message:res.message,
         }
         return nobj;
        })

    }
    return <>
    <div className="compiler">
      <h4>Compiler</h4>
      <form className="compiler_form" action="" method="post" onSubmit={handleSubmit}>
    <textarea onChange={handleChange} ref={code} className="code_area" name="input_code" id="" cols="80" rows="16"></textarea>
      <div className="compiler_buttons">
        <button>Run Cases</button>
        <button>Submit</button>
      </div>
      <SubmitStatus response={response}/>
    </form>
    </div>
    </> 
}
export default Compiler;