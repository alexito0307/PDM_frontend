import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";



interface AuthContextData {
  token: string | null;
  userId: string | null;
  username: string | null
  isLoading: boolean;
  login: (token: string, userId: string, username: string) => Promise<void>; // <-- AÑADIR
  logout: () => Promise<void>;
}

// Creamos el contexto con un valor por defecto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Creamos el "Proveedor"
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedUsername = await AsyncStorage.getItem("username");

        if (storedToken && storedUserId && storedUsername) {
          setToken(storedToken);
          setUserId(storedUserId);
          setUsername(storedUsername);
        }
      } catch (e) {
        console.error("Error cargando datos de auth", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (newToken: string, newUserId: string, newUsername: string) => { 
    try {
      await AsyncStorage.setItem("authToken", newToken);
      await AsyncStorage.setItem("userId", newUserId);
      await AsyncStorage.setItem("username", newUsername);
      
      setToken(newToken);
      setUserId(newUserId);
      setUsername(newUsername);

      router.push("/(tabs)/feed/");
    } catch (e) {
      console.error("Error guardando datos de auth", e);
    }
  };

  // Función de Logout
  const logout = async () => {
    console.log("Cerrando sesión...");
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("username");
      
      setToken(null);
      setUserId(null);
      setUsername(null);

      console.log("Datos borrados. Redirigiendo a login.");
      
      router.replace("/screens/login")

    } catch (e) {
      console.error("Error borrando datos de auth", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, userId, username, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};