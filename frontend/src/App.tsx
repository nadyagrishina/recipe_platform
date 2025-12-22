import { Routes, Route } from "react-router-dom";
import Header from "./components/global/Header";
import RecipesPage from "./pages/RecipesPage";

export default function App() {
  return (
    <div className="app">
      <Header/>

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<RecipesPage />}/>
          </Routes>
        </div>
      </main>
    </div>
  );
}
