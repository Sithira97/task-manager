# Task Manager Frontend

A modern, highly interactive, and responsive single-page web application (SPA) built using React 19, TypeScript, and Vite. The user interface provides real-time workspaces, drag-and-drop status boards, dynamic analytical charts, calendars, and fluent dark/light modes.

---

## Architecture & Features

- **Component-Driven UI**: Built with reusable React functional components and structured layouts.
- **Vibrant Analytics Dashboard**: Utilizes `recharts` to render:
  - **Status Distribution**: A doughnut chart representing Open, In Progress, and Completed task ratios.
  - **Weekly Velocity**: A bar chart representing task completion frequency over the last 7 days.
- **Drag-and-Drop Task Flow**: Powered by `@dnd-kit` to allow seamless status changes across the Kanban board columns.
- **A11y Accessible Overlays**: Modals and dropdown elements are built on top of `@base-ui/react` primitives to ensure keyboard focus-trapping, ARIA support, and light dismissal.
- **Theme Synchronization**: Implements theme context managing Light, Dark, and System color preferences.
- **Optimistic State Processing**: Automatically intercepts and updates local task states immediately on user action, rolling back transitions if the backend synchronization fails.

---

## State Management (Contexts)

State is distributed across React contexts to minimize prop-drilling:
- [AuthContext.tsx](./src/context/AuthContext.tsx): Manages user login tokens, roles (admin vs. user), and user authentication states.
- [TaskContext.tsx](./src/context/TaskContext.tsx): Manages tasks lists, filtering options (priority, timeframe, search query), teams list data, and implements optimistic create/update/status patches.
- [ThemeContext.tsx](./src/context/ThemeContext.tsx): Syncs the document root element class with light or dark modes.
- [RouterContext.tsx](./src/context/RouterContext.tsx): Client-side path routing simulator matching view components (dashboard, tasks, schedule, teams).

---

## Project Structure

```text
frontend/
├── public/               # Static web assets
├── src/
│   ├── assets/           # Application images and media
│   ├── components/       # Reusable components
│   │   ├── ui/           # Custom low-level component wrappers (Base UI / Tailwind)
│   │   ├── Calendar.tsx  # Monthly calendar interface
│   │   ├── Layout.tsx    # Sidebar & navigation frame wrapper
│   │   ├── TaskCard.tsx  # Kanban task card element
│   │   ├── TaskModal.tsx # Task create/edit forms dialog
│   │   └── TeamCard.tsx  # Team details wrapper
│   ├── context/          # Context providers (Auth, Task, Theme, Router)
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Date manipulation, array filtering, and style helpers
│   ├── pages/            # Core view panels:
│   │   ├── Dashboard.tsx # Admin statistics and Recharts analytics
│   │   ├── Tasks.tsx     # Kanban board layout with filters
│   │   ├── Teams.tsx     # Team profiles list
│   │   ├── Schedule.tsx  # Planner calendar page
│   │   ├── Login.tsx     # Authenticating login view
│   │   └── Register.tsx  # User registrations view
│   ├── types/            # TypeScript type structures and interfaces
│   ├── index.css         # Tailwind global themes and dark mode variables
│   ├── App.tsx           # Application routing orchestrator
│   └── main.tsx          # Client entrypoint mount
├── index.html            # Core HTML template shell
├── vite.config.ts        # Vite plugins and API gateway proxy rules
└── package.json          # Frontend packages registry
```

---

## Configurations & Proxies

Vite is configured inside [vite.config.ts](./vite.config.ts) to run the client-side server on port `3000` and handle local CORS proxy requests:

- All calls starting with `/api` are automatically proxied to the backend REST API server running on `http://127.0.0.1:3001`:
  ```typescript
  proxy: {
    "/api": {
      target: "http://127.0.0.1:3001",
      changeOrigin: true,
    }
  }
  ```

---

## Getting Started

### Installation
1. Ensure the backend server is set up and running on port `3001`.
2. Open a terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Run Local Development Server
Launch Vite's hot-reloading development server:
```bash
npm run dev
```
The application will start at [http://localhost:3000](http://localhost:3000).

### Compile Production Build
Generate an optimized static build bundle under `dist/`:
```bash
npm run build
```

### Code Quality & Linting
Run ESLint guidelines to verify TypeScript syntax rules:
```bash
npm run lint
```
