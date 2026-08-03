# Tally Task Tracker

Tally Task Tracker is a task management web application built with React, TypeScript, Vite, and Supabase. It enables users to manage daily tasks, track focus sessions, and monitor productivity through a secure and responsive interface.

## Features

- User authentication using Supabase
- Create, update, and delete tasks
- Schedule tasks by date
- Track task status (Pending, Done, Skipped)
- Focus session timer
- Productivity dashboard
- Responsive user interface
- Secure data access using Supabase Row Level Security (RLS)

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- PostgreSQL
- Vercel

## Installation

Clone the repository:

```bash
git clone https://github.com/sanhotra01/tally-task-tracker.git
```

Navigate to the project directory:

```bash
cd tally-task-tracker
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and add the following:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Obtain these values from your Supabase project under **Settings → API Keys**.

## Database Setup

Run the SQL migration located in the `supabase` directory using the Supabase SQL Editor to create the required database tables and security policies.

## Run the Application

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
.
├── public/
├── src/
├── supabase/
├── package.json
├── vite.config.ts
└── README.md
```

## Deployment

The application is deployed using **Vercel**. Configure the following environment variables before deployment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## License

This project is licensed under the MIT License.
