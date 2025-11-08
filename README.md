Please use this README guide to install the SELP (Student Equipment Lending Portal) Application.
When you download the repository, you will find two main folders within it. 
  a. frontend/sel_client (contains UI), and 
  b. SELP (contains the backend server)

INSTALLATION
1. Backend server installation. Make sure you have PYTHON install on your machine
   - cd SELP
   - pip install pipenv
   - pipenv shell
   - make sure you are inside the SELP folder (PWD). If not, run again 'cd SELP'
   - pip install django
   - pip install djangorestframework
   - pip install django-cors-headers
   - python manage.py runserver
  
2. Frontend / UI setup. Make sure you have Node.js and NPM installed
   - npm install
   - npm run dev

Once you complete Steps listed in (1) and (2) you should have the frontend and backend running.

Go to the browser and you can access the login page URL --> **http://localhost:5173**
