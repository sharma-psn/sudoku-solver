# Sudoku Solver

A full-stack Sudoku Solver application built with **Angular** and **NestJS** that supports solving **square** and **rectangular** Sudoku puzzles of multiple sizes.

The solver is designed to work with any valid Sudoku dimensions by dynamically generating the board and solving it using a generalized backtracking algorithm.

---

## 🌐 Live Demo

**Frontend (Vercel)**

https://sudoku-solver-sharma-dev16.vercel.app/

**Backend**

Hosted on **Render**

> **Note:** Since the backend is hosted on Render's free tier, the first request may take **30–60 seconds** while the server wakes up.

---

# Features

## ✅ Completed

- Solve Sudoku puzzles entered manually
- Supports multiple Sudoku sizes
- Supports both square and rectangular Sudoku
- Dynamic Sudoku grid generation
- Dynamic board rendering
- Sudoku validation
- Detects invalid and unsolvable puzzles
- Responsive UI
- REST API built with NestJS

---

## Supported Sudoku Types

| Grid | Box |
|------|------|
| 4 × 4 | 2 × 2 |
| 6 × 6 | 2 × 3 |
| 8 × 8 | 2 × 4 |
| 9 × 9 | 3 × 3 |
| 12 × 12 | 3 × 4 |
| 15 × 15 | 3 × 5 |
| 16 × 16 | 4 × 4 |
| 20 × 20 | 4 × 5 |
| 25 × 25 | 5 × 5 |

The solver works for **any valid row × column box combination**.

---

# Upcoming Features

- 🎲 Random Sudoku Generator
- 🎮 Play Sudoku Game
- 📷 Upload Sudoku Image
- 📸 Camera Capture
- 🔍 OCR-based Sudoku Recognition
- 💾 Puzzle History
- 👤 User Profiles
- 🌙 Dark Mode
- 📊 Statistics Dashboard
- ☁ MongoDB Integration

---

# Tech Stack

## Frontend

- Angular
- TypeScript
- HTML
- CSS

## Backend

- NestJS
- TypeScript
- REST API

## Future Technologies

- MongoDB
- OpenCV
- Tesseract OCR

---

# Architecture

```
               Angular Frontend
                      │
                      │ REST API
                      ▼
              NestJS Backend
                      │
                      ▼
           Generic Sudoku Solver
            (Backtracking Algorithm)
```

---

# Project Structure

```
sudoku-solver/
│
├── frontend/          # Angular Application
│
├── backend/           # NestJS REST API
│
└── README.md
```

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/sharma-psn/sudoku-solver.git
```

---

## Frontend

```bash
cd frontend
npm install
ng serve
```

Runs at

```
http://localhost:4200
```

---

## Backend

```bash
cd backend
npm install
npm run start:dev
```

Runs at

```
http://localhost:3000
```

---

# API

## Solve Sudoku

**POST**

```
/sudoku/solve
```

### Request

```json
{
  "grid": [
    [5,3,0,0,7,0,0,0,0],
    ...
  ]
}
```

### Response

```json
{
  "solution": [
    ...
  ]
}
```

---

# Project Roadmap

## ✅ Phase 0 – Project Setup

- Angular setup
- NestJS setup
- Frontend ↔ Backend communication

---

## ✅ Phase 1 – Universal Sudoku Solver

- Generic Backtracking Solver
- Supports square Sudoku
- Supports rectangular Sudoku
- Sudoku validation
- Invalid puzzle detection

---

## ✅ Phase 2 – Manual Entry UI

- Dynamic Sudoku grid
- Multiple Sudoku sizes
- Responsive UI
- Solve functionality
- Input validation

---

## 🚧 Phase 3 – Puzzle Generator

- Random puzzle generation
- Difficulty selection
- Unique solution validation

---

## 🚧 Phase 4 – Play Sudoku

- Play mode
- Timer
- Hints
- Mistake counter
- Difficulty levels

---

## 🚧 Phase 5 – Image Upload & OCR

- Upload image
- Camera capture
- OCR recognition
- Auto-fill Sudoku board

---

## 🚧 Phase 6 – UI Improvements

- Dark mode
- Better mobile experience
- Animations
- Accessibility improvements

---

## 🚧 Phase 7 – MongoDB Integration

- Save puzzle history
- Saved games
- Statistics
- User accounts

---

# Screenshots

Coming Soon...

---

# Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |

---

# Future Enhancements

- Constraint Propagation Solver
- Dancing Links (Algorithm X)
- AI-assisted solving
- Progressive Web App (PWA)
- Daily Challenges
- Leaderboards
- Multiplayer Sudoku

---

# Contributing

Contributions, suggestions, and feature requests are welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# Author

**P. Sandilya Narasimha Sharma**

GitHub

https://github.com/sharma-psn

---

# License

This project is licensed under the **MIT License**.
