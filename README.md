# snake
This is a snake implementation I'm making from scratch to get experience with Typescript, Web Components, SCSS and HTML Canvas. It's built using Lit Element web components and has a simple typescript game class that runs and draws the game onto the HTML Canvas. I use the native browser EventTarget API to handle events and propagating state to upstream UI components. There is no game development framework used here, everything's from scratch. 

A live version of the game is deployed at [ethanphelps.dev/snake](https://ethanphelps.dev/snake)

To install and run the game, copy the repo url, git clone it, and then run the following in your terminal:
```
cd snake && npm install
```
and then
```
npm run start
```
This should open up a browser window on localhost:3000. Use WASD or the arrow keys to control the snake. Try to eat as much food as possible and don't hit yourself or the walls!