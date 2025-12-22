import { NavLink } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="nav">
      <NavLink to="/" className="nav__link">
        Recipes
      </NavLink>
      <NavLink to="/recipes/new" className="nav__link">
        Create
      </NavLink>
      <NavLink to="/recipes/new" className="nav__link">
        Vecere
      </NavLink>
      <NavLink to="/recipes/new" className="nav__link">
        Zdrave
      </NavLink>
      <NavLink to="/recipes/new" className="nav__link">
        Moje
      </NavLink>
    </nav>
  );
}
