#[yc-dev.herokuapp.com](http://yc-dev.herokuapp.com)

# About the Team
This application is being built through the University of Florida Computer and Information Sciences Engineering Department. The project is created under Dr. Christina Gardner-McCune’s Intro to Software Engineering Course by students enrolled in the Fall 2015 semester.

## The Development Team for the Youth Combine Project includes:   
* *Khaled Hassan*, Scrum Master/Developer
* *Stephanie Cruz*, Product Manager/Developer
* *Julio Chavez*, Developer
* *Adrian de Zayas*, Developer
* *Shreya Nirmalan*, Developer
* *Matthew Pearson*, Developer 

# About our Project 
Youth Combine is a non-profit organization that promotes health and fitness in children, with the ultimate goal of “eliminating childhood obesity.” In line with their goal of promoting a fitness community for youth, the leaders at Youth Combine want to make the world’s first social network and fitness application for action sports and fitness, specifically for youth. Our development team is working hard to build it for them.

# The Technology
## MEANJS 
![MEAN.JS Logo](http://meanjs.org/img/logo-small.png)

We are using the MEAN stack to develop our application. For more information about MEAN.js, visit their github repository [here](https://github.com/meanjs) or their webpage [here](http://meanjs.org/).  

## Google Maps 
![GoogleMaps Logo](https://www.gstatic.com/images/branding/product/1x/maps_64dp.png)

In addition, we are using Google’s Maps API in order to support the necessary geolocation capabilities within our application. For more information about their API, take a look at their developer site [here](https://developers.google.com/maps/). 

## Bootstrap
![Bootstrap Logo](YC_App_Screenshots/BootstrapLogo.png)

For much of our front-end development, we used Bootstrap's available components and code. FOr more information about Bootstrap, you can visit their general website [here](http://getbootstrap.com/).

Note: In order to fully integrate some Bootstrap components with AngularJS, we used the resources found in this GitHub repository [here](https://angular-ui.github.io/bootstrap/).

# Our Progress
A link to our deployed application is [here](http://yc-dev.herokuapp.com)! 

Here are a few screenshots of our application, organized by feature.

## Landing Page
![Sign In Page](YC_App_Screenshots/SignIn.png)

In order to use the application, you must first create an account. 

### Sign Up
![Sign Up Page](YC_App_Screenshots/SignUp.png)

## Parent Application
### Parent's Feed
![Parent Feed](YC_App_Screenshots/ParentFeed.png)

### Creating a Child Account
![Parent Add Child](YC_App_Screenshots/ParentAddChild.png)

## Child Application
### Child's Feed
![User Feed1](YC_App_Screenshots/Feed1.png)

![User Feed2](YC_App_Screenshots/Feed2.png)

![User Feed3](YC_App_Screenshots/Feed3.png)

### Workout Library 
![Workout Lib](YC_App_Screenshots/WorkoutLib.png)

### Viewing a Workout 
![Workout View](YC_App_Screenshots/WorkoutView.png)

### Starting a Workout
![Workout Start](YC_App_Screenshots/WorkoutStart.png)

### Completing a Workout
![Workout Done](YC_App_Screenshots/SubmitResults.png)

### Viewing the Leaderboard
![Leaderboard View](YC_App_Screenshots/ViewLeaderboard.png)

# Running our application on your local machine
To install and run our application locally: 

1. Install Ruby (meanjs requires sass requires Ruby)
  - <http://rubyinstaller.org/downloads/> on Windows, or your favorite package manager for *nix/OSX
2. Install Python 2.7 (meanjs requires /something/ requires Python)
  - <https://python.org> or your favorite package manager
3. Install sass
  - `gem install sass`
4. Install Node.js
  - <https://nodejs.org>, nvm, other package managers
5. Install MongoDB (optional if using hosted Mongo such as MongoLab)
  - <https://www.mongodb.org/downloads> or your favorite package manager
6. Install Git
  - <https://git-scm.com/> or your favorite package manager
7. Install required packages with NPM
  - `npm install – g bower`
  - `npm install –g grunt-cli`
8. Install optional packages (only required if adding new modules)
 - `npm install –g yo`
 - `npm install -g khaledhassan/generator-meanjs#0.4-dev`
9. Clone this repository 
10. Configure MongoDB connection as described below for development environment
11. In a terminal, run `grunt` from the root of the cloned repository
12. Navigate to http://localhost:3000 

# Database and Server Connections

## To configure the development environment:

1. Copy `config/config.secret.js.template` to `config/config.secret.js`
  - This file is blacklisted in the `.gitignore` file to avoid leaking credentials in the repository.
2. Edit the line containing the TODO comment; put your MongoDB URI in the single quotes in the format: `mongodb://user:pass@host.name:port/db-name`

*Important*: The app will not start in the development environment without this configuration file!

## To configure the production environment (i.e. deploying the app):
 
The production environment reads environment variables rather than configuration files (with a fallback to localhost). To point the app to the MongoDB instance, set either the `MONGOHQ_URL` or `MONGOLAB_URI` environment variables to the connection string described in the development environment section above.

