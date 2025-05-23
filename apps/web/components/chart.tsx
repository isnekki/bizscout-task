"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Data } from "@repo/types"
import { memo } from "react"

/**
 * This is a custom Shadcn Chart component with tweaks to fit the project.
 */
interface SalesChartProps {
  className?: string
  title?: string
  pings: Data[]
}

/**
 * Memoized component to enable caching
 */
export const Chart = memo(function Chart({ className = "", title = "Simulated Data", pings }: SalesChartProps) {
    /**
     * Instantiate a new array and populate it with the ping data as to not affect the original variable.
     * Sort in descending order to match the table data.
     * Format the data to be usable in a chart.
     */
    const pingData = [...pings].sort((a, b) => (
        (new Date(a.requestPayload.timestamp).getTime()) - (new Date(b.requestPayload.timestamp).getTime())
    )).map(ping => ({
        timestamp: ping.requestPayload.timestamp,
        ping: ping.requestPayload.randomNumber * 1000
    }))

    function ChartContent() { 
        return (
            <ResponsiveContainer width="100%" height="100%" data-testid="chart-container">
                <AreaChart  data={pingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    <Area isAnimationActive={false} type="monotone" dataKey="ping" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
            </ResponsiveContainer>
        )
    }

    return (
        <Card className={`h-full w-full ${className}`} data-testid="chart-card">
            <CardHeader className="pb-2">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
                <ChartContent />
            </CardContent>
        </Card>
    )
})

