import Compiler from "./Compiler.jsx";
import Question from "./Question";
import QuestionDescription from "./QuestionDescription";
function CodeEditor(){
    return <div className="codeEditor">
     
    <QuestionDescription title="alice and bob" description="jdfskjdkj lsdjfljsdf jkIn this modified Question component, we added a button labeledOpen Code Edito that triggers the onClick event handler passed from the parent component (QuestionList). When clicked, it passes the id of the question to the onClick handler.
Now, let's update the QuestionList component to handle opening the code editor for the clicked question:"/>
   <div className="gutter gutter-horizontal"></div>
    <Compiler/>
    </div>
}
export default CodeEditor;