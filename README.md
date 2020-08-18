## Indroduction
This class project was made for software development class at McGill University.   
It's a backend server of a react app in the class project.   
Also, this app is deployed on Heroku. You may find the links below:  

Heroku: https://blooming-tundra-47041.herokuapp.com    
Frontend React App: https://github.com/jargonless/react-app-heroku.git

## Installation
Before trying out this server, make sure you have installed MongoDB in your device, because this app uses MongoDB as database.  
To install the project and run it on a localhost, first clone the repository: 
```
git clone https://github.com/jargonless/Nodejs-server.git 
```

Then, in the folder of cloned repository, run the following command to install libraries: 
```
npm i
```

In case you don't have npm in your system, visit this link to install it: https://www.npmjs.com/get-npm  
  
Now, in order to pass the Authentication, you need to provide a custom jwt key:
```
export jwtPrivateToken=<YOUR JWT KEY>
```

Now run this command to start
```
npm start
```
This app listens to port 3900, if you'd like to use another port, change the port number in default.json


## Tests
To run automation test, change the environment to test:
```
export NODE_ENV=test
```
If you'd like to manually test this app, set the value "requireAuth" to "false"
```
vi config/default.json
```
Then, you may use any RESTful APIs dissect tool to send HTTP request to http://localhost:3900/api  
I recommand using postman to do so: https://www.postman.com/


