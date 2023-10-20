import {  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(); //contiene le informazioni che devono essere condivise tra i componenti
// fornisce l'autenthication context
const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem("token")); //ottiene il valore del token dal local storage
  const [user, setUser_] = useState(localStorage.getItem("user")); //contiene le informazioni dell'utente loggato
  const [role, setRole_] = useState(localStorage.getItem("role")); // ruolo dell'utente loggato
const setToken = (newToken) => {
  setToken_(newToken);
};

const setUser = (newUser) => {
  setUser_(newUser);
}

const setRole = (newRole) => {
  setRole_(newRole);
}

// salva il token e l'user nel local storage
useEffect(() => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", user);
  localStorage.setItem("role", role);
}, [token, user, role]);



// permette il caching del valore del token
const contextValue = useMemo(
  () => ({
    token,
    setToken,
    user,
    setUser,
    role,
    setRole
  }),
  [token, user]
);
return (
  <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
);
}

export const useAuth = () =>  {return useContext(AuthContext);}
export default AuthProvider;

