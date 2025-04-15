// src/components/Register.jsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaPhoneAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useUser } from "../../Hooks/useUser";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { signup } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const schema = z
    .object({
      name: z
        .string()
        .min(3, t("register.invalid_name"))
        .max(12, t("register.invalid_name")),
      email: z.string().email(t("register.invalid_email")),
      password: z
        .string()
        .regex(/^[a-zA-Z0-9]{8,}$/, t("register.invalid_password")),
      confirmPassword: z.string(),
      phone: z.string().regex(/^01[0125][0-9]{8}$/, t("register.phone")),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t("register.password_mismatch"),
      path: ["confirmPassword"],
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

  const handleRegister = async (values) => {
    try {
      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phone: values.phone,
      });
      reset();
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err.message);
    }
  };

  return (
    <div className="container flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="flex flex-col gap-4 justify-center items-center w-full md:w-2/5 bg-gray-100 p-4 rounded-lg"
      >
        {/* Form header */}
        <h1 className="text-2xl font-bold">{t("register.title")}</h1>

        {/* Name input */}
        <div className="w-full">
          <label htmlFor="name" className="input-label">
            {t("register.name")}
          </label>
          <div className="relative">
            <IoPerson className="absolute top-3 left-2 text-blue-500 text-lg" />
            <input
              type="text"
              id="name"
              className="input-style px-7"
              placeholder={t("register.name")}
              {...register("name")}
            />
            {errors.name && (
              <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}
          </div>
        </div>

        {/* Email input */}
        <div className="w-full">
          <label htmlFor="email" className="input-label">
            {t("register.email")}
          </label>
          <div className="relative">
            <MdEmail className="absolute top-3 left-2 text-blue-500 text-lg" />
            <input
              type="email"
              id="email"
              className="input-style px-7"
              placeholder={t("register.email")}
              {...register("email")}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </div>
        </div>

        {/* Password input */}
        <div className="w-full">
          <label htmlFor="password" className="input-label">
            {t("register.password")}
          </label>
          <div className="relative">
            <RiLockPasswordFill className="absolute top-3 left-2 text-blue-500 text-lg" />
            <input
              type="password"
              id="password"
              className="input-style px-7"
              placeholder={t("register.password")}
              {...register("password")}
            />
            {errors.password && (
              <div className="text-red-500 text-sm">
                {errors.password.message}
              </div>
            )}
          </div>
        </div>

        {/* Confirm password input */}
        <div className="w-full">
          <label htmlFor="confirmPassword" className="input-label">
            {t("register.confirm_password")}
          </label>
          <div className="relative">
            <RiLockPasswordFill className="absolute top-3 left-2 text-blue-500 text-lg" />
            <input
              type="password"
              id="confirmPassword"
              className="input-style px-7"
              placeholder={t("register.confirm_password")}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
        </div>

        {/* Phone input */}
        <div className="w-full">
          <label htmlFor="phone" className="input-label">
            {t("register.phone")}
          </label>
          <div className="relative">
            <FaPhoneAlt className="absolute top-3 left-2 text-blue-500 text-lg" />
            <input
              type="tel"
              id="phone"
              className="input-style px-7"
              placeholder={t("register.phone")}
              {...register("phone")}
            />
            {errors.phone && (
              <div className="text-red-500 text-sm">{errors.phone.message}</div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn-main"
          disabled={!isValid || !isDirty}
        >
          {t("register.register")}
        </button>

        <small>
          {t("register.have_account")}
          <Link to="/login" className="text-blue-500 underline">
            {t("register.login")}
          </Link>
        </small>
      </form>
    </div>
  );
}
