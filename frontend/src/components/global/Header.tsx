import { TEXTS } from "../../constants/texts";
import Logo from "./Logo";
import Navigation from "./Navigation";

export default function Header(){
  return (
    <header className="header">
      <div className="header__top">
        <Logo />
        <div className="header__buttons">
          <button className="header__button header__button--language">
            {TEXTS.header.language_cz}
          </button>
          <button className="header__button header__button--login">
            {TEXTS.header.login_button}
          </button>
        </div>
      </div>
      <Navigation />
    </header>
  );
}