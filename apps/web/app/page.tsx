'use client'

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [pings, setPings] = useState<unknown[]>([])

  useEffect(() => {

    const socket = io('http://localhost:3001')

    socket.on('connect', () => console.log('Connected to WebSocket!'))
    socket.on('disconnect', () => console.log('Disconnected from WebSocket!'))
    socket.on('newResponse', (data) => setPings((state) => [...state, JSON.stringify(data)]))

    return () => { socket.disconnect() }
  }, [])

  return (
    <div className='bg-red-200'>
      <pre>{JSON.stringify(pings, null, 2)}</pre>
    </div>
  );
}
