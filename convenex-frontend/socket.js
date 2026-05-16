import {io} from 'socket.io-client';//io is a function used to connect our frontend to the backend

const socket = io('ws://localhost:4000');//whenever io funct establishes the connection it returns a socket obj (Client side socket obj which can be used to emit and receive events)

export default socket;//we export this object