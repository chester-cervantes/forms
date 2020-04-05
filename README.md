# Field Inspection Review Management System (aka FIRMS)

TO DO: Our project description. 

## Getting Started

These instructions are based on http://meanjs.org/generator.html, except some details have been modified to fix the incompatibility issues of the official tutorial with the latest Node/NPM releases.

### Versions

Below are the versions needed for our project:

```
Node: v12.16.1
NPM: 6.13.4
MEAN: Master
Python: 2.7 -> $ sudo apt-get install python2.7 && $ npm config set python python2.7
```

### Prerequisites
Install MongoDB for your development platform: ```https://www.mongodb.com/download-center/community```
And you will need the following:
```
sudo apt-get install build-essential
```

Then, install the required NPM Packages:

```
$ npm install -g angular
$ npm install -g express
$ npm install -g yo
$ npm install -g generator-meanjs
$ npm install -g bower
$ npm install -g gulp
$ npm install -g node-gyp
```

### Installing

After installing MongoDB and the Required Packages, follow the steps below to get the project running. 

STEP 1:
In the terminal:
```
$ npm install
```
NOTE: 
* This may take some time ...
* If running a local MongoDB database, you will need to start mongod.exe.

STEP 2:
Then, type the command below to run the server at localhost:3000.
```
$ gulp
```
NOTE:
- Master Version DOES NOT use GRUNT to run the server, as the previous versions! It uses GULP instead. The official documentation does not mention this, oddly enough.

STEP 3:
The server should now be up and running at localhost:3000.

## Deployment
Go to https://console.cloud.google.com/compute/instances?project=cmpt470-firms&instancessize=50
Turn on the “firms-vm”.
Click on SSH into the vm when it is turned on
Change to root user by:
```
$ sudo su
```

Change your directory to the project by:
```
$ cd ..
$ cd niccolocarminepucci
$ cd project-470
```

Start the project in production mode that hosts in port 80 for http
```
$ gulp prod
```

From the console compute engine page you can access the static external IP:
Click on the link and to go http://[EXTERNAL_IP] to access the project
or 
go to http://34.83.174.42/


## Authors
Chester Cervantes, ccervant

Jordan Ho, jhho

Mashuque Hasan, hasan

Niccolo Pucci, npucci

Duy Le, dtl11

