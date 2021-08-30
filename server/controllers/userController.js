import User from '../models/userModel';

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    await User.create({ username, password, rxs: []})
    
    return next();
  } catch (err) {
    
    return next({ err })
  }
};

userController.findOne = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username }).exec();
    console.log(user)
    res.locals.user = user;
    return next();
  } catch (err) {
    return next({ err })
  }
};

userController.verifyUser = async (req, res, next) => {
  try {
    console.log('Verifying user!')
    if (res.locals.user) {
      const { password } = req.body;
      const user = res.locals.user;

      const match = await user.comparePasswords(password, user.password);

      res.locals.match = match;
      if (!match) {
        res.locals.user.rx = [];
      }
      console.log(match)
    } else {
      res.locals.match = false;
      res.locals.user = {rxs: [], id: ''};
    }

    return next();
  } catch (err) {
    return next({ err })
  }
};

userController.logOut = async (req, res, next) => {
  try {
    console.log('Logging user out!')
    return next();

  } catch (err) {
    return next({ err })
  }
};

userController.addRx = async (req, res, next) => {
  try {
    const { userId, rx } = req.body;
    const { id } = res.locals.rxs[0];
    console.log('addRx 66: ', rx, id)

    const user = await User.findOneAndUpdate( 
      {_id: userId}, 
      {$push: {
        rxs: {name: rx[0], rxId: id}
      }}, 
      {new: true}).exec();
    console.log(user)

    res.locals.id = id;
    
    return next();

  } catch (err) {
    return next({ err })
  }
};

userController.deleteRx = async (req, res, next) => {
  try {
    console.log("deleteRx user!")
    const { id } = req.body;
    
    const user = await User.findOneAndUpdate( 
      {username}, 
      {$pull: {
        rxs: {rxId: id}
      }}, 
      {new: true}).exec();
    
    return next();

  } catch (err) {
    return next({ err })
  }
};

export default userController;