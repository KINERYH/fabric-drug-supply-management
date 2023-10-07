require('dotenv').config();
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const acsTokenSecret = process.env.ACCESS_TOKEN_SECRET

// TODO: verifica se effettivamente la funzione va qui
const authenticateToken = async(req, res, next) => {
  const authHeader = req.headers['authorization']
   // se il token esiste (prima parte), ritorna la token portion del bearer token, altrimenti undefined
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // token mancante

  jwt.verify(token, acsTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403) // token non valido
    req.user = user
    next() // a questo punto il token è valido e possiamo procedere
  })
}

const releaseToken = (payload) => {
  //TODO: verificare se utilizzare token così o se utilizzare refresh token
  const token = jwt.sign( payload, acsTokenSecret, {expiresIn: '15'} );
  return token
}

module.exports = {
  authenticateToken,
  releaseToken
}
