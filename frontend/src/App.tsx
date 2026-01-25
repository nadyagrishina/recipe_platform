import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Language } from "./constants/texts";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import HeroPage from "./pages/HeroPage";
import RecipesPage from "./pages/RecipesPage";
import CreateRecipePage from "./pages/CreateRecipePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";
import FavoriteRecipes from "./pages/FavoriteRecipes";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import MyRecipes from "./pages/MyRecipes";

export default function App() {
  const [lang, setLang] = useState<Language>("cz");

  return (
    <Routes>
      <Route element={<MainLayout lang={lang} setLang={setLang} />}>
        <Route path="/" element={<HeroPage lang={lang} />} />
        <Route path="/categories" element={<RecipesPage lang={lang} />} />
        <Route path="/recipes/new" element={<CreateRecipePage lang={lang} />} />
        <Route path="/profile" element={<Profile lang={lang} />} />
        <Route path="/favorites" element={<FavoriteRecipes lang={lang} />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage lang={lang} />} />
        <Route path="/my-recipes" element={<MyRecipes lang={lang} />} />
      </Route>

      <Route element={<AuthLayout lang={lang} setLang={setLang} />}>
        <Route path="/login" element={<LoginPage lang={lang} />} />
        <Route path="/register" element={<RegisterPage lang={lang} />} />
      </Route>
    </Routes>
  );
}
