import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import { getDataAxios } from "../../../services/FetchNodeServices";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import UserTable from "./UserTable";
import CustomerTable from "./CustomerTable";
import TaskTable from "./TaskTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function GlobalSearch(props) {
  const [value, setValue] = useState(0);
  const [getUserData, setUserData] = useState([]);
  const [getCustomerData, setCustomerData] = useState([]);
  const [getTaskData, setTaskData] = useState([]);

  useEffect(() => {
    globalSearch();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const globalSearch = async () => {
    var userData = JSON.parse(localStorage.getItem("user"));
    var response = await getDataAxios(
      `usersR/GlobalSearchForNewPenal/${userData.company_id}`
    );
    console.log("response data of global search", response.result);
    setUserData(response.result[0]);
    setCustomerData(response.result[1]);
    setTaskData(response.result[2]);
  };

  return (
    <>
      <div class="container-fluid">
        <div class="card">
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{ borderBottom: 1, borderColor: "divider", fontSize: "14px" }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="fullWidth"
              >
                <Tab label="User" {...a11yProps(0)} />
                <Tab label="Customers" {...a11yProps(1)} />
                <Tab label="Tasks" {...a11yProps(2)} />
                {/* <Tab label="Call logs" {...a11yProps(3)} /> */}
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <UserTable getUserData={getUserData} props={props} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <CustomerTable getCustomerData={getCustomerData} props={props} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <TaskTable getTaskData={getTaskData} props={props} />
            </TabPanel>
          </Box>
        </div>
      </div>
    </>
  );
}
