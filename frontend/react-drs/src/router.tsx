import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path="/"  element={<LoginPage/>} />
        <Route  path="/login" element={<LoginPage/>}/>
        <Route  path="/register" element={<RegisterPage/>}/>
        <Route  path="/home" element={<HomePage/>}/>
        <Route element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
