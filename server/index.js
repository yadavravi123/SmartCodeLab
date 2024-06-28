const express=require("express")
const cors=require("cors")
const axios=require("axios")
const http = require('http');
const app=express()
const socketIo = require('socket.io');
require('dotenv').config()
const PORT=8000;
const baseURL=`http://localhost:8000`


app.use(cors());
app.use(express.json());


const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
  }
});


//-----------variables------------------------------------
let RoomtoUser=new Map();
let RoomtoContent=new Map();

// -----------socket handling------------------------------


io.on('connection',(socket)=>{
  console.log('a user connected ',socket.handshake.query);  

  const sktId=socket.id;
  const {RoomId,username}=socket.handshake.query;

  socket.on('disconnect',()=>{
    console.log('disconnected');
  })

  socket.on('join',({RoomId,username})=>{
      socket.join(RoomId);
      // console.log('socket joined room',RoomId);
      console.log('lkdflskdf',RoomtoUser.get(RoomId),socket.id);
      if(RoomtoUser.has(RoomId)===false){
          RoomtoUser.set(RoomId,[{socketId:sktId,username:username}]);
      }
      else{
          RoomtoUser.get(RoomId).push({socketId:sktId,username:username});
      }

      // console.log(`kjdjdf`,RoomtoUser.get(RoomId));
      let updatedContent="";
      if(RoomtoContent.has(RoomId)==true) updatedContent=RoomtoContent.get(RoomId);
      let updatedClientList=RoomtoUser.get(RoomId);
      // console.log('content:',updatedContent);
      io.to(RoomId).emit('join',{updatedClientList,updatedContent});
    })

  socket.on("content-edited",(updatedContent)=>{
    // console.log('request for edited content',updatedContent);
    RoomtoContent.set(RoomId,updatedContent);
    io.to(RoomId).emit('content-edited',RoomtoContent.get(RoomId));
  })


})


// ------------------routes handling-------------------------------
app.post("/compile", async(req,res)=>{
  console.log('compiling');
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
        console.error('error while compiling');
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
        const prompt = req.body.prompt;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // console.log(text);
        res.send(text);
  } catch(error){
    console.log(`error while generating response`);
  }
})



server.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
});
