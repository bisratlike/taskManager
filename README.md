# taskManager
A modern task management web app with time-travel capabilities built using Next.js and Mantine.



## Features

- 🎮 **Undo/Redo** - Built with React useReducer
- 📝 **CRUD Operations** - Create, Read, Update, Delete tasks
- 📅 **Date Management** - Intuitive date picker with validation
- 💾 **Persistent Storage** - LocalState + PostgreSQL integration
- 🎨 **Modern UI** - Powered by Mantine design system



![Screenshot](./taskmanager/public/pre.png)
## Installation

1. Clone repo
```bash
git clone https://github.com/bisratlike/task-manager.git

    Install dependencies



npm install

    Set up environment



.env.local
#  DATABASE_URL in .env.local

    Database setup

npx drizzle-kit generate:pg

Running the App


npm run dev

Tech Stack

    ⚛️ Next.js 14 (App Router)

    🎨 Mantine UI + Dates

    🗄️ Drizzle ORM + PostgreSQL

    ⏳ useReducer state management

    📅 Tabler Icons

    🛠 TypeScript