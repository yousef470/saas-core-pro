# SaaS-Core Pro Documentation

## Overview

SaaS-Core Pro is a modern frontend SaaS dashboard template built with React and Vite.

This project is designed to help developers quickly build:

* SaaS Platforms
* CRM Systems
* Startup Dashboards
* Internal Admin Panels
* Business Management Systems

Current version:

**Version 1.0**

---

# Tech Stack

Frontend

* React 19
* Vite
* Tailwind CSS
* React Router
* Framer Motion

Charts

* Recharts

Calendar

* React Big Calendar

Icons

* Lucide React
* React Icons

Utilities

* XLSX
* date-fns
* clsx

Notifications

* React Hot Toast

---

# Installation

Install dependencies

```bash
npm install
```

Start development

```bash
npm run dev
```

Create production build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# Project Structure

```
src/

assets/
components/
context/
data/
hooks/
layouts/
locales/
pages/
routes/
utils/

App.jsx
main.jsx
```

---

# Routing

Main routes include

* Dashboard
* Analytics
* CRM
* Users
* Products
* Orders
* Billing
* Calendar
* Chat
* Kanban
* Notifications
* Profile
* Settings
* Login
* Register

Protected routes are handled through the authentication context.

---

# Authentication

Authentication is implemented completely on the frontend.

Current features

* Login
* Register
* Logout
* Session Persistence
* Role Based Access

Session data is stored inside

```
localStorage
```

using

```
saas_session
```

User database is stored in

```
saas_users
```

---

# Roles

The project supports

Owner

Admin

Editor

User

Each role can have different permissions.

Version 2 will introduce a complete permission system.

---

# Theme System

Supports

* Light Mode
* Dark Mode

Theme is automatically saved inside localStorage.

---

# Internationalization

The project uses

i18next

Current language

* English

Future versions will include

* Arabic
* French
* German

---

# User Management

Current features

* Add User
* Edit User
* Delete User
* Search
* Filter
* User Details
* Password Reset

Future features

* Invite User
* Email Verification
* Avatar Upload
* Permission Matrix

---

# Dashboard Modules

Included modules

Dashboard

Analytics

CRM

Orders

Products

Users

Billing

Calendar

Chat

Kanban

Notifications

Profile

Settings

---

# Customization

Primary color

Edit

```
tailwind.config.js
```

Fonts

Edit

```
src/assets
```

Localization

Edit

```
src/locales
```

Routes

Edit

```
src/routes
```

Pages

Edit

```
src/pages
```

Components

Edit

```
src/components
```

---

# Deployment

Recommended platforms

* Vercel
* Netlify
* Firebase Hosting

Build command

```
npm run build
```

Output folder

```
dist
```

---

# Browser Support

* Chrome
* Edge
* Firefox
* Brave
* Safari

---

# Current Limitations

Version 1.0 is frontend only.

No backend included.

No real database.

No payment gateway.

No REST API.

---

# Planned Versions

## Version 2

* Landing Page
* Better UI
* Better UX
* Responsive Improvements
* Permission Improvements
* Advanced Components

## Version 3

* Node.js Backend
* Express API
* MongoDB
* JWT Authentication
* Stripe
* Email Verification
* File Upload
* Production Ready SaaS

---

# Support

For questions or feature requests, please contact the project author.
