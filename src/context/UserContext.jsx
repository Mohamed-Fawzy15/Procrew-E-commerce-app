import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.email) {
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          console.warn("Invalid user data in localStorage, clearing");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Failed to parse localStorage user:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Sync user and token with localStorage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        console.error("Failed to save user to localStorage:", err);
      }
    } else {
      localStorage.removeItem("user");
    }
    if (token) {
      try {
        localStorage.setItem("token", token);
      } catch (err) {
        console.error("Failed to save token to localStorage:", err);
      }
    } else {
      localStorage.removeItem("token");
    }
  }, [user, token]);

  // Handle login
  const login = async (values) => {
    setError(null);
    try {
      if (!values.email || !values.password) {
        throw new Error("Email and password are required");
      }

      const response = await axios.get(
        `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/users`,
        {
          params: { email: values.email },
          timeout: 5000,
        }
      );

      const users = response.data;
      if (!users.length) {
        throw new Error("User not found. Please sign up.");
      }

      const existingUser = users[0];
      if (existingUser.password !== values.password) {
        throw new Error("Incorrect password");
      }

      const userData = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        phone: existingUser.phone,
        role: existingUser.role || "user",
      };

      setUser(userData);
      setToken(`token_${Date.now()}`);
      return userData;
    } catch (err) {
      const errorMessage =
        err.code === "ECONNREFUSED"
          ? "Server is not responding. Please ensure the backend is running."
          : err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Handle register
  const signup = async (values) => {
    setError(null);
    try {
      if (
        !values.name ||
        !values.email ||
        !values.password ||
        !values.confirmPassword ||
        !values.phone
      ) {
        throw new Error("All fields are required");
      }

      if (values.password !== values.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const checkRegistered = await axios.get(
        `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/users`,
        {
          params: { email: values.email },
          timeout: 5000,
        }
      );

      if (checkRegistered.data.length) {
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

      const response = await axios.post(
        `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/users`,
        newUser,
        {
          timeout: 5000,
        }
      );

      const savedUser = response.data;
      const userData = {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        phone: savedUser.phone,
        role: savedUser.role,
      };

      setUser(userData);
      setToken(`token_${Date.now()}`);
      return userData;
    } catch (err) {
      const errorMessage =
        err.code === "ECONNREFUSED"
          ? "Server is not responding. Please ensure the backend is running."
          : err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Handle logout
  const logout = () => {
    setError(null);
    setUser(null);
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ user, token, error, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
}
