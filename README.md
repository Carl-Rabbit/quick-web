# quick-web

## Frontend

Before running any command
```
cd <PROJECT_ROOT>/frontend
```

### Setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

If you wish to set the service port...
```
npm run serve -- --port=<YOUR_PORT>
```
Example
```
npm run serve -- --port=12000
```

### Backend service redirection
Change redirection rule at `/frontend/vue.config.js`
```
...
proxy: {
  '/api':{
    target: 'http://localhost:5000',    // backend url
    ...
  }
},
...
```
Default frontend server port can also be changed here.

## Backend

Before running any command
```
cd <PROJECT_ROOT>/backend
```
### Set up
```
pip install -r requirements.txt
```

### Run
```
python app.py
```
