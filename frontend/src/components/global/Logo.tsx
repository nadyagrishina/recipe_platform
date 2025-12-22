import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { ROUTES } from "../../constants/routes";
import { TEXTS } from "../../constants/texts";

export default function Logo() {
  return (
    <Link to={ROUTES.HOME} className="logo" aria-label="Go to home page">
      <img src={logo} alt="COOK&SHARE logo" />
      <p className="logo__subtext">{TEXTS.header.logo_subtext}</p>
    </Link>
  );
}
