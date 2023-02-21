## React Websocket Chat
This project was created using **[express.js](https://expressjs.com/)**, **[socket.io](https://socket.io/)** and **[react](https://reactjs.org/)**
### Available ways to use
#### Dev mode:
1. From **/server** directory:
    - Run `npm start` command to start server with hot-reload (nodemon)
2. From **/client** directory:
    - Run `npm start` command to make development build and start hot-reload server (react)
3. Open [localhost:8080](http://localhost:8080) page in your browser
#### Production mode:
1. From **/client** directory:
    - Run `npm build` command to make production build
2. From **/server** directory:
    - Run `node index.js` command to start the server
3. To open page in a browser:
    - On local machine simply open [localhost:8080](http://localhost:8080) page in your browser
    - From other devices site can be reached within **ip_address:8080** (for example: [12.345.678.900:8080](http://12.345.678.900:8080)) *(make sure port **8080** is forwarded)*
###### In both ways remember to use `npm install` in each directory to install dependencies (for the first time)
