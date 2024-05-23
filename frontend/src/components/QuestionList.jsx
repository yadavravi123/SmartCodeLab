import Question from "./Question";
function QuestionList(){
    function handleClick(event){
        console.log('clicked');
    }
    return <>
    <div className="QuestionListContainer">
        <Question key="123" id="123"/>
        <Question/>
        <Question/>
        <Question/>
      
    </div>
    </>
}
export default QuestionList;