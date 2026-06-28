# Ledger — Expense Tracker (Vite + React + PHP + MySQL)

## Folder structure
```
expense-tracker-vite/
├── backend/                  ← PHP API, runs under Apache/XAMPP
│   ├── schema.sql
│   ├── db.php
│   ├── get_expenses.php
│   ├── add_expense.php
│   ├── update_expense.php
│   └── delete_expense.php
├── src/                      ← React source, runs under Vite
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html                ← Vite entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

Two separate servers run at once during development:
- **Apache (XAMPP)** serves the PHP backend → `http://localhost/.../backend`
- **Vite** serves the React frontend with hot-reload → `http://localhost:5173`

They talk to each other over `fetch()`. This is exactly how real companies separate frontend and backend.

---

## Step 1 — Install the tools (one-time)
1. Install **Node.js** (includes npm): https://nodejs.org → download LTS version → install.
2. Install **XAMPP** (gives you Apache + MySQL + PHP): https://www.apachefriends.org → install.
3. Confirm Node installed correctly:
   ```
   node -v
   npm -v
   ```
   Both should print version numbers. If "command not found," restart your terminal/computer after installing.

## Step 2 — Set up the backend (PHP + MySQL)
1. Start **Apache** and **MySQL** from the XAMPP control panel (click "Start" next to each).
2. Copy the `backend` folder into XAMPP's web root:
   - Windows: `C:\xampp\htdocs\expense-tracker\backend`
   - Mac: `/Applications/XAMPP/htdocs/expense-tracker/backend`
3. Open `http://localhost/phpmyadmin` in your browser.
4. Click the **SQL** tab → paste the contents of `backend/schema.sql` → click **Go**.
   This creates the database, the table, and 3 sample rows.
5. Open `backend/db.php` in a code editor — for default XAMPP, the credentials
   already work (`username: root`, `password: ""`). Leave as-is unless you changed
   your MySQL root password.
6. Test it: visit `http://localhost/expense-tracker/backend/get_expenses.php`
   in your browser. You should see JSON output with the 3 sample rows.
   - If you see a blank page or PHP error here, fix that before moving to Step 3.

## Step 3 — Set up the frontend (Vite + React)
1. Open a terminal, navigate into the project folder:
   ```
   cd path/to/expense-tracker-vite
   ```
2. Install dependencies (downloads React, Tailwind, Chart.js, Vite):
   ```
   npm install
   ```
   This creates a `node_modules` folder — don't touch it, don't upload it to GitHub.
3. Start the dev server:
   ```
   npm run dev
   ```
4. Terminal will show something like:
   ```
   ➜  Local:   http://localhost:5173/
   ```
   Open that URL in your browser. You should see the Ledger app, pre-filled
   with the 3 sample rows pulled from your PHP backend.

## Step 4 — Confirm the connection
In `src/App.jsx`, this line controls where React looks for the backend:
```js
const API_BASE = "http://localhost/expense-tracker/backend";
```
If your folder name or XAMPP path differs from `expense-tracker`, update this
line to match wherever `backend/` actually lives, then save — Vite auto-reloads.

## Step 5 — Make changes and see them live
With `npm run dev` running, any edit you save in `src/App.jsx` instantly
updates in the browser — no refresh needed. This is the main benefit of Vite
over the plain CDN version.

## Step 6 — Build for production / deployment later
When you're ready to deploy:
```
npm run build
```
This creates a `dist/` folder containing optimized static files — this is
what you'd upload to Netlify/Vercel as your live frontend. (Don't deploy yet
if you're still developing — `npm run dev` is for local work.)

## Common errors and fixes
- **"Failed to fetch" in browser console** → Apache/MySQL isn't running, or
  `API_BASE` URL is wrong. Re-check Step 2.6.
- **CORS error in console** → Already handled in `db.php`'s headers, but
  double-check you didn't delete those lines.
- **Blank page after `npm run dev`** → check the terminal for red error text;
  it's almost always a typo in `App.jsx`.
- **"npm: command not found"** → Node.js isn't installed or terminal needs
  restarting after install.

## Recap of the daily workflow once everything's set up
1. Start XAMPP → click Start on Apache + MySQL.
2. Open terminal → `cd` into project → `npm run dev`.
3. Code in `src/App.jsx`, browser updates live at `localhost:5173`.
