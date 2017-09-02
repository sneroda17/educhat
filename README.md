# Edu.chat front end
[![Build Status](https://travis-ci.com/urlinq/edu-chat-frontend.svg?token=mm9RnbJmbZJ5jHxpqnXw&branch=master)](https://travis-ci.com/urlinq/edu-chat-frontend)
[![Requirements Status](https://requires.io/github/urlinq/edu-chat-frontend/requirements.svg?branch=master)](https://requires.io/github/urlinq/edu-chat-frontend/requirements/?branch=master)

# Global Readme
- [edu.chat Readme](https://github.com/urlinq/edu-chat-docs/blob/master/README.md)

# Front end roadmap
## What Items are Pending:
* Test and fix glitches in the MVP, so we have a very stable product before the beta
* Implement pagination in the chat box and in the left menu(so when the user scrolls down, more chats will load)
* Push Notifications
## Predicted Completion of Alpha: 
August 31st

# Welcome to the Edu.chat front end team!
Our current application uses ReactJS, Redux with Sagas and Immutable.js and flow, so every member needs to learn about those technologies before working in the project. Here are some materials that we find helpful(feel free to add suggestions):

> You don't need to go over all of those tutorials, just pick one from each list and go through it.

## React
Our JavaScript framework
* [Intro to React](https://facebook.github.io/react/tutorial/tutorial.html)
* [Treehouse React tutorial - Ask Ross for an account](https://teamtreehouse.com/library/react-basics)
* [Start using React to build web applications](https://egghead.io/courses/react-fundamentals)
* [Build with React](http://buildwithreact.com/tutorial)
* [Learn code React JS tutorial](https://www.youtube.com/playlist?list=PLoYCgNOIyGABj2GQSlDRjgvXtqfDxKm5b) -  these videos also cover the basics of Redux

## Redux
Our state management library(the place where we store all of the data used in the app)
* [Learn code Redux tutorials](https://www.youtube.com/playlist?list=PLoYCgNOIyGADILc3iUJzygCqC8Tt3bRXt)
* [Treehouse Redux tutorial](https://teamtreehouse.com/library/building-applications-with-react-and-redux)
* [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux)
* [Bulding idomatic applications with Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux) - more advanced but really good
 
## Redux Saga
How we handle side-effects(making network requests, reading from local storage anything that can be done asyncronosly) 
* [Oficial documentation](https://redux-saga.github.io/redux-saga/)
* [Redux Saga beginner tutorial](https://github.com/redux-saga/redux-saga/blob/master/docs/introduction/BeginnerTutorial.md)
* [Async operations using redux-saga](https://medium.freecodecamp.com/async-operations-using-redux-saga-2ba02ae077b3#.ahpebbl3f)

## ES6
The JavaScript Syntax we use, please not that doing things in the ES5 way(using var, not using the class syntax,etc..) is not accepted
* [ES6 cheat sheet](https://github.com/DrkSephy/es6-cheatsheet)
* [You Don't Know JS: ES6 & Beyond](https://github.com/getify/You-Dont-Know-JS/tree/master/es6%20%26%20beyond)
* [ECMAScript 6 Tutorial](http://ccoenraets.github.io/es6-tutorial/)

## Immutable.js
We use this library to have real immutable data structures(data structures that can't be modified) in JavaScript, this makes our codebase more predictable and easier to reason about.
* [Oficial docs](https://facebook.github.io/immutable-js/docs/)
* [Immutable.js Records](https://tonyhb.gitbooks.io/redux-without-profanity/content/using_immutablejs_records.html)

The stack can seem a little weired at first but don't worry it will all make sense after sometime :)

# The login task
As we don't except that everyone will be ready to jump right into the code every developer in the front-end team is assigned with one simple task. You will need to to write a small React app that calls our authentication APIs and save the response(a json object representing the user who just logged in) in localStorage. The login api can be found at ```api.edu.chat/v1/api/login/``` you will need to write this little app using all of the technologies listed above. After you're done I will provide some feedback on your implementation, don't see this task as a test but as a way to get comfortable with our codebase so feel free to ask me anything about it.

# Development tools

## Text editor/IDE
I don't really like the idea of having a standard text editor in the team, so if you have an editor you really like and know how to use, stick with it. If you're not a pro in any text editor download WebStorm, it has everything you will need to develop the project with 0 configuration.

## Plugins
If you chose not to use WebStorm you will need to install an ESLint plugin in your editor. Most popular ones have an ESLint plugin avaliable so that won't be a be a problem(I can help if you're using VSCode or Atom), ESLint will check if the syntax of your code is wrong and display errors before you run the app, it will also check if the code is complying with our style-guide so it's required for everybody.

## The style-guide
Every .js file in the front-end needs to be formatted in an specific way, [you can read our rules here](https://gist.github.com/lucas-daltro/25ca1e09143d94d9fbcc5f7fee8f1def). Don't worry about memorizing all of it because if you have an ESLint plugin install in your editor(you should) it will already show you the problems.

## Tutorial
- https://btholt.github.io/complete-intro-to-react-v1/

## How to run the project
* Install the necessary dependencies:

            npm install

* Run it!:

            npm start

## Folder Structure
 * containers: holds all of the class based "smart" components.
 * components: holds all of the functional "dumb" components.
 * pages: hold all of the components that represent static pages (home,about,etc...).
 * lib: every code that is related to the project but isn't a component or part of Redux.
 * reducers styles and actions are self explanatory.

## Static Pages
Right now, all of the static pages(about us, careers, team, mission) follow one
basic standard, so as a way to avoid code duplication I (Lucas) decided to make
one single component with all the JSX necessary to render those pages and pass
the text content as props, the text content is in the StaticContent.js file.

## Dependencies
 * [React](https://facebook.github.io/react/docs/getting-started.html): UI library
 * [Redux](http://redux.js.org/): State manangment library
 * [React Router](https://github.com/ReactTraining/react-router): provides routing using HMLT5 push state API
 * [PostCSS](https://github.com/postcss/postcss/tree/master/docs): Adds autoprefixer and some other cool things to our stylesheets
 * [Jquery](http://api.jquery.com/): Used to make AJAX requests *TODO: use a library made only for requests so we can reduce the size of out final JavaScript file*.
 * [Webpack](https://webpack.github.io/docs/): module loader
 * [Babel](https://babeljs.io/): translates ES6 code into ES5 so older browsers can run Edu.chat
 * [Immutable.js](https://facebook.github.io/immutable-js/docs/#/):Immutable collections for JavaScript



## Suggested development tools

### Flow
[Flow](https://flowtype.org/) adds type safety to our code base, please install
a plugin that supports it in your favorite text editor(flow also add decent auto
completion).

### React Dev Tools
[React Dev Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) is a browser extension that helps debugging redux applications.

### Redux Dev Tools
[Redux Dev Tools](https://github.com/zalmoxisus/redux-devtools-extension) is a browser extension that helps debugging redux applications.

## Deployment
I(Lucas) decided to stop using Docker, it was adding too much overhead to something so simple as the frot end. Right now our app is a simple node.js
script running as a deamon using pm2.

### How to update the front end
Generate a new build:

    npm run build

Pull the new code:

    git pull

ssh into the server and cd into the project folder:

    cd edu-chat-web/

restart the deamon:

    pm2 restart serve

## Development Guidelines

* Don't make "render" functions: either merge the markup into the main JSX (if it's small/simple) or factor it out into a separate component and import it
* Names of variables and other code units should describe the thing they do; if you are uncertain about how to clearly name something, ask a teammate
* Local variable names should be in camelCase; constants and action types should be in ALL_CAPS_WITH_UNDERSCORES; class names should be in PascalCase
* Don't use DOM selector methods (e.g., getElementsByClassName or querySelector), use React refs instead
* Anything that goes in a "helpers" file should be a pure function with no knowledge of or relation to any React component or the store
* Don't construct Redux actions manually
* All img tags need an alt property
* Use semantically-appropriate HTML whenever possible
* Use a line length of 100chars


# Port forwarding commands
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8000
iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 4001
