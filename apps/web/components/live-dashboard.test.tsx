import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import LiveDashboard from './live-dashboard'
import { io } from 'socket.io-client'
import { toast } from 'sonner'

jest.mock('socket.io-client')
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn()
    }
}))

jest.mock('./data-table', () => ({
    DataTable: jest.fn(({ data }) => (
        <div data-testid="data-table">
            <span>Rows: {data.length}</span>
        </div>
    ))
}))

jest.mock('./chart', () => ({
    Chart: jest.fn(({ pings }) => (
        <div data-testid="chart">
            <span>Chart with {pings.length} data points</span>
        </div>
    ))
}))

jest.mock('./table-columns', () => ({
    columns: [{ header: 'Test', accessorKey: 'test' }]
}))

describe('LiveDashboard', () => {
    const mockSocket = {
        on: jest.fn(),
        disconnect: jest.fn(),
    }

    const mockHistoryData = [
        { id: '1', timestamp: new Date(), requestPaylaod: { randomNumber: 1, timestamp: new Date().toString() }, statusCode: 200 },
        { id: '2', timestamp: new Date(), requestPaylaod: { randomNumber: 2, timestamp: new Date().toString() }, statusCode: 200 }
    ]

    const mockNewData = { id: '3', timestamp: new Date(), requestPaylaod: { randomNumber: 3, timestamp: new Date().toString() }, statusCode: 200 }


    beforeEach(() => {
        jest.clearAllMocks();

        (io as jest.Mock).mockReturnValue(mockSocket)

        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockHistoryData)
            })
        )
    })

    it ('renders the dashboard with initial data', async () => {
        render(<LiveDashboard />)

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3002/api/responses?limit=10')

        await waitFor(() => {
            expect(screen.getByTestId('data-table')).toBeInTheDocument()
            expect(screen.getByText('Rows: 2')).toBeInTheDocument()
            expect(screen.getByTestId('chart')).toBeInTheDocument()
            expect(screen.getByText('Chart with 2 data points')).toBeInTheDocument()
        })
    })

    it('connects to the WebSocket and handles events', async () => {
        render(<LiveDashboard />)

        expect(io).toHaveBeenCalledWith('ws://localhost:3001')
        expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function))
        expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function))
        expect(mockSocket.on).toHaveBeenCalledWith('newResponse', expect.any(Function))

        const connectedCallback = mockSocket.on.mock.calls.find(call => call[0] === 'connect')[1]
        const disconnectedCallback = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect')[1]
        const newResponseCallback = mockSocket.on.mock.calls.find(call => call[0] === 'newResponse')[1]

        act(() => { connectedCallback(); })
        expect(toast.success).toHaveBeenCalledWith('Live feed connected!')

        act(() => { disconnectedCallback(); })
        expect(toast.warning).toHaveBeenCalledWith('Disconnected from the live feed.')

        await waitFor(() => {
            act(() => { newResponseCallback(mockNewData) })
        })

        await waitFor(() => {
            expect(screen.getByText('Rows: 3')).toBeInTheDocument()
            expect(screen.getByText('Chart with 3 data points')).toBeInTheDocument()
        })
    })

    it('handles fetch errors properly', async () => {
        global.fetch = jest.fn().mockImplementation(() => {
            Promise.resolve({
                json: () => Promise.reject(new Error('Network error.'))
            })
        })

        render(<LiveDashboard />)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Uh-oh, something went wrong!',
                expect.objectContaining({
                    description: 'We encountered an error fetching data for this page.'
                })
            )
        })
    })

    it('handles failing responses from the websocket properly', async () => {
        const setPingsSpy = jest.fn()
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [[], setPingsSpy])

        render(<LiveDashboard />)
        
        const newResponseCallback = mockSocket.on.mock.calls.find(call => call[0] === 'newResponse')[1]

        setPingsSpy.mockImplementationOnce(() => { throw new Error('Test error') })

        await waitFor(() => {
            act(() => {
                newResponseCallback({ id: '4', timestamp: '2025-01-08' })
            })
        })

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Uh-oh, something went wrong!',
                expect.objectContaining({
                    description: 'We encountered an error trying to read the live data.'
                })
            )
        })
    })

    it('safely disconnects from the websocket', async() => {
        const { unmount } = render(<LiveDashboard />)
        unmount()
        expect(mockSocket.disconnect).toHaveBeenCalled();
    })
})