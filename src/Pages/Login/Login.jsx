import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../Hooks/useUser";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function Login() {
  const { login } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const schema = z.object({
    email: z.string().email(t("login.invalid_email")),
    password: z
      .string()
      .regex(/^[a-zA-Z0-9]{8,}$/, t("login.invalid_password")),
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
      const loggedInUser = await login({
        email: values.email,
        password: values.password,
      });
      reset();
      if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
        Swal.fire({
          icon: "success",
          title: t("login.welcome_back_admin"),
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        navigate("/");
        Swal.fire({
          icon: "success",
          title: t("login.welcome_back"),
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: t("login.invalid_email_or_password"),
        timer: 1500,
        showConfirmButton: false,
      });
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
        <h1 className="text-2xl font-bold">{t("login.title")}</h1>

        {/* email input */}
        <div className="w-full">
          <label htmlFor="email" className="input-label">
            {t("login.email")}
          </label>
          <div className="relative">
            <MdEmail className="absolute top-3 left-2 text-blue-500 text-lg" />
            <input
              type="email"
              id="email"
              className="input-style px-7"
              placeholder={t("login.email")}
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
            {t("login.password")}
          </label>
          <div className="relative">
            <RiLockPasswordFill className="absolute top-3 left-2 text-blue-500 text-lg" />
            <input
              type="password"
              id="password"
              className="input-style px-7"
              placeholder={t("login.password")}
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
          {t("login.login")}
        </button>

        <small>
          {t("login.dont_have_account")}
          <Link to={"/register"} className="text-blue-500 underline">
            {t("register.register")}
          </Link>
        </small>
      </form>
    </div>
  );
}
