import { useForm } from "react-hook-form";
// import style from "./Login.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../Hooks/useUser";

export default function Login() {
  const { login } = useUser();
  const navigate = useNavigate();

  const schema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .regex(/^[a-zA-Z0-9]{8,}$/, "Password must be at least 8 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm({
    mode: "all",
    resolver: zodResolver(schema),
  });

  const handleLogin = async (values) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      reset();
      navigate("/");
    } catch (err) {
      console.log("login failed", err.message);
    }
  };
  return (
    <div className=" container flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col gap-4 justify-center items-center sm:w-full md:w-2/5 bg-gray-100 p-4 rounded-lg"
      >
        {/* form header */}
        <h1 className="text-2xl font-bold">Login</h1>

        {/* email input */}
        <div className="w-full">
          <label htmlFor="email" className="input-label">
            Your Email
          </label>
          <div className="relative">
            <MdEmail className="absolute top-3 left-2 text-blue-500 text-lg" />
            <input
              type="email"
              id="email"
              className="input-style px-7"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </div>
        </div>

        {/* password input */}
        <div className="w-full">
          <label htmlFor="password" className="input-label">
            password
          </label>
          <div className="relative">
            <RiLockPasswordFill className="absolute top-3 left-2 text-blue-500 text-lg" />
            <input
              type="password"
              id="password"
              className="input-style px-7"
              placeholder="password"
              {...register("password")}
            />
            {errors.password && (
              <div className="text-red-500 text-sm">
                {errors.password.message}
              </div>
            )}
          </div>
        </div>

        {/* login button */}
        <button
          type="submit"
          className="btn-main"
          disabled={!isValid || !isDirty}
        >
          Login
        </button>

        <small>
          Don&apos;t have an account?
          <Link to={"/register"} className="text-blue-500 underline">
            Signup
          </Link>
        </small>
      </form>
    </div>
  );
}
