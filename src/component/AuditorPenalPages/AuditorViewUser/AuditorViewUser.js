import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { ServerURL } from "../../../services/FetchNodeServices";
import AuditorAttendanceView from "./AuditorAttendanceView";
import AuditorCustomerView from "./AuditorCustomerView";
import AuditorTaskView from "./AuditorTaskView";
import AuditorCallsView from "./AuditorCallsView";
import AuditorCallLiveStatus from "./AuditorCallLiveStatus";

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

export default function AuditorViewUser(props) {
  // console.log("props in ViewUser", props);
  const [value, setValue] = useState(0);
  const [getData, setData] = useState(props.item);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div class="container-fluid">
        <div className="card">
          <div className="card-body">
            <div class="row">
              <div
                class="col-3 col-md-2 form-label"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div class="grid-cont1ainer">
                  <Stack direction="row" spacing={2}>
                    {getData.user_picture == null ? (
                      <Avatar
                        src="assets/images/users/user-7.jpg"
                        sx={{ width: 130, height: 120, borderRadius: "4px" }}
                        variant="square"
                      />
                    ) : (
                      <Avatar
                        src={`${ServerURL}/images/${getData.user_picture}`}
                        sx={{ width: 130, height: 120, borderRadius: "4px" }}
                        variant="square"
                      />
                    )}
                  </Stack>
                </div>
              </div>
              <div class="col-lg-10">
                <div class="row">
                  <div class="col-6 col-md-3">
                    <div class="grid-cont1ainer">
                      <div class="row">
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 12, margin: 0 }}
                        >
                          First Name
                        </label>
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 14, color: "#353A40" }}
                        >
                          {getData.firstname}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="grid-co1ntainer">
                      <div class="row">
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 12, margin: 0 }}
                        >
                          Last name
                        </label>
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 14, color: "#353A40" }}
                        >
                          {getData.lastname}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="grid-con1tainer">
                      <div class="row">
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 12, margin: 0 }}
                        >
                          Mobile
                        </label>
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 14, color: "#353A40" }}
                        >
                          {getData.mobile}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="grid-con1tainer">
                      <div class="row">
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 12, margin: 0 }}
                        >
                          Email
                        </label>
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 14, color: "#353A40" }}
                        >
                          {getData.email}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="grid-con1tainer">
                      <div class="row">
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 12, margin: 0 }}
                        >
                          Role
                        </label>
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 14, color: "#353A40" }}
                        >
                          {getData.RoleName}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="grid-con1tainer">
                      <div class="row">
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 12, margin: 0 }}
                        >
                          Team
                        </label>
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 14, color: "#353A40" }}
                        >
                          {getData.TeamName}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="grid-con1tainer">
                      <div class="row">
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 12, margin: 0 }}
                        >
                          Joining Date
                        </label>
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 14, color: "#353A40" }}
                        >
                          {moment(getData.date_of_joining).format("DD/MM/YYYY")}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="grid-con1tainer">
                      <div class="row">
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 12, margin: 0 }}
                        >
                          Status
                        </label>
                        <label
                          for="simpleinput"
                          class="form-label"
                          style={{ fontSize: 14, color: "#353A40" }}
                        >
                          {getData.status}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AuditorCallLiveStatus getData={getData} {...props} />
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
                <Tab label="Attendance" {...a11yProps(0)} />
                <Tab label="Customers" {...a11yProps(1)} />
                <Tab label="Tasks" {...a11yProps(2)} />
                <Tab label="Call logs" {...a11yProps(3)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <AuditorAttendanceView getData={getData} {...props} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <AuditorCustomerView getData={getData} {...props} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <AuditorTaskView getData={getData} {...props} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <AuditorCallsView getData={getData} />
            </TabPanel>
          </Box>
        </div>
      </div>
    </>
  );
}
