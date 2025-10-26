
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

function auth(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({msg:'No token'});
  const token = header.split(' ')[1];
  try{
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  }catch(err){
    return res.status(401).json({msg:'Invalid token'});
  }
}
module.exports = auth;
