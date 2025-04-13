'use client'

import { useMemo, useState } from "react";
import { Chart } from "./chart";
import { DataTable } from "./data-table";
import type { Data } from "@repo/types";
import { columns } from "./table-columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * This is the Dashboard component for displaying historical data from the backend's database based on
 * user queries.
 */
export default function HistoryDashboard() {
    const [historicalPings, setHistoricalPings] = useState<Data[]>([])
    const [queryFrom, setQueryFrom] = useState<string>('1')
    const [queryTo, setQueryTo] = useState<string>('1')

    // Users input their starting point and ending point before pressing the 'Search' button to receive the correct historical data.
    const history = useMemo(async () => {
        try {
            const response = await fetch('http://localhost:3002/api/responses?' + new URLSearchParams({ start: `${parseInt(queryFrom) - 1}`, limit: queryTo }))
            const history = await response.json()
            return history as Data[]
        } catch (error) {
            console.error('Error fetching data: ', error)
            toast.error('Uh-oh, something went wrong!', {
                description: 'We encountered an error trying to fetch data for this page.',
            })
        }
    }, [queryFrom, queryTo])

    async function handleQuery() {
        const data = await history
        if (!data) return
        setHistoricalPings(data)
    }

    return (
        <div className='flex flex-col flex-grow h-full w-full gap-y-6'>
            <div className='h-2/3'>
                <div className='flex items-center flex-row gap-x-4'>
                    <Input 
                        type="number"
                        placeholder="From"
                        value={queryFrom.toString()}
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
                    <Button onClick={async () => await handleQuery()}>Search</Button>
                </div>
                <DataTable columns={columns} data={historicalPings} />
            </div>
            <div className='h-1/3'>
                <Chart pings={historicalPings} className='h-[25svh]' />
            </div>
        </div>
    )
}