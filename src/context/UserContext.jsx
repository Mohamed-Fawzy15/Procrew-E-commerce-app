import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);

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

  //   handle the login like api
  const login = (values) => {
    setError(null);
    try {
      if (!values.email || !values.password) {
        throw new Error("Email and password are required");
      }

      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = storedUsers.find((u) => u.email === values.email);

      if (!existingUser) {
        throw new Error("User not found. Please sign up.");
      }

      if (existingUser.password !== values.password) {
        throw new Error("Incorrect password");
      }

      setUser({
        email: existingUser.email,
        name: existingUser.name,
        phone: existingUser.phone,
        role: existingUser.role,
      });
      setToken(`token_${Date.now()}`);
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

      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      if (storedUsers.some((u) => u.email === values.email)) {
        throw new Error("Email already registered");
      }

      const newUser = {
        email: values.email,
        name: values.name || values.email.split("@")[0],
        password: values.password,
        confrimPassword: values.confrimPassword,
        phone: values.phone,
        role: values.email === "admin@example.com" ? "admin" : "user",
      };

      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));

      setUser({
        email: values.email,
        name: values.name,
        phone: values.phone,
        role: newUser.role,
      });

      setToken(`token_${Date.now()}`);
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

  return (
    <UserContext.Provider value={{ user, token, error, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
}
