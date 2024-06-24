import React from "react"
import Select from "react-select"
import '../Styles/Navbar.css'
import { placeholder } from "react-select/animated";
import { languageOptions } from "./languageOptions";

const Navbar=({userLang,setUserLang,userLangId,setUserLangId,userTheme,setUserTheme,fontSize,setFontSize})=>{
  
    const themes = [
        { value: "vs-dark", label: "Dark" },
        { value: "light", label: "Light" },
    ]
    return (<div className="navbar">
                <h1>SmartCodeLab</h1>
                <Select options={languageOptions} value={userLang} onChange={(e)=>{setUserLang(e.value);setUserLangId(e.id); console.log(e.id);}} placeholder={userLang}/>
                <Select options={themes} value={userTheme}
                    onChange={(e) => setUserTheme(e.value)}
                    placeholder={userTheme} />
                <label>Font Size</label>
                <input type="range" min="18" max="30"
                value={fontSize} step="2"
                onChange={(e) => { setFontSize(e.target.value) }} />
            </div>
            )
}
export default Navbar;
