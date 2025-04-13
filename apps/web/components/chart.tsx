"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Data } from "@repo/types"

interface SalesChartProps {
  className?: string
  title?: string
  pings: Data[]
}

export function Chart({ className = "", title = "Simulated Data", pings }: SalesChartProps) {
    const pingData = [...pings].sort((a, b) => (
        (new Date(a.requestPayload.timestamp).getTime()) - (new Date(b.requestPayload.timestamp).getTime())
    )).map(ping => ({
        timestamp: ping.requestPayload.timestamp,
        ping: ping.requestPayload.randomNumber
    }))
    console.log(pingData)

    function ChartContent() { 
        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} tickMargin={10} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}/>
                    <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                    <Tooltip />
                    <Area type="monotone" dataKey="ping" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
            </ResponsiveContainer>
        )
    }

    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
                <ChartContent />
            </CardContent>
        </Card>
    )
}

