# 49795-Team3

## Backend
Prerequisite: Python installed, version 3.8.2 or newer

Activate environment with: 
```
cd backend
source env/bin/activate
```

If activating the environment doesn't work, make a new one & install dependencies: 
```
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```
You can exit the virtualenv when done, with:
```
deactivate
```
Run the flask app (API) with: 
```
cd backend
gunicorn api:app
```
The flask app runs locally on the following url & port: http://127.0.0.1:8000

Test the API with postman
![Screenshot](screenshotpostman.png)
## Frontend
Prerequisite: npm installed

Run frontend with 
```
cd app-frontend
npm start
```
