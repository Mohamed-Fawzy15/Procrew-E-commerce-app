import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import style from "./notfound.module.css";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className={style.notFoundContainer}>
      <div className={style.notFoundContent}>
        <h1 className={style.errorCode}>404</h1>
        <h2 className={style.errorTitle}>{t("notFound.message")}</h2>
        <p className={style.errorMessage}>
          {t("notFound.message")} Oops! The page you're looking for doesn't
          exist or has been moved.
        </p>
        <Link to="/" className={style.homeButton}>
          {t("notFound.backToHome")}
        </Link>
      </div>
    </div>
  );
}
