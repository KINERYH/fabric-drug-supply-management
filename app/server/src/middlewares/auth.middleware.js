require('dotenv').config();
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const accessToken = process.env.ACCESS_TOKEN_SECRET

// TODO: verifica se effettivamente la funzione va qui
const authenticateToken = async(req, res, next) => {
  const authHeader = req.headers['authorization']
   // se il token esiste (prima parte), ritorna la token portion del bearer token, altrimenti undefined
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // token mancante

  jwt.verify(token, accessToken, (err, user) => {
    if (err) return res.status(403).json({ message: "Unauthorized"}); // token non valido
    req.user = user;
    next() // a questo punto il token è valido e possiamo procedere
  })

  // console.log("before decode");
  // // Verify the token using jwt.verify method
  // const decode = jwt.verify(token, accessToken);
  // console.log(decode);
  // next()
}

const releaseToken = (payload) => {
  //TODO: verificare se utilizzare token così o se utilizzare refresh token
  const token = jwt.sign( payload, accessToken, {expiresIn: '1h'} );
  return token
}

module.exports = {
  authenticateToken,
  releaseToken
}
