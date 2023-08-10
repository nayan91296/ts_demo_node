import express from 'express';
import http from 'http';
import IP from 'ip';
import sequelizeInstance from './sequlize';
const User = require('./model/user');
const Post = require('./model/post');
import path from "path";
const routes = require('./route/route');

const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/image', express.static(path.join(__dirname,'/uploads/images')))

app.use('/user', routes);

const port = 3000;

// Replace 'database_name', 'username', 'password', and 'host' with your database configuration


(async () => {
  try {
    await sequelizeInstance.authenticate();
    console.log('Connection to the database has been established successfully.');
    // Define your Sequelize models here or import them from separate files
    // sequelize.addModels([User,Post]); // Add your User model to sequelize
    
    await sequelizeInstance.sync(); // Synchronize models with the database
    startServer();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

function startServer() {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server running at http://${IP.address()}:${port}`);
  });
}
