const express = require('express');
const router = express.Router();
import userController from '../controller/userController';
import middleware from '../middleware/middleware';

// Define your route handlers here
router.get('/', (req:any, res:any) => {
  res.send('Hello, this is the homepage!');
});

router.get('/about', (req:any, res:any) => {
    console.log('here');
    
  res.send('This is the About page.');
});

router.post('/register',userController.register);
router.get('/get-profile', middleware.authenticateToken, userController.getProfile);
router.patch('/logout',userController.logout);
router.post('/login',userController.login);
router.post('/image-upload',userController.imageUpload);

// Export the router so that it can be used in the main app file  
module.exports = router;