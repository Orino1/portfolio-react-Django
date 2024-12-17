# Portfolio Project

[Visit my Portfolio](https://orino.me)

## Overview

The Portfolio Project is a full-stack web application designed for web developers to showcase their skills, projects. The application is structured with a Django backend that provides RESTful APIs and a React frontend for a dynamic user experience.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

## Features

- Admin authentication with secure password storage.
- CRUD operations for projects and skills.
- Dynamic project listings with detailed descriptions and links.
- User-friendly interface built with React for a responsive experience.
- Ability to manage projects, skills dynamically from the admin dashboard.

## Technologies

- **Backend**: Python Framework (Django)
- **Frontend**: Javascript Library (React)
- **Database**: MySQL
- **Environment**: Python 3.x and Node.js 20.x for the React app
- **Authentication**: JWT as http-only cookies for secure API access

## Project Structure
```
portfolio/
│
├── backend/
│   ├── auth_admin                  # Admin application
│   ├── skills                      # Skills application
│   ├── projects                    # Projects application
│   ├── requirements.txt            # dependencies files
│   └──example.env                  # examples of environment variables
│
├── frontend/
│   ├── example.env                 # examples of environment variables
│   └── src/                        # React source files
│       ├── assets/                 # Folder for images, logos, and other assets
│       │   ├── images/             # Images
│       │   ├── logos/              # Logos
│       │   └── styles/             # styles
│       │       ├── components      # components styles
│       │       ├── layout          # layout styles
│       │       └── pages           # pages styles
│       ├── components/             # Reusable components
│       ├── contexts/               # contexts folder
│       ├── pages/                  # Page components for routing
│       ├── App.js                  # Main app component
│       └── apiService.js           # API service for handling HTTP requests
│
└── README.md                       # Project documentation
```

## API Endpoints

### Authentication Routes

### /api/auth/

#### **POST /login**

Logs in an admin user and returns access and refresh tokens.

- **Request Body**:
    ```json
    {
        "username": "admin_username",
        "password": "admin_password"
    }
    ```

- **Response**:
    - `200 OK`: Successful login and token returned.
    - `400 Bad Request`: Invalid input or admin not found.
    - `500 Internal Server Error`: Database or other unexpected errors.

- **Example**:
    ```json
    {
        "msg": "Login successful."
    }
    ```

#### **GET /refresh/**

Refreshes the access token for an authenticated user.

- **Authorization**: Requires a valid refresh token.
  
- **Response**:
    - `200 OK`: Successful token refresh.
    - `500 Internal Server Error`: Unexpected errors.

- **Example**:
    ```json
    {
        "msg": "Access token refreshed successfully."
    }
    ```

#### **PATCH /password/**

Changes the password for the authenticated admin user.

- **Authorization**: Requires valid access token.
  
- **Request Body**:
    ```json
    {
        "password": "new_password"
    }
    ```

- **Response**:
    - `200 OK`: Successful password update.
    - `400 Bad Request`: Invalid input.
    - `500 Internal Server Error`: Database errors.

- **Example**:
    ```json
    {
        "msg": "password changed successfully"
    }
    ```

#### **GET /status**

Checks if the admin is authenticated and the server is operational.

- **Authorization**: Requires valid access token.

- **Response**:
    - `200 OK`: Authentication status is `True`.
  
- **Example**:
    ```json
    {
        "success": true
    }
    ```
### Skills Routes

### /api/skills/

soon

### Projects Routes

### /api/projects/

soon

## Usage

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/Orino1/portfolio-react-Django.git
    ```
   
2. **Set Up the Backend:**
    - Navigate to the `backend/` folder.
    ```bash
    cd portfolio-react-Django/backend
    ```
    - Create a venv for python:
    ```bash
    python3 -m venv myvenv
    source myvenv/bin/activate
    ```
    - Install the required Python dependencies using pip:
    ```bash
    pip3 install -r requirements.txt
    ```
    - Configure the environment variables by copying the example.env file to .env and modifying the values as needed:
    ```bash
    cp example.env .env
    ```
    - Run the migrations to set up the database:
    ```bash
    python3 manage.py migrate
    ```
    - Initiate the admin account ( username/password: root/root feel free to change them from `portfolio-react-Django/backend/admin_auth/management/commands/create_admin.py` ):
    ```bash
    python3 manage.py create_admin
    ```
    - Start the devlopment server:
    ```bash
    python3 manage.py runserver localhost:8000
    ```
    - The backend should now be running on http://localhost:8000.

3. **Set Up the Frontend:**
    - Navigate to the `frontend/` folder:
    ```bash
    cd portfolio-react-Django/frontend
    ```
    - Install the required Node.js dependencies:
    ```bash
    npm install
    ```
    - Configure the environment variables by copying the example.env file to .env and modifying the values as needed:
    ```bash
    cp example.env .env
    ```
    - Start the React development server:
    ```bash
    npm start
    ```
    - The frontend should now be running on http://localhost:3000

### Deployment ( using nginx )

1. **Building and deploying the Frontend:**
    - Navigate to the `frontend/` folder:
    ```bash
    cd portfolio-react-Django/frontend
    ```
    - Build the React application for production:
    ```bash
    npm run build
    ```
    - Copy the `build/` folder to your sites directory such as:
    ```bash
    cp -r build /var/www/your-site-name
    ```
    - Configuring nginx to serv the frontend:
    ```nginx
    server {
        location / {
			root /var/www/your-site-name;
			index index.html;

			try_files $uri /index.html;
		}

		location ~* \.(js|css|svg|png|jpg|jpeg|gif|ico|woff2|ttf)$ {
			 root /var/www/your-site-name;
		}
    }
    ```
    - Restart `nginx` to apply the changes:
    ```bash
    sudo systemctl restart nginx
    ```
2. **Deploying the Backend:**
     - Navigate to the `backend/` folder.
    ```bash
    cd portfolio-react-Django/backend
    ```
    - Start application using Gunicorn:
    ```bash
    gunicorn -b localhost:8120 backend.wsgi:application
    ```
    - Configuring nginx to act as a reverse proxy for our flask appllication:
    ```
    server {
        location /api/ {
			proxy_pass http://localhost:8120;
			proxy_set_header Host $host;
		}
    }
    ```

### Congratulations ;)