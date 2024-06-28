import { useState } from "react";
import Editor from "@monaco-editor/react";
import Navbar from "./Navbar";
// import spinner from "./spinner.svg"
import spinner from "../spinner.svg"
import Axios from "axios";
import { IoMdClose } from "react-icons/io";
import { languageOptions } from "./languageOptions";
import { socket } from "../socket";

const URL=`http://localhost:8000`;

function EditorPage(){
  const [userCode,setUserCode]=useState(``);
  const [userLang,setUserLang]=useState("C++ (GCC 7.4.0)");
  const [userLangId,setUserLangId]=useState(52);
  const [userTheme,setUserTheme]=useState("vs-dark");
  const [fontSize,setFontSize]=useState(20);
  const [userInput,setUserInput]=useState("");
  const [userOutput,setUserOutput]=useState("");
  const [geminiText,setGeminiText]=useState("");
  const [geminiSideBar,setGeminiSideBar]=useState
  (false);
  // const[loadingGemini,setLoadingGemini]=useState(false);
  const [loading,setLoading]=useState(false);
  const options={
    fontSize:fontSize
  }

  // -----sockets------------------
  socket.on('join',({updatedClientList,updatedContent})=>{
    console.log('joined',updatedContent);
    setUserCode(updatedContent);
  })

  socket.on('content-edited',(updatedContent)=>{
    // console.log('updated content',updatedContent);
    setUserCode(updatedContent);
  })
  

  function compile(){
    setLoading(true);
    if(userCode==``){
      setLoading(false);
      return;
    }
    Axios.post(`http://localhost:8000/compile`,{
          code:userCode,
          language:userLang,
          userLangId:userLangId,
          input:userInput,
    }).then((res)=>{
        setUserOutput(res.data);
    }).then(()=>{
      setLoading(false);
    })
  
  }
  async function handleOpenGemini(){
    let prompt=`Please explain why is this code giving error, below is the input code: \n ${userCode}`;
    // setLoadingGemini(true);
    setLoading(true);
    setGeminiSideBar(true);
    const response=await Axios.post(`${URL}/generate-response`,{
      prompt:prompt
    });
    // setLoadingGemini(false);
    setLoading(false);
    setGeminiText(response.data);
   
  }
  function handleCloseGemini(){
    setGeminiText("");
    setGeminiSideBar(false);
    setGeminiText("");
  }

  function clearOutput(){
      setUserOutput("");
  }


  return (
    <div>
      <Navbar userLang={userLang} setUserLang={setUserLang}
      userLangId={userLangId} setUserLangId={setUserLangId}
                userTheme={userTheme} setUserTheme={setUserTheme}
                fontSize={fontSize} setFontSize={setFontSize}/>
      <div className="main">
        <div className="left-container">
          <Editor
            options={options}
            height="calc(100vh - 50px)"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultLanguage="python"
            value={userCode}
            defaultValue="# Enter your code here"
            onChange={(value) => { socket.emit("content-edited",value); }}
            />
          
            <button className="run-btn" onClick={() => compile()}>
                        Run
            </button>
        </div>  
        {geminiSideBar || <div className="right-container">
          <h4>Input:</h4>
          <div className="input-box">
                <textarea id="code-inp" value={userInput} onChange=
                    {(e) => setUserInput(e.target.value)}>
                </textarea>
          </div>
          <h4>Output:</h4>
          {
            loading? 
            (<div className="spinner-box">
            <img src={spinner} alt="Loading..." />
            </div>):
            (<div className="output-box">
              <pre className="userOutput" value={userOutput}>{userOutput}</pre>
              <button onClick={() => { clearOutput() }}
                  className="clear-btn">
                  Clear
              </button>
              <button className="ask-gemini" onClick={handleOpenGemini}>Ask Gemini</button>

          </div>)
          }
          
        </div>
        }
        {loading && geminiSideBar&& (<div className="spinner-box">
            <img src={spinner} alt="Loading..." />
            </div>)}
        {geminiSideBar && !loading && <div className="gemini-side-bar">
          <div className="gemini-header">
            <button className="close-gemini" onClick={handleCloseGemini}><IoMdClose /></button>
            
          </div>
          <div className="gemini-content">{geminiText}</div>
        </div>
        }
      </div>
    </div>
  );
}
export default EditorPage;