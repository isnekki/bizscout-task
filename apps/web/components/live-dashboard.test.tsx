import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import LiveDashboard from './live-dashboard'
import { io } from 'socket.io-client'
import { toast } from 'sonner'

// Mock dependencies for the live dashboard
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

// Main test
describe('LiveDashboard', () => {
    // Instantiate dummy data
    const mockSocket = {
        on: jest.fn(),
        disconnect: jest.fn(),
    }

    const mockHistoryData = [
        { id: '1', timestamp: new Date(), requestPaylaod: { randomNumber: 1, timestamp: new Date().toString() }, statusCode: 200 },
        { id: '2', timestamp: new Date(), requestPaylaod: { randomNumber: 2, timestamp: new Date().toString() }, statusCode: 200 }
    ]

    const mockNewData = { id: '3', timestamp: new Date(), requestPaylaod: { randomNumber: 3, timestamp: new Date().toString() }, statusCode: 200 }

    // Clear all mocks and reinstantiate global.fetch before each test
    beforeEach(() => {
        jest.clearAllMocks();

        (io as jest.Mock).mockReturnValue(mockSocket)

        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockHistoryData)
            })
        )
    })

    /**
     * 1. Render the live dashboard
     * 2. On mount, the component fetches some filler data
     * 3. Check whether the data has been fetched and presented on the UI correctly
     */
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

    /**
     * 1. Render the live dashboard
     * 2. On mount, the component fetches some filler data
     * 3. Expect to connect to the WebSocket on the backend
     * 4. Replicate each callback for the socket listeners
     * 5. Expect the correct response from each callback
     */
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

    /**
     * 1. Instantiate global.fetch to throw an error
     * 2. Render the live dashboard
     * 3. Fetching will throw an error and should be handled with a Shadcn toast
     */
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

    /**
     * 1. Replicate useState in jest mock form
     * 2. Render the live dashboard
     * 3. Set the implementation of setPings to throw an error
     * 4. Call the socket callback
     * 5. Expect the Shadcn toast to display an error
     */
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

    /**
     * Self-explanatory
     */
    it('safely disconnects from the websocket', async() => {
        const { unmount } = render(<LiveDashboard />)
        unmount()
        expect(mockSocket.disconnect).toHaveBeenCalled();
    })
})