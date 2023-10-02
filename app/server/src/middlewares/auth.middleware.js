const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// TODO: trasformare in variabili d'ambiente
const sec = crypto.randomBytes(64).toString('hex')
const refreshToken = crypto.randomBytes(64).toString('hex')

// TODO: verifica se effettivamente la funzione va qui
const authenticateToken = async(req, res, next) => {
  const authHeader = req.headers['authorization']
   // se il token esiste (prima parte), ritorna la token portion del bearer token, altrimenti undefined
  const token = authHeader && authHeader.split(' ')[1]
if (token == null) return res.sendStatus(401)

jwt.verify(token, sec, (err, user) => {
  if (err) return res.sendStatus(403) // token non valido
  req.user = user
  next() // a questo punto il token è valido e possiamo procedere
})
}

module.exports = {
  authenticateToken,
  sec,
  refreshToken
}
