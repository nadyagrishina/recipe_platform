import { NavLink } from "react-router-dom";
import { TEXTS, type Language } from "../../constants/texts";

type Props = {
  lang: Language;
};

export default function Navigation({ lang }: Props) {
  const t = TEXTS[lang];

  return (
    <nav className="nav">
      <NavLink to="/" className="nav__link">
        {t.navigation.recipes}
      </NavLink>

      <NavLink to="/categories" className="nav__link">
        {t.navigation.categories}
      </NavLink>

      <NavLink to="/recipes/new" className="nav__link">
        {t.navigation.create}
      </NavLink>

      <NavLink to="/favorites" className="nav__link">
        {t.navigation.favorites}
      </NavLink>

      <NavLink to="/my-recipes" className="nav__link">
        {t.navigation.my}
      </NavLink>
    </nav>
  );
}
