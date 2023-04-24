import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./component/pages/auth/login";
import Dashboard from "./component/Dashboard/Dashboard";
import LoginWithMobile from "./component/pages/LoginWithMobile/LoginWithMobile";
import MobileVerify from "./component/pages/LoginWithMobile/MobileVerify";
import ForgotPassword from "./component/pages/ForgotPassword/ForgotPassword";
import SentMail from "./component/pages/ForgotPassword/SentMail";
import AuditorUser from "./component/AuditorPenalPages/AuditorUser/AuditorUser";
import SuperAdminLogin from "./component/AdminLogin/SuperAdminLogin";

export default function AdminRouter(props) {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Login />} path="/AdminLogin" />
          <Route element={<MobileVerify />} path="/MobileVerify" />
          <Route element={<LoginWithMobile />} path="/LoginMobile" />
          <Route element={<Dashboard />} path="/" />
          <Route element={<ForgotPassword />} path="/ForgotPassword" />
          <Route element={<SentMail />} path="/SentMail" />
          <Route element={<AuditorUser />} path="/AuditorUser" />
          <Route element={<SuperAdminLogin />} path="/LogIn/SuperAdminLogin" />
        </Routes>
      </Router>
    </>
  );
}
