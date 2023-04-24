import React, { useState } from "react";
import Topbar from "../Header/Topbar";
import ListItem from "./ListItem";
import Default from "../pages/default/Home";
import User from "../pages/user/User";
// import CompanyConfig from "../pages/companyInfo/CompanyConfig";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Role from "../pages/role/Role";
import Team from "../pages/MasterManagement/Team/Team";
import TaskType from "../pages/MasterManagement/TaskType/TaskType";
import TaskPriority from "../pages/MasterManagement/TaskPriority/TaskPriority";
import Disposition from "../pages/MasterManagement/Disposition/Disposition";
import CustomerPriority from "../pages/MasterManagement/CustomerPrirority/CustomerPriority";
import Briefing from "../pages/briefing/Briefing";
import AttendanceReport from "../pages/Reports/AttendanceReport";
import CallsReport from "../pages/Reports/CallsReport";
import TaskReport from "../pages/Reports/TaskReport";
import TeamReport from "../pages/Reports/TeamReport";
import BreifingReport from "../pages/Reports/BreifingReport";
import Customers from "../pages/Customer/Customers";
import Task from "../pages/Task/Task";
import CustomerView from "../pages/ViewUser/CustomerView";
import EditCustomer from "../pages/EditCustomer/EditCustomer";
import GlobalSearch from "../pages/GlobalSearch/GlobalSearch";
import DefaultManager from "../pages/DefaultManager/DefaultManager";
import ManagerListItem from "./ManagerListItem";
import TopbarManager from "../Header/TopbarManager";
import TeamShows from "../ManagerPenalPages/TeamsShow/TeamShows";
import Template from "../pages/MasterManagement/Template/Template";
import ManagerTask from "../ManagerPenalPages/ManagerTask/ManagerTask";
import ManagerCustomers from "../ManagerPenalPages/ManagerCustomer.js/ManagerCustomer";
import ManagerAttendanceReport from "../ManagerPenalPages/ManagerReports/ManagerAttendenceReport";
import ManagerCallsReport from "../ManagerPenalPages/ManagerReports/ManagerCallsReport";
import ManagerTaskReport from "../ManagerPenalPages/ManagerReports/ManagerTaskReport";
import ManagerTeamsReport from "../ManagerPenalPages/ManagerReports/ManagerTeamsReport";
import ManagerBreifingReport from "../ManagerPenalPages/ManagerReports/ManagerBreifingReport";
import ManagerBriefing from "../ManagerPenalPages/ManagerBriefing/ManagerBreifing";
import AuditorDashboard from "../AuditorPenalPages/AuditorDashboard/AuditorDashboard";
import AuditorCustomers from "../AuditorPenalPages/AuditorCustomer/AuditorCustomers";
import AuditorTask from "../AuditorPenalPages/AuditorTask/AuditorTask";
import AuditorUser from "../AuditorPenalPages/AuditorUser/AuditorUser";
import Abandoned from "../pages/MasterManagement/Abandoned/Abandoned";
import BreakType from "../pages/MasterManagement/BreakType/BreakType";
import DisplayCompanyData from "../pages/company/DisplayCompanyData";
import DisplayBreakData from "../pages/Break/DisplayBreakData";
import DisplaySfIntegration from "../pages/sf_Integration/DisplaySfIntegration";
import Priority from "../pages/Priority/Priority"
import Claims from "../pages/Claims/Claims"
import TaskStatus from "../pages/TaskStatus/taskstatus";
import RoleClaims from '../pages/roleclaims/RoleClaims'
import Whatsapp from '../pages/Whatsapp/Whatsapp'
import DisplayAllUserData from "../pages/users/DisplayAllUserData";
export default function Dashboard(props) {
  // console.log("props in Dashboard", props);
  const navigate = useNavigate();
  let tempScopes = JSON.parse(localStorage.getItem("scopes"));
  const [scopes, setScopes] = useState([]);
  const [getContainerView, setContainerView] = useState(<></>);

  useEffect(() => {
    chkToken();
    temp();
    showDashboard();
    saveLocal(); // saveLocal function is set always last in useEffect
  }, [props]);

  const saveLocal = () => {
    if (localStorage.getItem("page")) {
      handleComponent(parseInt(localStorage.getItem("page")));
    }
  };

  const temp = async () => {
    let scopes = await JSON.parse(localStorage.getItem("scopes"));
    setScopes(scopes);
  };

  const showDashboard = async () => {
    if (tempScopes.includes("can_login_manager_webpenal")) {
      setContainerView(
        <DefaultManager handleDashComponent={handleComponent} />
      );
    } else if (tempScopes.includes("can_login_auditor_penal")) {
      setContainerView(
        <AuditorDashboard handleDashComponent={handleComponent} />
      );
    } else {
      setContainerView(<Default handleDashComponent={handleComponent} />);
    }
  };

  // $2a$10$W0oUjWFcJ4T9cYjTQQpmNOS8h62Kz5M5S1UpIQhPqrIr.RjkCkSWa

  const chkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/AdminLogin", { replace: true });
    }
  };

  const handleComponent = (opt, view = <></>) => {
    switch (opt) {
      case 1:
        localStorage.setItem("page", 1);
        if (tempScopes.includes("can_login_manager_webpenal")) {
          setContainerView(
            <DefaultManager handleDashComponent={handleComponent} />
          );
        } else if (tempScopes.includes("can_login_auditor_penal")) {
          setContainerView(
            <AuditorDashboard handleDashComponent={handleComponent} />
          );
        } else {
          setContainerView(<Default handleDashComponent={handleComponent} />);
        }
        break;
      // case 2:
      //   localStorage.setItem("page", 2);
      //   setContainerView(
      //     <CompanyConfig handleDashComponent={handleComponent} />
      //   );
        break;
    
        break;
      case 4:
        localStorage.setItem("page", 4);
        setContainerView(<Role handleDashComponent={handleComponent} />);
        break;
      case 4.2:
        localStorage.setItem("page", 4.2);
        setContainerView(<DisplayCompanyData handleDashComponent={handleComponent} />);
        break;
      case 90.5:
        localStorage.setItem("page", 90.5);
        setContainerView(<DisplayAllUserData handleDashComponent={handleComponent} />);
        break;

      case 4.3:
        localStorage.setItem("page", 4.3);
        setContainerView(<DisplayBreakData handleDashComponent={handleComponent} />);
        break;
      case 4.4:
        localStorage.setItem("page", 4.4);
        setContainerView(<DisplaySfIntegration handleDashComponent={handleComponent} />);
        break;
      case 70.1:
        localStorage.setItem("page", 70.1);
        setContainerView(<Priority handleDashComponent={handleComponent} />);
        break;
    
    // Mohit Jain//
        case 80.1:
        localStorage.setItem("page", 80.1);
        setContainerView(<Claims handleDashComponent={handleComponent} />);
        break;
      case 80.2:
        localStorage.setItem("page", 80.2);
        setContainerView(<TaskStatus handleDashComponent={handleComponent} />);
        break;
// Sachin Sharma//
case 90.1:
  localStorage.setItem("page", 90.1);
  setContainerView(<RoleClaims handleDashComponent={handleComponent} />);
  break;
case 90.2:
  localStorage.setItem("page", 90.2);
  setContainerView(<Whatsapp handleDashComponent={handleComponent} />);
  break;
      case 5:
        localStorage.setItem("page", 5);
        if (tempScopes.includes("can_login_manager_webpenal")) {
          setContainerView(
            <ManagerCustomers handleDashComponent={handleComponent} />
          );
        } else if (tempScopes.includes("can_login_auditor_penal")) {
          setContainerView(
            <AuditorCustomers handleDashComponent={handleComponent} />
          );
        } else {
          setContainerView(<Customers handleDashComponent={handleComponent} />);
        }
        break;
      case 6:
        localStorage.setItem("page", 6);
        if (tempScopes.includes("can_login_manager_webpenal")) {
          setContainerView(
            <ManagerTask handleDashComponent={handleComponent} />
          );
        } else if (tempScopes.includes("can_login_auditor_penal")) {
          setContainerView(
            <AuditorTask handleDashComponent={handleComponent} />
          );
        } else {
          setContainerView(<Task handleDashComponent={handleComponent} />);
        }
        break;
      case 7:
        localStorage.setItem("page", 7);
        setContainerView(<Team handleDashComponent={handleComponent} />);
        break;
      case 8:
        localStorage.setItem("page", 8);
        setContainerView(<TaskType handleDashComponent={handleComponent} />);
        break;
      case 9:
        localStorage.setItem("page", 9);
        setContainerView(
          <TaskPriority handleDashComponent={handleComponent} />
        );
        break;
      case 10:
        localStorage.setItem("page", 10);
        setContainerView(<Disposition handleDashComponent={handleComponent} />);
        break;
      case 12:
        localStorage.setItem("page", 12);
        setContainerView(
          <CustomerPriority handleDashComponent={handleComponent} />
        );
        break;
      case 13:
        localStorage.setItem("page", 13);
        if (tempScopes.includes("can_login_manager_webpenal")) {
          setContainerView(
            <ManagerBriefing handleDashComponent={handleComponent} />
          );
        } else {
          setContainerView(<Briefing handleDashComponent={handleComponent} />);
        }
        break;
      case 14:
        if (tempScopes.includes("can_login_manager_webpenal") == true) {
          setContainerView(
            <ManagerAttendanceReport handleDashComponent={handleComponent} />
          );
        } else {
          setContainerView(
            <AttendanceReport handleDashComponent={handleComponent} />
          );
        }
        localStorage.setItem("page", 14);
        break;
      case 15:
        localStorage.setItem("page", 15);
        if (tempScopes.includes("can_login_manager_webpenal")) {
          setContainerView(
            <ManagerCallsReport handleDashComponent={handleComponent} />
          );
        } else {
          setContainerView(
            <CallsReport handleDashComponent={handleComponent} />
          );
        }
        break;
      case 16:
        localStorage.setItem("page", 16);
        if (tempScopes.includes("can_login_manager_webpenal")) {
          setContainerView(
            <ManagerTaskReport handleDashComponent={handleComponent} />
          );
        } else {
          setContainerView(
            <TaskReport handleDashComponent={handleComponent} />
          );
        }
        break;
      case 17:
        localStorage.setItem("page", 17);
        if (tempScopes.includes("can_login_manager_webpenal")) {
          setContainerView(
            <ManagerTeamsReport handleDashComponent={handleComponent} />
          );
        } else {
          setContainerView(
            <TeamReport handleDashComponent={handleComponent} />
          );
        }
        break;
      case 18:
        localStorage.setItem("page", 18);
        if (tempScopes.includes("can_login_manager_webpenal")) {
          setContainerView(
            <ManagerBreifingReport handleDashComponent={handleComponent} />
          );
        } else {
          setContainerView(
            <BreifingReport handleDashComponent={handleComponent} />
          );
        }
        break;
      case 19:
        localStorage.setItem("page", 19);
        setContainerView(<Template handleDashComponent={handleComponent} />);
        break;
      case 20:
        localStorage.setItem("page", 20);
        setContainerView(<Abandoned handleDashComponent={handleComponent} />);
        break;
      case 21:
        localStorage.setItem("page", 21);
        setContainerView(<BreakType handleDashComponent={handleComponent} />);
        break;
      case 35:
        setContainerView(
          <CustomerView handleDashComponent={handleComponent} />
        );
        break;
      case 36:
        setContainerView(
          <EditCustomer handleDashComponent={handleComponent} />
        );
        break;
      case 37:
        setContainerView(
          <GlobalSearch handleDashComponent={handleComponent} />
        );
        break;
      case 38:
        setContainerView(<TeamShows handleDashComponent={handleComponent} />);
        break;
      default:
        setContainerView(view);
        break;
    }
  };

  return (
    <>
      <div id="wrapper">
        {scopes.includes("can_login_manager_webpenal") == true ||
        scopes.includes("can_login_auditor_penal") ? (
          <TopbarManager handleDashComponent={handleComponent} />
        ) : (
          <Topbar
            Dash={getContainerView.type.name}
            handleDashComponent={handleComponent}
          />
        )}
        {scopes.includes("can_login_manager_webpenal") == true ||
        scopes.includes("can_login_auditor_penal") ? (
          <ManagerListItem handleDashComponent={handleComponent} />
        ) : (
          <ListItem handleDashComponent={handleComponent} />
        )}
        <div className="content-page">{getContainerView}</div>
      </div>
    </>
  );
}
