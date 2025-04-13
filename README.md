# BizScout Take Home Test (HTTP Monitor)

## Introduction

This full-stack application my submission developed as part of the Software Engineer - Full Stack take-home test for BizScout. It is designed to periodically query `httpbin.org/anything` with a randomly generated JSON payload. The application consists of a backend service that makes HTTP POST requests every 5 minutes, stores it in a database, and broadcasts it to connected clients, and a frontend dashboard that displays the response data in tabular format and in chart format.

This README outlines my initial thought-process, architecture overview, technology choice, and other relevant information for the assignment.

## Instalation and Setup

### Clone the repository

```sh
git clone https://github.com/isnekki/bizscout-task.git
cd bizscout-task
```

### Root-level Setup

```sh
# ~/
pnpm install
```

### Backend Setup

1. Navigate to the backend directory: `cd apps/backend`
2. Install the backend dependencies: `pnpm install`

### Frontend Setup

1. Navigate to the frontend directory from the backend directory: `cd ../web`
2. Install the frontend dependencies: `pnpm install`

### Application Usage

1. Run `pnpm dev` in the root folder and wait for both backend and frontend to fully compile
2. Open your web browser and navigate to `http://localhost:3000/`
3. The dashboard will display a table and a chart to present the data. Above that will be a **Live** and **History** tab.
   - The _Live_ tab is where requests will be sent every 5 minutes with data coming from the backend
   - The _History_ tab is where requests can be queried from within a range

## Architecture Overview

This HTTP monitor follows the client-server architecture with a RESTful API.

- The backend service periodically makes requests to `httpbin.org/anything` with a randomly generated JSON payload. The response from `httpbin.org/anything` is then stored in a database with the relevant response body data. This response is also sent to the frontend via Web Socket.
- The frontend service connects to the backend via Web Socket to receive the periodic requests and display the data in tabular form and chart form.

## Choice of Technologies and Reasoning

- **Backend:**
  - Node.js and Nest.js: Although Express.js is the backend library that I have the most experience on, I chose to develop the backend in Nest.js as it seemed more relevant to the team. I took this opportunity also to display my strengths in adapting to new technologies and swift learning.
  - SQlite: SQlite is recommended for use with TypeORM. SQlite is also a very reliable and supports JSON data.
  - Axios: Personal preference for backend HTTP requests
- **Frontend:**
  - Next.js with React TypeScript: A component-based JavaScript UI library with out-of-the-box integration for SSR and SSG for future upgrades to the application.
  - TailwindCSS and Shadcn: Sleek and robust UI components for a uniform and professional look.
- **Development:**
  - Jest: Well-known testing library compatible with both the Nest.js backend and the Next.js frontend
  - TypeScript: Type safety for both the frontend and backend by implementing types that are shared between each other
  - Turbo Repo: Monorepo that supports both Next.js and Nest.js. Simultaneous hot reloading for better DX.

## Asumptions Made

- Assumption 1: The format of the random JSOn payload was not strictly defined, so I implemented a simple structure with key-value pairs.
- Assumption 2: I assumed that the history REST API endpoints should include pagination parameters for performance.

## Future Improvements

- Implement more robust error handling and logging
- Improve frontend UI/UX
- Add more comprehensive testing (more integration and end-to-end testing)
- Store the responses in a separate database or cloud storage (currently stored locally in a db file)
- Extract reusable credentials into an .env file (i.e. localhost:3000)

## Testing Strategy and Core Component Identification

### Testing Strategy

- The testing strategy focused on ensuring the core functionality of the application is working as expected.
- I implemented a CI pipeline using Github Actions to automate testing and linting
- The pipeline runs the unit tests and generates coverage reports for both the backend and frontend.

### Core Component Identification:

I identified the following as core components:

1. **Backend Data Fetching and Storage:** The backend is responsible for providing the data to the frontend.
2. **Real-time Data Broadcasting:** As one of the main instructions in this take-home test, it was essential to get the functionality of live broadcasting working.
3. **Frontend Data Display:** The frontend is responsible for displaying the data receieved from the backend.

# Turborepo starter

### Testing Priorities

I prioritized testing the first with thed **Backend Data Fetching and Storage** as it felt like a major functionality that should be robust before anymore further development. I later on added some testing to the **Frontend Data Display** in order to ensure that the data from the backend is presented accurately.

### Testing Implementation

- Jest for both backend and frontend
- Majority, if not all, the tests are unit tests

#### Backend Testing

```sh
cd apps/backend
pnpm test:watch # or pnpm test:cov for coverage reports
```

#### Frontend Testing

```sh
cd apps/web
pnpm test:watch # or pnpm test:cov for coverage reports
```

## Database Schema

The database has the following columns:

- id: number
- requestPayload: JSON
- responseBody: JSON
- statusCode: number
- timestamp: Date

## Submission

- [Github Repository](https://github.com/isnekki/bizscout-task)
- Contact me via [email](mailto:kane.kristofer.taylor@gmail.com)

## Notes

- I focused more on trying to reach all the criteria requested in the deliverables but also prioritizing code readability and avoiding feature-creep. I wanted to make sure this application was fully functional before adding more features.
- I added documentation comments in each file that I felt was of importance. These comments are aimed to explain my thought-process alongside the functionality of the function or component.
- I made use of LLMs to aid and assist me in my learning experience. I learned the core concepts of Nest development and testing with Jest through this.

## Message to the BizScout Team

Hello, BizScout Team!

Thank you very much for this opportunity to showcase my skills as a full-stack developer. I hope this was a suffice document to explain my development process. If there are any questions, please do not hesitate to reach out to me. I hope to hear from you soon!

Best,
Kane
