'use client'

import { useCallback, useEffect, useState } from "react";
import { Chart } from "./chart";
import { DataTable } from "./data-table";
import type { Data } from "@repo/types";
import { columns } from "./table-columns";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * This is the Dashboard component for displaying historical data from the backend's database based on
 * user queries.
 */
export default function HistoryDashboard() {
    const [historicalPings, setHistoricalPings] = useState<Data[]>([])
    const [queryFrom, setQueryFrom] = useState<string>('1')
    const [queryTo, setQueryTo] = useState<string>('10')
    const [cache, setCache] = useState<Record<string, Data[]>>({})

    // Callback to query the database with a start and limit parameter
    const fetchHistoricalPings = useCallback(async (start: string, limit: string) => {
        try {
            const response = await fetch(`http://localhost:3002/api/responses?start=${parseInt(start) - 1}&limit=${limit}`);
            const history = await response.json() as Data[];
            return history
        } catch (error) {
            console.error('Error fetching data: ', error);
            toast.error('Uh-oh, something went wrong!', {
                description: 'We encountered an error trying to fetch data for this page.',
            });
        }
    }, [])

    // Check cache before attempting to make a fetch request to the backend
    const handleQuery = useCallback(async () => {
        const cacheKey = `${queryFrom}-${queryTo}`

        try {
            if (cache[cacheKey]) return setHistoricalPings(cache[cacheKey])
            const history = await fetchHistoricalPings(queryFrom, queryTo)
            if (!history) return
            setCache((state) => ({ ...state, [cacheKey]: history }))
        } catch (error) {
            console.error('Error fetching batch: ', error)
            toast.error('Uh-oh, something went wrong!', {
                description: 'We encountered an error fetching this batch of data.'
            })
        }
    }, [cache, fetchHistoricalPings, queryFrom, queryTo])

    // Handle first query
    useEffect(() => {
        handleQuery()
    }, [handleQuery])

    return (
        <div className='flex flex-col flex-grow h-full w-full gap-y-6'>
            <div className='h-2/3'>
                <div className='flex items-center flex-row gap-x-4'>
                    <Input 
                        type="number"
                        placeholder="From"
                        value={queryFrom}
                        onChange={(event) => {
                            if (parseInt(event.target.value) <= 0) return setQueryFrom('1')
                            setQueryFrom(event.target.value)
                        }}
                        className='max-w-20'
                    />
                    to
                     <Input 
                        type="number"
                        placeholder="To"
                        value={queryTo}
                        onChange={(event) => {
                            if (parseInt(event.target.value) <= 0) return setQueryTo('1')
                            setQueryTo(event.target.value)
                        }}
                        className='max-w-20'
                    />
                </div>
                <DataTable columns={columns} data={historicalPings} />
            </div>
            <div className='h-1/3'>
                <Chart pings={historicalPings} className='h-[25svh]' />
            </div>
        </div>
    )
}