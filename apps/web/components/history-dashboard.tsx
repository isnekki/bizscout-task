'use client'

import { useMemo, useState } from "react";
import { Chart } from "./chart";
import { DataTable } from "./data-table";
import type { Data } from "@repo/types";
import { columns } from "./table-columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HistoryDashboard() {
    const [historicalPings, setHistoricalPings] = useState<Data[]>([])
    const [queryFrom, setQueryFrom] = useState<number>(1)
    const [queryTo, setQueryTo] = useState<number>(10)

    const history = useMemo(async () => {
        const response = await fetch('http://localhost:3002/api/responses?' + new URLSearchParams({ start: `${queryFrom - 1}`, limit: `${queryTo}` }))
        const history = await response.json()
        return history as Data[]
    }, [queryFrom, queryTo])

    async function handleQuery() {
        setHistoricalPings(await history)
    }

    return (
        <div className='flex flex-col flex-grow h-full w-full gap-y-6'>
            <div className='h-2/3'>
                <div className='flex items-center flex-row gap-x-4'>
                    <Input 
                        type="number"
                        placeholder="From"
                        value={queryFrom.toString()}
                        onChange={(event) => setQueryFrom(parseInt(event.target.value))}
                        className='max-w-20'
                    />
                    to
                     <Input 
                        type="number"
                        placeholder="To"
                        value={queryTo}
                        onChange={(event) => setQueryTo(parseInt(event.target.value))}
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