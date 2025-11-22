# Project Setup and Run Instructions

This repository contains the backend and frontend for the StockMaster 2.0 application.

## Prerequisites

- Python 3.10+
- Node.js 18+

## Directory Structure

- `backend/`: FastAPI backend application.
- `frontend2/`: React frontend application.

## Running the Project

You need to run the backend and frontend in separate terminals.

### 1. Run the Backend

1.  Open a terminal and navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
    *If `pip` is not recognized, try `python -m pip install -r requirements.txt`*
3.  Start the backend server:
    ```bash
    uvicorn main:app --reload
    ```
    *If `uvicorn` is not recognized, try `python -m uvicorn main:app --reload`*

The backend will start at `http://127.0.0.1:8000`.

### 2. Run the Frontend

1.  Open a **new** terminal and navigate to the `frontend2` directory:
    ```bash
    cd frontend2
    ```
2.  Install Node dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```

The frontend will typically start at `http://localhost:5173` (check the terminal output).

## Accessing the Application

Once both servers are running, open your browser and go to the frontend URL (e.g., `http://localhost:5173`). It will communicate with the backend API.
