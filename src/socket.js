import { reactive } from "vue";
import { io } from "socket.io-client";

export const state= reactive({
  connected: false,
  messages:[],
});

//"http://localhost:3000"
const URL = import.meta.env.VITE_API;

export const socket = io(URL,{
    autoConnect: false
  });

socket.on("connect", () => {
  state.connected = true; 
});

socket.on("disconnect", ()=>{
  state.connected = false;
});

socket.on("message",(data)=>{
    console.log(`AB:  what i received from message io: ${data.messages}`)
    state.messages=data.messages
})

