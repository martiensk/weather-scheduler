# Job Scheduler App

## What is this?
This is an example JavaScript web application showcasing both front- and back-end technology tech-stacks.<br />
The application itself is a simple job scheduler that will display the results of any job as a card on a dashboard.<br />
There is only one job type available in the example, which will display the current weather in a any location.<br />
The user is able to schedule and delete jobs as required.

## Features
### Tooling
The application is a Monorepo build using NPM with a shared package library, a NodeJS back-end and a Nuxt (Vue) front-end. The entire application is containerised in a Docker container.
### Technology used
- NPM Monorepo
- WebSocket communication.
- Basic JWT authentication.
- TypeScript
- Docker
#### Front-end
 - Nuxt
 - Vue3 composition API
 - Tailwind CS
#### Back-End
 - Express
 - Cron-like scheduling for jobs
 - Server-side caching

## Docker
To build the Docker image run `docker build -t weather-schedule` from the root directory.<br/>
To start the image, run `docker run -p 3000:3000 -p 5000:5000 weather-schedule` from the root directory.<br/>
The app should now be accessible on http://localhost:3000.

> Note:
> It is unconventional to run two applications in a single Docker container as it goes against the Single Responsibility Principle. For this example, however, I opted to host both BE and FE apps in a single container for ease of use.