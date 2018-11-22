const userController = require('./controller/user');
const spiderController = require('./controller/spider');
module.exports = (router) => {
  router.prefix('/api');

  router
    .get('/profile', userController.profile)
    .post('/login', userController.login)
    .post('/register', userController.register)
    .post('/logout', userController.logout);

  router
    .get('/bbchsk', spiderController.getbbchsk);
};
