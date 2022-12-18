import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import EditUserPage from "./pages/EditUserPage";
import AddTransactionPage from "./pages/AddTransactionPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path="/"  element={<LoginPage/>} />
        <Route  path="/login" element={<LoginPage/>}/>
        <Route  path="/register" element={<RegisterPage/>}/>
        <Route  path="/home" element={<HomePage/>}/>
        <Route  path="/edit" element={<EditUserPage/>}/>
        <Route  path="/addTransaction" element={<AddTransactionPage/>}/>
        <Route element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
