function Question({id}){
    function handleClick(){
        // open that question with code editor
        
            
    }
    return <>
    <div className="QuestionBox" onClick={handleClick}>
    <p className="question-title">Alice & Bob</p>
        <div className="question-details">
            <p className="question-type detail-item">type: programming,</p>
            <p className="question-marks detail-item">marks: 10</p>
        </div>
    </div>
    </>
}
export default Question;