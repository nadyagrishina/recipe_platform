import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { ROUTES } from "../../constants/routes";

type Props = {
  subtext: string;
};

export default function Logo({ subtext }: Props) {
  return (
    <Link to={ROUTES.HOME} className="logo" aria-label="Go to home page">
      <img src={logo} alt="COOK&SHARE logo" />
      <div className="logo__subtext">{subtext}</div>
    </Link>
  );
}
