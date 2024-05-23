function QuestionDescription({title,description,Qid}){
    return <div className="QuestionDescription">
    <p>Question Id: {Qid}</p>
    <h3>{title}</h3>
    <p>{description}</p>
    </div>
}

export default QuestionDescription;