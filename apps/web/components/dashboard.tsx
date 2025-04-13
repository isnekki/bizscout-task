'use client'

import type { Data } from '@repo/types';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { columns } from './table-columns';
import { DataTable } from './data-table';
import { Chart } from './chart';

export default function Dashboard() {
    const [pings, setPings] = useState<Data[]>([])

    useEffect(() => {
        (async() => {
            const historyResponse = await fetch('http://localhost:3002/api/responses?' + new URLSearchParams({ limit: '20' }).toString())
            const history = await historyResponse.json()
            try {
                setPings((state) => [...state, ...(history satisfies Data[])])
            } catch (error) {
                console.error('Error retrieving history: ', error)
            }
        })();

        const socket = io('ws://localhost:3001')
        socket.on('connect', () => console.log('Connected to WebSocket!'))
        socket.on('disconnect', () => console.log('Disconnected from WebSocket!'))
        socket.on('newResponse', (data) => {
            try {
                setPings((state) => [data as Data, ...state])
            } catch(err) {
                console.error(err)
            }
        })

        return () => { socket.disconnect() }
    }, [])

    return (
        <div className='flex flex-col h-[80svh] w-full gap-y-2'>
            <div className='h-2/3'>
                <DataTable columns={columns} data={pings} />
            </div>
            <div className='h-1/3'>
                <Chart pings={pings} className='h-full'/>
            </div>
        </div>
    )

}