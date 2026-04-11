@echo off
echo Starting Vyntra Backend...

if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit .env with your settings
    notepad .env
)

echo.
echo Starting backend on http://localhost:8000
echo.

uvicorn main:app --reload --host 0.0.0.0 --port 8000
