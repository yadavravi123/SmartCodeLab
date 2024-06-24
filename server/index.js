const express=require("express")
const cors=require("cors")
const axios=require("axios")
const app=express()
require('dotenv').config()
const PORT=8000;
app.use(cors());
app.use(express.json());
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const baseURL=`http://localhost:8000`
app.post("/compile", async(req,res)=>{
    let code=req.body.code;
    let language=req.body.language;
    let userLangId=req.body.userLangId;
    let input=req.body.input;
    if(language=="python"){
        language="py"
    }
    // console.log('input',input);
  
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
          base64_encoded: 'false',
          wait: 'false',
          fields: '*'
        },
        headers: {
          'x-rapidapi-key':process.env.API_KEY,
          'x-rapidapi-host':process.env.API_HOST,
          'Content-Type': 'application/json'
        },
        data: {
          language_id:userLangId,
          source_code:code,
          stdin:input,
        }
      };
      try {
        const response = await axios.request(options);
        const {token}=response.data;
        var submissionDetails;
        while(1){
        submissionDetails=await axios.get(`${baseURL}/submission/${token}`);
        if(submissionDetails.data.status.id>2) break;
        }
        // submissionDetails=await axios.get(`${baseURL}/submission/${token}`);
        // let statusId=submissionDetails.data.status.id;
        // if(statusId===1 || statusId===2){
        //   // still processing
        //   setTimeout(async()=>{
        //     submissionDetails=await axios.get(`${baseURL}/submission/${token}`);
        //   },2000)
        //   return;
        // }
        var {stdout,time,memory,status,compile_output}=submissionDetails.data;
        if(!stdout) stdout="";
        var temp=status.description+'\n'+stdout+'\n'+compile_output;
        res.send(temp);
        } catch (error) {
        console.error(error);
    }

})

app.get("/submission/:token",async(req,res)=>{
    const options = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${req.params.token}`,
        params: {
          base64_encoded: 'true',
          wait: 'false',
          // fields: `stdout,status,time,memory`
          fields:'*',
        },
        headers: {
          'x-rapidapi-key':process.env.API_KEY,
          'x-rapidapi-host':process.env.API_HOST,
        }
      };
      try {
          const response = await axios.request(options);
          // console.log(response.data);
          var {stdout,time,memory,status,compile_output}=response.data;
          var output;
          if(status.description==="Accepted"){
           output = Buffer.from(stdout, 'base64').toString('utf8');
          }
          if(compile_output)
          compile_output=Buffer.from(compile_output,'base64').toString('utf-8');
          else compile_output=""
          console.log(compile_output);

          var resObj={
            stdout:output,
            time,
            memory,
            status,
            compile_output
          }
          res.send(resObj);
      } catch (error) {
          console.error('error at get submissions',error);
      }
})
app.post("/generate-response", async(req,res)=>{
  try{
        // const prompt = req.body.prompt;
        // const result = await model.generateContent(prompt);
        // const response = await result.response;
        // const text = response.text();
        // console.log(text);
        const text=`dkflsf fskf ERROR
ResizeObserver loop completed with undelivered notifications.
    at handleError (http://localhost:3000/static/js/bundle.js:48379:58)
    at http://localhost:3000/static/js/bundle.js:48398:7
ERROR
ResizeObserver loop completed with undelivered notifications.at handleError (http://localhost:3000/static/js/bundle.js:48379:58)
    at http://localhost:3000/static/js/bundle.js:48398:7
    ERROR
ResizeObserver loop completed with undelivered notifications.
    at handleError (http://localhost:3000/static/js/bundle.js:48379:58)
    at http://localhost:3000/static/js/bundle.js:48398:7
ERROR
ResizeObserver loop completed with undelivered notifications.
    at handleError (http://localhost:3000/static/js/bundle.js:48379:58)
    at http://localhost:3000/static/js/bundle.js:48398:7 ERROR
ResizeObserver loop completed with undelivered notifications.
    at handleError (http://localhost:3000/static/js/bundle.js:48379:58)
    at http://localhost:3000/static/js/bundle.js:48398:7
ERROR
ResizeObserver loop completed with undelivered notifications.
    at handleError (http://localhost:3000/static/js/bundle.js:48379:58)
    at http://localhost:3000/static/js/bundle.js:48398:7`;
        res.send(text);
  } catch(error){
    console.log(`error while generating response`);
  }
})

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
});