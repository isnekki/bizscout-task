'use client'

import type { Data } from '@repo/types';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { columns } from './table-columns';
import { DataTable } from './data-table';
import { Chart } from './chart';

/**
 * This is the Dashboard component for displaying live data from the backend's WebSocket.
 */
export default function LiveDashboard() {
    const [pings, setPings] = useState<Data[]>([])

    // Fetch 10 rows to populate the table for now as we wait 5 minutes for new data
    useEffect(() => {
        let isMounted = true;
        (async() => {
            const historyResponse = await fetch('http://localhost:3002/api/responses?' + new URLSearchParams({ limit: '10' }).toString())
            const history = await historyResponse.json()
            try {
                if (isMounted) setPings((state) => [...state, ...(history satisfies Data[])])
            } catch (error) {
                console.error('Error retrieving history: ', error)
            }
        })();

        // Connect to the WebSocket and add logic to update state based on responses from the WebSocket
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

        // Cleanup function
        return () => { 
            isMounted = false
            setPings([])
            socket.disconnect() 
        }
    }, [])

    return (
        <div className='flex flex-col h-full w-full gap-y-6'>
            <div className='h-2/3'>
                <DataTable columns={columns} data={pings} isScrolled />
            </div>
            <div className='h-1/3'>
                <Chart pings={pings} className='h-[25svh]'/>
            </div>
        </div>
    )

}