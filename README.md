# quibim

## Requirements
* Node >= 8
### Development/testing requirements
* Node >= 8
* TypeScript => 3
* gulp (backend only)
* Angular >= 5 (frontend only)
* MongoDB

#### How to test it
Please, make sure you have all dependencies installed
`npm install -g @angular/cli typescript gulp`

Then, browse to backend and frontend directories and execute `npm install` in each one to install all dependencies.

##### Backend
By default, this app uses the following configuration:
`dcm2jpgCommand: ./dcm4che/bin/dcm2jpg
tmpDir: /tmp
dbUrl: mongodb://localhost:27017
dbName: 'quibim'
PORT: 3000`

If you want to set a different value for some of this variables, just set the values you want as environment variables.

To run it, just browse to backend folder and execute `gulp`. By default it will lint, build and run the application.

##### Frontend
By default, this app uses the following configuration:
`apiUrl: http://localhost:3000`

If you want to set a different value for some of this variables, just set the values you want as environment variables.

To run it, just browse to frontend folder and execute `ng serve --open`. It will build and run the app and open a browser to location `http://localhost:4200`