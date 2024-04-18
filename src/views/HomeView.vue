<template>
  <div class="mainBox">
  <div><h1 class="pageTitle">Chat</h1></div> 
  <div class="w-auto p-2 mt-2 bg-slate-400 rounded-md text-white"><h2 class="text font-bold">Connected: {{ isConnected }}</h2></div>
  <button class="btn mt-2" @click="()=>connect()">Connect</button>
  <button class="btn mt-2" @click="()=>disconnect()">Disconnect</button> 
  <div id="displayUserInfo"><h1>User: {{ userName }}</h1></div>
  <div id="displayMessages"></div>
  <div class="justify-self-start w-full h-auto">
    <p class="inline mr-2">Name:</p>
    <input class="inline w-20"  type="text" v-model="userName">
    <div width="auto" height="auto"><textarea id="textInput" class="block w-full" v-model="newMessage" placeholder="enter message" /></div>
    <button id="sendBtn" class="btn mt-2" @click="()=>newMessage!=undefined?sendMessage(userName,newMessage):'' ">Send</button>
  </div>


  </div> 
</template>
<script setup lang="ts">
import {ref, onMounted, computed, watch, watchEffect} from 'vue'
import {socket, state} from '@/socket.js'


 





const userName = ref<string>("May")
const newMessage = ref<string>("")
const MY_API = ref<any>()
const myData = ref([{name:'Ann', age:20},{name:'Bob',age:24}])





const displayMessage = (name:string, message:string)=>{
 let displayMessages = document.querySelector('#displayMessages')
 let newMessageUser = document.createElement('h1')
 newMessageUser.textContent = name
 let newMessage = document.createElement('p')
 newMessage.textContent = message
 displayMessages?.append(newMessageUser)
 displayMessages?.append(newMessage)

}
const clearDisplayMessages =()=>{
    let displayMessages = document.querySelector('#displayMessages')
    let oldMessagesName = document.querySelectorAll('#displayMessages h1')
    let oldMessages = document.querySelectorAll('#displayMessages p')
    oldMessagesName.forEach(name=>{
      displayMessages?.removeChild(name)
    })
    oldMessages.forEach(message=>{
      displayMessages?.removeChild(message)
    })
     

}


const sendMessage = async (name:string, message:string)=>{
  clearDisplayMessages()
  await socket.emit('sendMessage',{
    name:name,
    message: message

  })

}

watch(state,()=>{
  console.log(state.messages)
  clearDisplayMessages()
  state.messages.forEach((message:Message)=>{
      displayMessage(message.name,message.message)

    })

}, {deep:true})

const connect = ()=>{
  socket.connect()
  socket.emit('getMessage',{})
  setTimeout(()=>{
        let newTarget = document.querySelector('#sendBtn')
        newTarget?.scrollIntoView({ behavior: 'instant',block: "end",inline: "nearest"});
      },200)
 

}

const disconnect =()=>{
  socket.disconnect()
}

const isConnected =computed(()=>{  
  return state.connected
})



onMounted(()=>{
  
  MY_API.value= import.meta.env.VITE_API

  const textInput = document.querySelector('#textInput')
  textInput?.addEventListener('keydown',(e)=>{
    if(e.key=='Enter'){
      sendMessage(userName.value,newMessage.value)
      newMessage.value=""
      setTimeout(()=>{
        let newTarget = document.querySelector('#sendBtn')
        newTarget?.scrollIntoView({ behavior: 'instant',block: "end",inline: "nearest"});
      },200)
      

    }

  })


  

  
})
</script>
<style>


@keyframes mySeq{
  0% {opacity: 1;
  transform: translate(0) rotate(0deg);}
  100%{opacity: 0; 
  transform:translate(30vh) rotate(360deg);}
}

.pageTitle::first-letter{
  font-size: 10rem;
  
}



#target:hover{
  background-color:var(--mo);
  
}


.pageTitle{
  font-family: 'titleFont';
}
#displayMessages{
  width: 100%;
  height: auto;  
  padding-top: 2rem;
  padding-bottom: 4rem;
  @apply justify-start

}
#displayMessages h1 {
  @apply font-bold
}
#displayMessages p {
   font-family: 'pageFont';
}
#displayUserInfo{
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
  padding: 2rem;
  justify-self: center;
  border: solid 2px;
  border-radius: 0.5rem;
  margin: 2rem;
}

input {
  border: solid 1px;
  border-radius: 0.25rem;
  margin-top: 2rem;
}

textarea {
  border: solid 1px;
  border-radius: 0.25rem;
  margin-top: 1rem;
}

button{
  height:auto;
  width: auto;
  padding: 0.5rem;
  background-color: black;
  color: white;
  border-radius: 0.25rem;
}

button:hover{
  background-color: white;
  color: black;
  border: solid 1px;
}

</style>
