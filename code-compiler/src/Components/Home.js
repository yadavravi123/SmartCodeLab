import React, { useRef, useState } from "react"
import toast from "react-hot-toast";
import {v4 as uuid} from "uuid"
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import "bootstrap/dist/css/bootstrap.min.css"
export default function Home(){
    const navigate=useNavigate();
    const [RoomId,setRoomId]=useState("");
    const [username,setUsername]=useState("");
    const generateRoomId=()=>{
        const id=uuid();
        setRoomId(id);
        toast.success("Room Id Generated");
    }
    const joinRoom=()=>{
        socket.io.opts.query.RoomId=RoomId;
        socket.io.opts.query.username=username;

    if(RoomId==="" || username===""){
        toast.error("both fields are required");
        return;
    }
    socket.connect();
    socket.on('connect',()=>{
        console.log('socket client connected');
    })
    // socket.on('connect',()=>{
        socket.emit('join',{RoomId,username});
        navigate(`/editor/${RoomId}`,{
            state:{
                socketId:socket.id,
                username:username,
            }
        });
        toast.success("Room is created"); 
    // }) 
    }
    return (
        <div className="container-fluid">
             <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm p-2 mb-5 bg-secondary rounded">
                    <div className="form-group">
                        <input onChange={(e)=>{setRoomId(e.target.value)}} value={RoomId} type="text" className="form-control mb-2" name="" id="" placeholder="Room Id" />
                    </div>
                    <div className="form-group">
                        <input onChange={(e)=>{setUsername(e.target.value)}} type="text" className="form-control mb-2" name="" id="" placeholder="Username" />
                    </div>
                    <button onClick={joinRoom} className="btn btn-success btn-lg btn-block">JOIN</button>
                    <p>Don't have a room Id? <span onClick={generateRoomId} className="text-danger" style={{cursor:"pointer"}}>New Room</span></p>
                    </div>
                </div>
             </div>
             </div>
    )
}
