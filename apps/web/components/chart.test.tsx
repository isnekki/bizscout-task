import { render, screen } from '@testing-library/react'
import { Chart } from './chart'
import { Data } from '@repo/types'

const mockData: Data[] = [
    {
        id: 1,
        requestPayload: {
            randomNumber: 1,
            timestamp: new Date().toString()
        },
        responseBody: {
            body: 'mock'
        },
        statusCode: 200,
        timestamp: new Date()
    },
    {
        id: 2,
        requestPayload: {
            randomNumber: 0.5,
            timestamp: new Date().toString()
        },
        responseBody: {
            body: 'mock'
        },
        statusCode: 200,
        timestamp: new Date()
    },
    {
        id: 3,
        requestPayload: {
            randomNumber: 0.75,
            timestamp: new Date().toString()
        },
        responseBody: {
            body: 'mock'
        },
        statusCode: 200,
        timestamp: new Date()
    }
]

describe('Shadcn Chart', () => {
    beforeAll(() => {
        global.ResizeObserver = class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        }
    })

    afterAll(() => { 
        // @ts-expect-error ResizeObserver is added to global in beforeAll
        global.ResizeObserver = undefined;
    })

    /**
     * Check if the chart's container has rendered correctly
     */
    it('renders correctly', () => {
        render(<Chart pings={mockData} />);
        expect(screen.getByTestId('chart-card')).toBeInTheDocument()
    })
})