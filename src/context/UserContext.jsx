import { createContext, useEffect, useState } from "react";
import initialUsers from "../Data/users.json";
import { downloadJSON } from "../utils/downloadJSON";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [users, setUsers] = useState(initialUsers || []); // this got the users from the json file
  const [error, setError] = useState(null);

  //   this step to check if the the user and the token is sync with the localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [user, token]);

  // Download users.json when users change
  useEffect(() => {
    if (users.length) {
      downloadJSON(users, "users.json");
    }
  }, [users]);

  //   handle the login like api
  const login = (values) => {
    setError(null);
    try {
      if (!values.email || !values.password) {
        throw new Error("Email and password are required");
      }

      const existingUser = users.find((u) => u.email === values.email);

      if (!existingUser) {
        throw new Error("User not found. Please sign up.");
      }

      if (existingUser.password !== values.password) {
        throw new Error("Incorrect password");
      }

      const userData = {
        email: existingUser.email,
        name: existingUser.name,
        phone: existingUser.phone,
        role: existingUser.role || "user",
      };

      setUser(userData);
      setToken(`token_${Date.now()}`);

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //   handle the register like api
  const signup = (values) => {
    setError(null);
    try {
      if (
        !values.name ||
        !values.email ||
        !values.password ||
        !values.confirmPassword ||
        !values.phone
      ) {
        throw new Error("all fields are required");
      }

      if (users.some((u) => u.email === values.email)) {
        throw new Error("Email already registered");
      }

      const newUser = {
        email: values.email,
        name: values.name || values.email.split("@")[0],
        password: values.password,
        confirmPassword: values.confirmPassword,
        phone: values.phone,
        role: values.email === "admin@example.com" ? "admin" : "user",
      };

      setUsers((prev) => [...prev, newUser]);

      const userData = {
        email: values.email,
        name: values.name,
        phone: values.phone,
        role: newUser.role,
      };

      setUser(userData);
      setToken(`token_${Date.now()}`);

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //   handle logout
  const logout = () => {
    setError(null);
    setUser(null);
    setToken(null);
  };

  // Manual save for testing
  const saveData = () => {
    downloadJSON(users, "users.json");
  };

  return (
    <UserContext.Provider
      value={{ user, token, users, error, login, signup, logout, saveData }}
    >
      {children}
    </UserContext.Provider>
  );
}
