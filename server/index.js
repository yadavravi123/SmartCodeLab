const express=require("express")
const cors=require("cors")
const axios=require("axios")
const app=express()
require('dotenv').config()
const PORT=8000;
app.use(cors());
app.use(express.json());

app.post("/compile", async(req,res)=>{
    console.log('hit');
    // res.send("hello world");
    let code=req.body.code;
    let language=req.body.language;
    let input=req.body.input;
    if(language=="python"){
        language="py"
    }
    code=`#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`;
    let data={
        "code":code,
        "language":language,
        "input":input
    }
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
          language_id: 52,
          source_code:code,
          stdin:'',
        }
      };
      try {
        const response = await axios.request(options);
        console.log(response.data);
        } catch (error) {
        console.error(error);
    }

})
app.get("/test",async(req,res)=>{
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/4447e1c0-02be-4e7d-a453-cade79dc0574',
        params: {
          base64_encoded: 'false',
          fields: '*'
        },
        headers: {
          'x-rapidapi-key':process.env.API_KEY,
          'x-rapidapi-host':process.env.API_HOST,
        }
      };
      
      try {
          const response = await axios.request(options);
          console.log(response.data);
      } catch (error) {
          console.error(error);
      }
})

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
});