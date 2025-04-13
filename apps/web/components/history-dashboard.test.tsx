import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import HistoryDashboard from './history-dashboard'
import { toast } from 'sonner'

// Mock dependencies
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

jest.mock('../web/components/ui/input', () => ({
    Input: jest.fn(({ type, placeholder, value, onChange, className }) => (
        <input 
            data-testid={`input-${placeholder.toLowerCase()}`} 
            type={type} 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange} 
            className={className} 
        />
    ))
}))

// Instantiate global.fetch as a jest function
global.fetch = jest.fn()

describe('History Dashboard', () => {
    // Mock data
    const mockHistoryData = [
        { 
            id: '1', 
            timestamp: new Date(), 
            requestPaylaod: { 
                randomNumber: 1, 
                timestamp: new Date().toString() 
            }, 
            statusCode: 200 
        },
        { 
            id: '2', 
            timestamp: new Date(), 
            requestPaylaod: { 
                randomNumber: 2, 
                timestamp: new Date().toString() 
            }, 
            statusCode: 200 
        },
        { 
            id: '3', 
            timestamp: new Date(), 
            requestPaylaod: { 
                randomNumber: 3, 
                timestamp: new Date().toString() 
            }, 
            statusCode: 200 
        },
    ]

    const moreMockData = [
        { 
            id: '4', 
            timestamp: new Date(), 
            requestPaylaod: { 
                randomNumber: 4, 
                timestamp: new Date().toString() 
            }, 
            statusCode: 200 
        },
        { 
            id: '5', 
            timestamp: new Date(), 
            requestPaylaod: { 
                randomNumber: 5, 
                imestamp: new Date().toString() 
            }, 
            statusCode: 200 
        },
    ]

    let mockFetch: jest.Mock<Promise<Response>>;

    // Run some clearing before and after each test
    beforeAll(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn().mockImplementation(async (url) => {
            if (url.includes('start=0&limit=10')) {
                return Promise.resolve({
                    json: () => Promise.resolve(mockHistoryData)
                })
            } else {
                return Promise.resolve({
                    json: () => Promise.resolve(moreMockData)
                })
            }
        })
    })

    beforeEach(() => {
        mockFetch = (global.fetch as jest.Mock)
    })

    afterEach(() => {
        mockFetch.mockClear()
    })

    /**
     * 1. Render the History Dashboard
     * 2. On mount, the component fetches 10 rows
     * 3. The range inputs have a default value of 1 and 10 respectively
     * 4. Expect that the inputs have those values on mount
     * 5. Check if the rendered data is according to the request
     */
    it('renders the dashboard with default values', async () => {
        render(<HistoryDashboard />)

        expect(screen.getByTestId('input-from')).toHaveValue(1)
        expect(screen.getByTestId('input-to')).toHaveValue(10)

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3002/api/responses?start=0&limit=10'
        )

        await waitFor(() => {
            expect(screen.getByText('Rows: 3')).toBeInTheDocument()
            expect(screen.getByText('Chart with 3 data points')).toBeInTheDocument()
        })
    })

    /**
     * 1. Render the History Dashboard
     * 2. Manually update the values of each input and check if they are updating
     */
    it('updates input values correctly', async () => {
        render(<HistoryDashboard />)

        fireEvent.change(screen.getByTestId('input-from'), { target: { value: '5' } })
        expect(screen.getByTestId('input-from')).toHaveValue(5)
        
        fireEvent.change(screen.getByTestId('input-to'), { target: { value: '10' } })
        expect(screen.getByTestId('input-to')).toHaveValue(10)

        fireEvent.change(screen.getByTestId('input-from'), { target: { value: '-5' } })
        expect(screen.getByTestId('input-from')).toHaveValue(1)
    
        fireEvent.change(screen.getByTestId('input-to'), { target: { value: '0' } })
        expect(screen.getByTestId('input-to')).toHaveValue(1)
    })

    /**
     * 1. Render the History Dashboard
     * 2. Expect to see the initial rendered data after mounting
     * 3. Change the values of the inputs
     * 4. Setting the inputs state causes a new request to be made
     * 5. Expect the new data
     */
    it('fetches data and updates state', async () => { 
        render(<HistoryDashboard />)
        
        await waitFor(() => {
            expect(screen.getByText('Rows: 3')).toBeInTheDocument()
            expect(screen.getByText('Chart with 3 data points')).toBeInTheDocument()
        });

        fireEvent.change(screen.getByTestId('input-to'), { target: { value: '12' } })

        expect(mockFetch).toHaveBeenNthCalledWith(1,'http://localhost:3002/api/responses?start=0&limit=10')
        expect(mockFetch).toHaveBeenNthCalledWith(2,"http://localhost:3002/api/responses?start=0&limit=12")

        expect(mockFetch).toHaveBeenCalledTimes(2)
        
        await waitFor(() => {
            expect(screen.getByText('Rows: 2')).toBeInTheDocument();
            expect(screen.getByText('Chart with 2 data points')).toBeInTheDocument();
        });
    })

    /**
     * 1. Instantiate global.fetch to throw an error
     * 2. Render the History Dashboard
     * 3. Change the value of the top-end range input
     * 4. Expect an error after attempting to fetch
     * 5. Shadcn toast should handle the UI for the error
     */
    it('handles fetch error properly', async () => {
        global.fetch = jest.fn(() => 
            Promise.reject(new Error('Network error'))
        )
        
        render(<HistoryDashboard />)
        
        fireEvent.change(screen.getByTestId('input-to'), { target: { value: '10' } })
        
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Uh-oh, something went wrong!', 
                expect.objectContaining({
                    description: 'We encountered an error trying to fetch data for this page.'
                })
            )
        }, { timeout: 3000 })
        
        expect(screen.getByText('Rows: 0')).toBeInTheDocument()
        expect(screen.getByText('Chart with 0 data points')).toBeInTheDocument()
    })

    /**
     * Similar to the test above but throwing the error on JSON parse rather than on Fetch
     */
    it('handles JSON parsing error properly', async () => {
        global.fetch = jest.fn().mockImplementation(() => 
            Promise.resolve({
                json: () => Promise.reject(new Error('Invalid JSON'))
            })
        )

        render(<HistoryDashboard />)
        
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Uh-oh, something went wrong!', 
                expect.objectContaining({
                    description: 'We encountered an error trying to fetch data for this page.'
                })
            )
        })
    })
})