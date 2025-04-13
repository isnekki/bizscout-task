'use client'

import { ColumnDef } from '@tanstack/react-table';
import type { Data } from '@repo/types';
import { MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const columns: ColumnDef<Data>[] = [
    {
        id: 'id',
        accessorKey: 'id',
        accessorFn: (originalRow) => {
            return originalRow.id.toString()
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    ID
                </Button>
            )
        },
    },
    {
        id: 'simulatedData',
        header: 'Simulated Data',
        cell: ({ row }) => {
            const payload = row.getValue('requestPayload') as { randomNumber: number, timestamp: string }
            return <div className='font-medium'>{(payload.randomNumber * 1000).toFixed(2)}</div>
        }
    },
    {
        accessorKey: 'requestPayload',
        header: 'Raw Request Payload',
        cell: ({ row }) => {
            const payload = row.getValue('requestPayload') as { randomNumber: number, timestamp: string }
            return (
                <Dialog>
                    <DialogTrigger className='underline cursor-pointer'>View Request Payload</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Row {row.original.id}</DialogTitle>
                        </DialogHeader>
                        <div className='overflow-auto'>
                            <pre className='whitespace-pre'>{JSON.stringify(payload, null, 2)}</pre>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        }
    },
    {
        accessorKey: 'responseBody',
        header: 'Raw Response Body',
        cell: ({ row }) => {
            const body = row.getValue('responseBody') as Record<string, unknown>
            return (
                <Dialog>
                    <DialogTrigger className='underline cursor-pointer'>View Response Body</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Row {row.original.id}</DialogTitle>
                        </DialogHeader>
                        <div className='overflow-auto'>
                            <pre className='whitespace-pre'>{JSON.stringify(body, null, 2)}</pre>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        }
    },
    {
        accessorKey: 'statusCode',
        header: 'Status Code',
        cell: ({ row }) => {
            const red = 'text-red-400'
            const green = 'text-green-400'
            const orange = 'text-orange-400'
            const blue = 'text-blue-400'

            const statusCode = row.getValue('statusCode') as number
            const statusCodeStart = `${statusCode}`.slice(0, 1)

            let statusCodeColor = 'text-black'
            let statusCodeMessage = 'Unknown Status Code'
            
            switch(statusCodeStart) {
                case '1':
                    statusCodeColor = blue
                    statusCodeMessage = 'INFO'
                    break;
                case '2':
                    statusCodeColor = green
                    statusCodeMessage = 'SUCCESS'
                    break;
                case '3':
                    statusCodeColor = orange
                    statusCodeMessage = 'REDIRECT'
                    break;
                case '4':
                    statusCodeColor = red
                    statusCodeMessage = 'CLIENT ERROR'
                    break;
                case '5':
                    statusCodeColor = red
                    statusCodeMessage = 'SERVER ERROR';
                    break;
            }
            return <div className={`${statusCodeColor} font-medium`}>{`${statusCode} ${statusCodeMessage}`}</div>
        }
    },
    {
        accessorKey: 'timestamp',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Timestamp
                </Button>
            )
        },
        cell: ({ row }) => {
            const parsedDateTime = new Date(row.getValue('timestamp'))

            const timestampString = parsedDateTime.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

            return <div>{timestampString}</div>
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const data = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='cursor-pointer'>
                            <span className='sr-only'>Open Menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(data.requestPayload))}
                        >
                            Copy Request Payload JSON
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(data.responseBody))}
                        >
                            Copy Response Body JSON
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        } 
    }
]
