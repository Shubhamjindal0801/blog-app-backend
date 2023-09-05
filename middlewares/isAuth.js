const Session = require('../models/Session')

const isAuth = (req, res, next) => {
//   if (req.session.isAuth) {
//       next()
//   } else {
//       return res.status(400).send({
//           status: 400,
//           message: 'Invalid session, please try to login again!'
//       })
//   }
    // try{
    //     const userData = Session.find({session.user.userId:})
    // }catch{

    // }
    next()
}
module.exports = { isAuth }