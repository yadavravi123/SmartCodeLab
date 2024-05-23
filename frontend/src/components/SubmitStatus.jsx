const SubmitStatus=({response})=>{
   
    return <div className="submit-status">{response.status},{response.message}</div>
 }
 export default SubmitStatus;