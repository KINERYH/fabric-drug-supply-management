require('dotenv').config();
const jwt = require('jsonwebtoken')
const accessToken = process.env.ACCESS_TOKEN_SECRET

// TODO: verifica se effettivamente la funzione va qui
const authenticateToken = async(req, res, next) => {
  const authHeader = req.headers['authorization']
   // se il token esiste (prima parte), ritorna la token portion del bearer token, altrimenti undefined
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // token mancante

  jwt.verify(token, accessToken, (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized. Invalid token."}); // token non valido
    req.currentUser = user; // in questo modo il controller può accedere a tutti i dati dell'utente perchè sono nella request
    next() // a questo punto il token è valido e possiamo procedere
  })
}

const releaseToken = (payload) => {
  const token = jwt.sign( payload, accessToken, {expiresIn: '5h'} );
  return token
}

module.exports = {
  authenticateToken,
  releaseToken
}
