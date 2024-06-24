import { useEffect } from "react";
import { useState } from "react";
// import QuestionDescription from "./QuestionDescription";
// import Compiler from "./Compiler";

export default function Pan({Qid}) {
  
    return <ResizablePanes Qid={Qid} />;
  }

function ResizablePanes({Qid}) {
    return (
      <div className="panes w-screen h-screen flex">
        {/* <ResizablePane initialSize={500}    bgColor={"bg-red-400"}><QuestionDescription Qid={Qid}/></ResizablePane> */}
        <ResizablePane initialSize={500}    bgColor={"bg-red-400"}></ResizablePane>

        {/* <ResizablePane initialSize={500} grow={true}  bgColor={"bg-yellow-400"}><Compiler Qid={Qid} /></ResizablePane> */}
        <ResizablePane initialSize={500} grow={true}  bgColor={"bg-yellow-400"}>dfdf</ResizablePane>
      </div>
    );
} 
  
  function ResizablePane({children,initialSize,grow,bgColor }) {
    const [size,setSize]=useState(initialSize);
    const [isResizing,setResizing]=useState(false);

    useEffect(()=>{

        document.addEventListener("mousemove",handleMouseMove);
        document.addEventListener('mouseup',handleMouseUp);
       
        return ()=>{
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup",handleMouseUp);
        }
    },[size,isResizing]);

    const handleMouseUp=(e)=>{
      setResizing(false); 
    }
    const handleMouseMove=(e)=>{
        if(!isResizing) return;
        const movement = e.movementX;
        setSize(size + movement);
    }
    const handleMouseDown=(e)=>{
        setResizing(true);
    }
    
    return <div className={`flex ${bgColor} ${grow?"grow":""} shrink-0`} style={{ width: `${size}px` }}>
      {children}
         {!grow && <ResizableHandle isResizing={isResizing} handleMouseDown={handleMouseDown}/>}
    </div>
}

function ResizableHandle({ isResizing, handleMouseDown }) {
  return (
    <div
      className={`ml-auto w-1 top-0 bottom-0 cursor-col-resize hover:bg-blue-600 ${
         "bg-blue-800"
      }`}
      onMouseDown={handleMouseDown}
    ></div>
  );
}