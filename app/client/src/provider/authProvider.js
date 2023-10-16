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

const setToken = (newToken) => {
  setToken_(newToken);
};

// salva il token nel local storage
useEffect(() => {
  localStorage.setItem("token", token);
}, [token]);

// permette il caching del valore del token
const contextValue = useMemo(
  () => ({
    token,
    setToken,
  }),
  [token]
);
return (
  <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
);
}

export const useAuth = () =>  {return useContext(AuthContext);}
export default AuthProvider;

