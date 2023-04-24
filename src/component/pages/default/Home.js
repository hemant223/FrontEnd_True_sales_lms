import React, { useState, useEffect } from "react";
import $ from "jquery";
import { PieChart } from "react-minimal-pie-chart";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import swal from "sweetalert";
import moment from "moment";
import Pagination from "@mui/material/Pagination";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ProgressBarLine } from "react-progressbar-line";
import TaskView from "../TaskView/TaskView.";
import { PaginationItem } from "@mui/material";
import ProgressBar from "react-bootstrap/ProgressBar";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function Home(props) {
  const [LoginTimeSplit, setLoginTimeSplit] = useState([]);
  const [TalkTimeSplit, setTalkTimeSplit] = useState([]);
  const [TotalBreakSplit, setTotalBreakSplit] = useState([]);
  const [AverageTalkTimeSplit, setAverageTalkTimeSplit] = useState([]);
  const [AverageBreakSplit, setAverageBreakSplit] = useState([]);
  const [Page, setPage] = useState(1);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getActiveUsers, setActiveUsers] = useState([]);
  const [getTotalUsers, setTotalUsers] = useState([]);
  const [getTotalTask, setTotalTask] = useState([]);
  const [getCompletedTask, setCompletedTask] = useState([]);
  const [getTotalLoginTime, setTotalLoginTime] = useState([]);
  const [getTotalTalkTime, setTotalTalkTime] = useState([]);
  const [getAvgTalkTime, setAvgTalkTime] = useState([]);
  const [getAvgBreakTime, setAvgBreakTime] = useState([]);
  const [getTotalBreakTime, setTotalBreakTime] = useState([]);
  const [getMissedCall, setMissedCall] = useState([]);
  const [getAnsweredCall, setAnsweredCall] = useState([]);
  const [getConnectedCall, setConnectedCall] = useState([]);
  const [getNotConnectedCall, setNotConnectedCall] = useState([]);
  const [getTotalCalls, setTotalCalls] = useState([]);
  const [getLowPriority, setLowPriority] = useState([]);
  const [getHighPriority, setHighPriority] = useState([]);
  const [getMediumPriority, setMediumPriority] = useState([]);
  const [getTotalPriority, setTotalPriority] = useState([]);
  const [getTodaysTasks, setTodaysTasks] = useState([]);
  const [getLoading, setLoading] = useState(false);
  const lastWeekStartDate = moment()
    .subtract(1, "weeks")
    .startOf("week")
    .format("DD");
  const lastWeekEndDate = moment()
    .subtract(1, "weeks")
    .endOf("week")
    .format("DD MMM");

  useEffect(() => {
    fetchActiveUsers();
    fetchTotalTask();
    fetchAllWidgetsAnalysis();
    fetchCallsStatus();
    fetchTaskPriorityforDash();
    fetchTodaysTasks();
  }, []);

  useEffect(() => {
    {
      $(function () {
        $(".dial")
          .knob({
            min: getTotalUsers.length,
            max: 1000,
          })
          .trigger("change");
      });
    }
  }, [getTotalUsers]);

  const fetchTodaysTasks = async () => {
    try {
      var userData = JSON.parse(localStorage.getItem("user"));
      var body = {
        todayDate: moment().format("YYYY-MM-DD"),
      };
      var result = await postDataAxios(
        `task/newPenalTodaysDisplayTasks/${userData.company_id}`,
        body
      );
      // console.log("Result of Todays Task Display", result.data);
      if (result.status) {
        setTodaysTasks(result.data);
        //   setTempTableData(result.data);
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      var userData = JSON.parse(localStorage.getItem("user"));
      var responseActive = await getDataAxios(
        `usersR/newPenalActiveUser/${userData.company_id}`
      );
      // console.log("responseActive in home page", responseActive);
      if (responseActive.status == true) {
        setActiveUsers(responseActive.ActiveUser[0]);
        setTotalUsers(responseActive.TotalUsers[0]);
        setLoading(false);
      } else {
        setActiveUsers(0);
        setTotalUsers(0);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchTotalTask = async () => {
    try {
      var userData = JSON.parse(localStorage.getItem("user"));
      var responseCompletedTask = await getDataAxios(
        `taskstatus/showTaskStatus/${userData.company_id}`
      );
      // console.log("responseCompletedTask", responseCompletedTask.result[0]);
      if (responseCompletedTask.result.length != 0) {
        var responseTask = await getDataAxios(
          `task/newPenalTotalTask/${userData.company_id}/${responseCompletedTask.result[0].taskstatus_id}`
        );
        // console.log("responseTotalTask in home page", responseTask);
        if (responseTask.status == true) {
          setTotalTask(responseTask.totalTask[0]);
          setCompletedTask(responseTask.completeTask[0]);
          // setCompletedTask([]);
        } else {
          setTotalTask(0);
          setCompletedTask(0);
        }
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchAllWidgetsAnalysis = async (opt) => {
    try {
      var userData = JSON.parse(localStorage.getItem("user"));
      let startDate, endDate;
      switch (opt) {
        case 1:
          startDate = moment().startOf("month").format("YYYY-MM-DD");
          endDate = moment().format("YYYY-MM-DD");
          break;
        case 2:
          startDate = moment()
            .subtract(1, "months")
            .startOf("month")
            .format("YYYY-MM-DD");
          endDate = moment()
            .subtract(1, "months")
            .endOf("month")
            .format("YYYY-MM-DD");
          break;
        case 3:
          startDate = moment().subtract(3, "months").format("YYYY-MM-DD");
          endDate = moment().format("YYYY-MM-DD");
          break;
        default:
          startDate = moment()
            .subtract(1, "weeks")
            .startOf("week")
            .format("YYYY-MM-DD");
          endDate = moment()
            .subtract(1, "weeks")
            .endOf("week")
            .format("YYYY-MM-DD");
          break;
      }
      var responseAllAnalysis = await getDataAxios(
        `attendence/auditorPenalDahsobardWidgets/${userData.company_id}/${startDate}/${endDate}`
      );
      if (responseAllAnalysis.status == true) {
        setTotalLoginTime(responseAllAnalysis.TotalLoginTimeFormatted);
        setLoginTimeSplit(
          responseAllAnalysis.TotalLoginTimeFormatted.split(":")[2]
        );
        setTotalTalkTime(responseAllAnalysis.TotalTalkTimeformatted);
        setAvgTalkTime(responseAllAnalysis.AverageTalkTimeFormatted);
        setTalkTimeSplit(
          responseAllAnalysis.TotalTalkTimeformatted.split(":")[2]
        );
        setAverageTalkTimeSplit(
          responseAllAnalysis.AverageTalkTimeFormatted.split(":")[2]
        );
        setTotalBreakTime(responseAllAnalysis.TotlBrkFormatted);
        setAvgBreakTime(responseAllAnalysis.AvgBrkFormatted);
        setTotalBreakSplit(responseAllAnalysis.TotlBrkFormatted.split(":")[2]);
        setAverageBreakSplit(responseAllAnalysis.AvgBrkFormatted.split(":")[2]);
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchCallsStatus = async () => {
    try {
      var userData = JSON.parse(localStorage.getItem("user"));
      var responseCallStatus = await getDataAxios(
        `calls/newPenalAnsweredAndMissed/${userData.company_id}`
      );
      // console.log("responseCallStatus all in one", responseCallStatus);
      if (responseCallStatus.status == true) {
        setMissedCall(responseCallStatus.Missed[0]);
        setAnsweredCall(responseCallStatus.Answered[0]);
        setConnectedCall(responseCallStatus.Connected[0]);
        setNotConnectedCall(responseCallStatus.NotConnected[0]);
        setTotalCalls(responseCallStatus.TotalCalls[0]);
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchTaskPriorityforDash = async () => {
    var userData = JSON.parse(localStorage.getItem("user"));
    const getTaskPriorityId = JSON.parse(localStorage.getItem("taskPirority"));
    try {
      const body = {
        high: getTaskPriorityId[0].task_priority_id,
        medium: getTaskPriorityId[1].task_priority_id,
        low: getTaskPriorityId[2].task_priority_id,
      };
      var responseTaskPriority = await postDataAxios(
        `task/newPenalTaskPriorityName/${userData.company_id}`,
        body
      );
      console.log("responseTaskPriority all in oneeee", responseTaskPriority);
      if (responseTaskPriority.status == true) {
        setLowPriority(responseTaskPriority.lowPriority[0]);
        setHighPriority(responseTaskPriority.highPriority[0]);
        setMediumPriority(responseTaskPriority.mediumPriority[0]);
        setTotalPriority(responseTaskPriority.TotalPriority[0]);
      }
    } catch (e) {
      console.log("e", e);
    }
  };

  const handleViewPage = (item) => {
    props.handleDashComponent(
      "",
      <TaskView
        taskDetail={item}
        handleDashComponent={props.handleDashComponent}
      />
    );
  };

  const sortTable = (n) => {
    let table,
      rows,
      switching,
      i,
      x,
      y,
      willSwitch,
      directory,
      switchCount = 0;
    table = document.getElementById("productTable");
    switching = true;
    directory = "ascending";

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        willSwitch = false;

        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        if (directory === "ascending") {
          if (n === 0) {
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
              willSwitch = true;
              break;
            }
          } else if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            willSwitch = true;
            break;
          }
        } else if (directory === "descending") {
          if (n === 0) {
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
              willSwitch = true;
              break;
            }
          } else if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            willSwitch = true;
            break;
          }
        }
      }
      if (willSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;

        switchCount++;
      } else {
        if (switchCount === 0 && directory === "ascending") {
          directory = "descending";
          switching = true;
        }
      }
    }
  };

  const showEntry = (value) => {
    setEntryEnd(
      entryStart + value > getTodaysTasks.length
        ? getTodaysTasks.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getTodaysTasks.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getTodaysTasks.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const showEmployee = (i) => {
    let id = "";
    let firstname = "";
    let lastname = "";
    let mobile = "";
    let date = "";
    let type = "";
    let taskpriority = "";
    let addedDate = "";
    try {
      id = getTodaysTasks[i].id;
      firstname = getTodaysTasks[i].firstname;
      lastname = getTodaysTasks[i].lastname;
      mobile = getTodaysTasks[i].mobile;
      date = moment(getTodaysTasks[i].created_at).format("DD/MM/YYYY HH:mm: a");
      type = getTodaysTasks[i].TaskType;
      taskpriority = getTodaysTasks[i].TaskPriority;
      addedDate = moment(getTodaysTasks[i].task_added_date).format(
        "DD/MM/YYYY"
      );
    } catch {
      id = "";
      firstname = "";
      lastname = "";
      mobile = "";
      date = "";
      type = "";
      taskpriority = "";
      addedDate = "";
    }
    return (
      <tr>
        <td>{id}</td>
        <td>
          {" "}
          {firstname} &nbsp;
          {lastname}{" "}
        </td>
        <td> {mobile}</td>
        <td> {date}</td>
        <td>{type}</td>

        <td>
          {taskpriority === "High Priority" ? (
            <span
              class="badge"
              style={{
                backgroundColor: "#F90E0E",
                padding: 7,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {taskpriority}
            </span>
          ) : taskpriority === "Low Priority" ? (
            <span
              class="badge"
              style={{
                backgroundColor: "#1241DE",
                padding: 7,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {taskpriority}
            </span>
          ) : taskpriority === "Medium Priority" ? (
            <span
              class="badge"
              style={{
                backgroundColor: "#2B921B",
                padding: 7,
                fontSize: 11,
                fontWeight: 400,
              }}
            >
              {taskpriority}
            </span>
          ) : (
            <div style={{ color: "white", fontWeight: 600 }}>
              {taskpriority}{" "}
            </div>
          )}
        </td>
        <td>{addedDate}</td>
        <td>
          <span
            style={{
              backgroundColor: "#2B921B",
              padding: 7,
              fontSize: 11,
              fontWeight: 400,
              cursor: "pointer",
            }}
            class="badge"
            onClick={() => handleViewPage(getTodaysTasks[i])}
          >
            <i class="mdi mdi-eye"></i>View
          </span>
        </td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < getTodaysTasks.length
        ? (entNumber + 1) * entriesPerPage
        : getTodaysTasks.length
    );
    setPage(value);
  };

  const NextFun = () => {
    return <div>Next</div>;
  };
  function BackFun() {
    return <div>Previous</div>;
  }

  const handlePaging = () => {
    let totalPages = getTodaysTasks.length / entriesPerPage;
    let CheckFloatnumber =
      Number(totalPages) === totalPages && totalPages % 1 !== 0;

    return (
      <>
        <Pagination
          color="primary"
          // color="secondary"
          variant="outlined"
          shape="rounded"
          count={parseInt(
            CheckFloatnumber == true ? totalPages + 1 : totalPages
          )}
          page={Page}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: BackFun, next: NextFun }}
              {...item}
            />
          )}
          onChange={handlePageNumber}
        />
      </>
    );
  };

  const userd = (a, t) => {
    if (a == 0 || t == 0) {
      return "00...";
    } else {
      // return `(${(a / t) * 100}%)`

      return `(${((a / t) * 100).toFixed(2)}%)`;
    }
  };

  const userT = (b, c) => {
    if (b == 0 || c == 0) {
      return "00...";
    } else {
      return `(${((b / c) * 100).toFixed(2)}%)`;
    }
  };

  return (
    <>
      {getLoading ? (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: "75vh",
          }}
        >
          <img src="/images/loader.gif" width="20%" />
        </div>
      ) : (
        <div>
          <div class="content">
            {/* Start Content*/}
            <div class="container-fluid">
              <div class="row">
                {/* end col */}
                <div class="col-xl-6 col-md-6">
                  <div class="row">
                    {/* end col */}
                    <div class="col-xl-6 col-md-6 col-lg-66">
                      <div class="card">
                        <div class="card-body card-body-admin">
                          <h4 class="header-title mt-0 mb-2">Total users</h4>
                          <div class="widget-chart-1">
                            <div
                              class="widget-chart-box-1 float-start"
                              dir="ltr"
                            >
                              <div style={{ width: 72, height: 72 }}>
                                <CircularProgressbar
                                  value={getTotalUsers.length}
                                  text={`${getTotalUsers.length}`}
                                  // maxValue={100}
                                  maxValue={getTotalUsers.length}
                                  styles={buildStyles({
                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                    strokeLinecap: "butt",
                                    // Text size
                                    textSize: 16,
                                    // How long animation takes to go from one percentage to another, in seconds
                                    pathTransitionDuration: 1,
                                    // Can specify path transition in more detail, or remove it entirely
                                    pathTransition: "none",
                                    // Colors
                                    pathColor: `rgba(240, 80, 80, 1)`,
                                    textColor: "#f05050",
                                    trailColor: "#ededed",
                                    backgroundColor: "#f05050",
                                  })}
                                />
                              </div>
                            </div>
                            <div class="widget-detail-1 text-end">
                              <h4 class="fw-bold pt-2 mb-1 ">
                                {getActiveUsers.length}{" "}
                                <span>
                                  {userd(
                                    getActiveUsers.length,
                                    getTotalUsers.length
                                  )}
                                </span>
                              </h4>
                              <p class="text-muted mb-1 font-11">
                                Active users
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-6 col-md-6 col-lg-66">
                      <div class="card">
                        <div class="card-body card-body-admin">
                          <h4 class="header-title mt-0 mb-2">Tasks</h4>
                          <div class="widget-chart-1">
                            <div
                              class="widget-chart-box-1 float-start"
                              dir="ltr"
                            >
                              <div style={{ width: 72, height: 72 }}>
                                <CircularProgressbar
                                  value={getTotalTask.length}
                                  text={`${getTotalTask.length}`}
                                  // maxValue={100}
                                  maxValue={getTotalTask.length}
                                  styles={buildStyles({
                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                    strokeLinecap: "butt",
                                    // Text size
                                    textSize: 16,
                                    // How long animation takes to go from one percentage to another, in seconds
                                    pathTransitionDuration: 0.5,
                                    // Can specify path transition in more detail, or remove it entirely
                                    pathTransition: "none",
                                    fontWeight: 700,
                                    // Colors
                                    pathColor: `rgba(240, 80, 80, 1)`,
                                    textColor: "#f05050",
                                    trailColor: "#ededed",
                                    backgroundColor: "#f05050",
                                  })}
                                />
                              </div>
                            </div>
                            <div class="widget-detail-1 text-end">
                              <h4 class="fw-bold pt-2 mb-1 ">
                                {getCompletedTask.length == 0
                                  ? 0
                                  : getCompletedTask.length}{" "}
                                <span>
                                  {userT(
                                    parseInt(getCompletedTask.length),
                                    parseInt(getTotalTask.length)
                                  )}
                                </span>
                              </h4>
                              <p class="text-muted mb-1 font-11">
                                Completed Tasks
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    {/* end col */}
                    <div class="col-xl-6 col-md-6 col-lg-66">
                      <div class="card">
                        <div class="card-body card-body-admin">
                          <h4 class="header-title mt-0 mb-3">Call Progress</h4>
                          <h5 class="mt-0 mb-0">
                            Total calls
                            <span
                              class="float-end mt-2"
                              style={{ color: "#35b8e0" }}
                            >
                              {getTotalCalls.length}
                            </span>
                            <ProgressBar
                              variant="info"
                              now={getTotalCalls.length}
                              style={{
                                height: "5.5px",
                                backgroundColor: "lightcyan",
                              }}
                            />
                          </h5>

                          <h5 class="mt-2 mb-0">
                            Connected
                            <ProgressBarLine
                              value={getConnectedCall.length}
                              max={getTotalCalls.length}
                              strokeWidth={3}
                              trailWidth={3}
                              styles={{
                                path: {
                                  stroke: "#10c469",
                                },
                                trail: {
                                  stroke: "rgba(16,196,105,.2)",
                                },
                                text: {
                                  // display: "none !important",
                                  fill: "#10c469",
                                  textAlign: "right",
                                },
                                animationName: "animationProgress",
                              }}
                            />
                          </h5>
                          <h5 class="mt-2  mb-0">
                            Not Connected{" "}
                            <ProgressBarLine
                              value={
                                (getNotConnectedCall.length /
                                  getTotalCalls.length) *
                                100
                              }
                              max={getTotalCalls.length}
                              strokeWidth={3}
                              trailWidth={3}
                              styles={{
                                path: {
                                  stroke: "#f9c851",
                                },
                                trail: {
                                  stroke: "rgba(249,200,81,.2)",
                                },
                                text: {
                                  fill: "#f9c851",
                                  textAlign: "right",
                                },
                                animationName: "animationProgress",
                              }}
                            />
                          </h5>
                          <h5 class="mt-2 mb-0">
                            Missed{" "}
                            <ProgressBarLine
                              value={getMissedCall.length}
                              max={getTotalCalls.length}
                              strokeWidth={3}
                              trailWidth={3}
                              styles={{
                                path: {
                                  stroke: "#ff5b5b",
                                },
                                trail: {
                                  stroke: "rgba(255,91,91,.2)",
                                },
                                text: {
                                  fill: "#ff5b5b",
                                  textAlign: "right",
                                },
                                animationName: "animationProgress",
                              }}
                            />
                          </h5>
                          <h5 class="mt-2 mb-0">
                            Answered
                            <ProgressBarLine
                              value={getAnsweredCall.length}
                              max={getTotalCalls.length}
                              strokeWidth={3}
                              trailWidth={3}
                              styles={{
                                path: {
                                  stroke: "#10c469",
                                },
                                trail: {
                                  stroke: "rgba(16,196,105,.2)",
                                },
                                text: {
                                  fill: "#10c469",
                                  textAlign: "right",
                                },
                                animationName: "animationProgress",
                              }}
                            />
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-6 col-md-6 col-lg-66">
                      <div class="card">
                        <div class="card-body card-body-admin">
                          <h4 class="header-title mt-0">Task Priority</h4>
                          <div class="widget-chart text-center">
                            <PieChart
                              style={{ maxWidth: "178px", maxHeight: "178px" }}
                              animate={true}
                              animationDuration={5000}
                              label={({ dataEntry }) =>
                                `${Math.round(
                                  dataEntry.value != 0 ? dataEntry.value : null
                                )}%`
                              }
                              labelStyle={{ fontSize: 6 }}
                              background="#2c3e50"
                              data={[
                                {
                                  title: `${
                                    (getMediumPriority.length /
                                      getTotalPriority.length) *
                                    100
                                  }% Medium`,
                                  value: parseInt(
                                    (getMediumPriority.length /
                                      getTotalPriority.length) *
                                      100
                                  ),
                                  color: "#575fcf",
                                },
                                {
                                  title: `${
                                    (getHighPriority.length /
                                      getTotalPriority.length) *
                                    100
                                  }% High`,
                                  value: parseInt(
                                    (getHighPriority.length /
                                      getTotalPriority.length) *
                                      100
                                  ),
                                  color: "#ffb848",
                                },
                                {
                                  title: `${
                                    (getLowPriority.length /
                                      getTotalPriority.length) *
                                    100
                                  }% Low`,
                                  value: parseInt(
                                    (getLowPriority.length /
                                      getTotalPriority.length) *
                                      100
                                  ),
                                  color: "#ff9ff3",
                                },
                              ]}
                            />
                            <ul class="list-inline chart-detail-list mb-0">
                              <li class="list-inline-item">
                                <h5 style={{ color: "#ff8acc" }}>
                                  <i class="fa fa-circle me-1" />
                                  Low
                                </h5>
                              </li>
                              <li class="list-inline-item">
                                <h5 style={{ color: "#5b69bc" }}>
                                  <i class="fa fa-circle me-1" />
                                  Medium
                                </h5>
                              </li>
                              <li class="list-inline-item">
                                <h5 style={{ color: "#ffb848" }}>
                                  <i class="fa fa-circle me-1" />
                                  High
                                </h5>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-6 col-md-6 col-lg-66">
                  <div class="card">
                    <div class="card-body card-body-admin">
                      <h4 class="header-title mt-0 mb-3">
                        <div
                          style={{
                            justifyContent: "space-between",
                            display: "flex",
                          }}
                        >
                          <div>
                            Last Week Analysis - {lastWeekStartDate} to{" "}
                            {lastWeekEndDate}
                          </div>
                          <div>
                            <div className="dropdown float-end">
                              <a
                                href={false}
                                className="dropdown-toggle arrow-none card-drop"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <button
                                  type="button"
                                  class="btn btn-info btn-sm"
                                  style={{ borderRadius: 5, height: 34 }}
                                >
                                  <i class="mdi mdi-filter"></i> Filter
                                </button>
                              </a>
                              <div
                                className="dropdown-menu dropdown-menu-end"
                                style={{ cursor: "pointer" }}
                              >
                                {/* item*/}
                                <div
                                  href="javascript:void(0);"
                                  className="dropdown-item"
                                  onClick={() => fetchAllWidgetsAnalysis(1)}
                                >
                                  Current month
                                </div>
                                {/* item*/}
                                <div
                                  href="javascript:void(0);"
                                  className="dropdown-item"
                                  onClick={() => fetchAllWidgetsAnalysis(2)}
                                >
                                  Last month
                                </div>
                                {/* item*/}
                                <div
                                  href="javascript:void(0);"
                                  className="dropdown-item"
                                  onClick={() => fetchAllWidgetsAnalysis(3)}
                                >
                                  Last 3 month
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </h4>
                      <div class="row">
                        <div class="col-md-6 col-6 col-xl-4 text-center display-center-admin">
                          <div class="mt-3" dir="ltr">
                            <div style={{ width: 120, height: 120 }}>
                              <CircularProgressbar
                                value={parseInt(LoginTimeSplit)}
                                text={`${getTotalLoginTime}`}
                                maxValue={60}
                                styles={buildStyles({
                                  textSize: "16px",
                                  pathTransitionDuration: 0.5,
                                  pathTransition: "none",

                                  // Colors
                                  pathColor: "#FF8ACC",
                                  textColor: "#FF8ACC",
                                  trailColor: "#ededed",
                                  backgroundColor: "#FF8ACC",
                                })}
                              />
                            </div>

                            <h5 class="text-muted font-14">Total Login Time</h5>
                          </div>
                        </div>
                        {/* end col*/}
                        <div class="col-md-6 col-6 col-xl-4 text-center display-center-admin">
                          <div class="mt-3" dir="ltr">
                            <div style={{ width: 120, height: 120 }}>
                              <CircularProgressbar
                                value={parseInt(TalkTimeSplit)}
                                text={`${getTotalTalkTime}`}
                                maxValue={60}
                                styles={buildStyles({
                                  textSize: "16px",
                                  pathTransitionDuration: 0.5,
                                  pathTransition: "none",

                                  // Colors
                                  textColor: "#FF8ACC",
                                  pathColor: "#FF8ACC",
                                  trailColor: "#ededed",
                                  backgroundColor: "#FF8ACC",
                                })}
                              />
                            </div>

                            <h5 class="text-muted font-14">Total TalkTime</h5>
                          </div>
                        </div>
                        {/* end col*/}
                        <div class="col-md-6 col-6 col-xl-4 text-center display-center-admin">
                          <div class="mt-3" dir="ltr">
                            <div style={{ width: 120, height: 120 }}>
                              <CircularProgressbar
                                value={parseInt(TotalBreakSplit)}
                                text={`${getTotalBreakTime}`}
                                maxValue={60}
                                styles={buildStyles({
                                  textSize: "16px",
                                  pathTransitionDuration: 0.5,
                                  pathTransition: "none",

                                  // Colors
                                  textColor: "#FF8ACC",
                                  trailColor: "#ededed",
                                  backgroundColor: "#FF8ACC",
                                  pathColor: "#FF8ACC",
                                })}
                              />
                            </div>

                            <h5 class="text-muted font-14">Total Break time</h5>
                          </div>
                        </div>
                        {/* end col*/}
                        <div class="col-md-6 col-6 col-xl-4 text-center display-center-admin">
                          <div class="mt-3" dir="ltr">
                            <div style={{ width: 120, height: 120 }}>
                              <CircularProgressbar
                                value={parseInt(AverageTalkTimeSplit)}
                                text={`${getAvgTalkTime}`}
                                maxValue={60}
                                styles={buildStyles({
                                  textSize: "16px",
                                  pathTransitionDuration: 0.5,
                                  pathTransition: "none",

                                  // Colors
                                  textColor: "#FF8ACC",
                                  trailColor: "#ededed",
                                  backgroundColor: "#FF8ACC",
                                  pathColor: "#FF8ACC",
                                })}
                              />
                            </div>

                            <h5 class="text-muted font-14">Average TalkTime</h5>
                          </div>
                        </div>
                        {/* end col*/}
                        <div class="col-md-6 col-6 col-xl-4 text-center display-center-admin">
                          <div class="mt-3" dir="ltr">
                            <div style={{ width: 120, height: 120 }}>
                              <CircularProgressbar
                                value={parseInt(AverageBreakSplit)}
                                text={`${getAvgBreakTime}`}
                                maxValue={60}
                                styles={buildStyles({
                                  textSize: "16px",
                                  pathTransitionDuration: 0.5,
                                  pathTransition: "none",

                                  // Colors
                                  textColor: "#FF8ACC",
                                  trailColor: "#ededed",
                                  backgroundColor: "#FF8ACC",
                                  pathColor: "#FF8ACC",
                                })}
                              />
                            </div>

                            <h5 class="text-muted font-14">Average Break</h5>
                          </div>
                        </div>
                        {/* end col*/}
                      </div>
                      {/* end row*/}
                    </div>
                  </div>
                </div>
                {/* end col */}
                <div class="col-xl-12 col-md-12">
                  <div class="card border border-default">
                    <div class="col">
                      <div class="card" style={{ marginBottom: 0 }}>
                        <div class="card-body">
                          <h4 class="header-title mt-0 mb-3">Todays Tasks</h4>
                          <div class="card-body card-body-admin">
                            <div class="row">
                              <div class="col-12">
                                <div class="grid-structure">
                                  <div class="row">
                                    <div class="col-lg-8 form-label">
                                      <div
                                        class="row"
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div class="col-6 col-md-10">
                                          <div class="row">
                                            <div
                                              style={{
                                                fontSize: 13,
                                                fontWeight: 500,
                                              }}
                                            >
                                              Show &nbsp;
                                              <select
                                                style={{
                                                  borderColor: "#a2a2a2",
                                                  borderBox: "none",
                                                  cursor: "pointer",
                                                  background: "white",
                                                  height: "30px",
                                                  width: "70px",
                                                  borderRadius: "5px",
                                                  paddingLeft: "8px",
                                                }}
                                                onChange={(event) =>
                                                  showEntry(
                                                    parseInt(event.target.value)
                                                  )
                                                }
                                                className="select"
                                              >
                                                show entries
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={200}>200</option>
                                              </select>
                                              &nbsp;Entries
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="table"
                                  style={{
                                    fontSize: 11.5,
                                    marginBottom: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <table
                                    id="productTable"
                                    className="table table-hover"
                                  >
                                    <thead className="table">
                                      <tr>
                                        <th
                                          style={{
                                            cursor: "pointer",
                                            padding: "0px 15px 0px 0px",
                                          }}
                                          onClick={() => sortTable(1)}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <div> ID. </div>
                                            <img
                                              src="images/arrow.png"
                                              width="10"
                                            />
                                          </div>
                                        </th>
                                        <th
                                          style={{
                                            cursor: "pointer",
                                            padding: "0px 15px 0px 0px",
                                          }}
                                          onClick={() => sortTable(2)}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <div>Customer</div>
                                            <img
                                              src="images/arrow.png"
                                              width="10"
                                            />
                                          </div>
                                        </th>
                                        <th
                                          style={{
                                            cursor: "pointer",
                                            padding: "0px 15px 0px 0px",
                                          }}
                                          onClick={() => sortTable(3)}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            {" "}
                                            <div>Mobile number</div>{" "}
                                            <img
                                              src="images/arrow.png"
                                              width="10"
                                            />
                                          </div>
                                        </th>
                                        <th
                                          style={{
                                            cursor: "pointer",
                                            padding: "0px 15px 0px 0px",
                                          }}
                                          onClick={() => sortTable(4)}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            {" "}
                                            <div>Task Date & Time</div>{" "}
                                            <img
                                              src="images/arrow.png"
                                              width="10"
                                            />
                                          </div>
                                        </th>
                                        <th
                                          style={{
                                            cursor: "pointer",
                                            padding: "0px 15px 0px 0px",
                                          }}
                                          onClick={() => sortTable(5)}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            {" "}
                                            <div>Task Type</div>{" "}
                                            <img
                                              src="images/arrow.png"
                                              width="10"
                                            />
                                          </div>
                                        </th>
                                        <th
                                          style={{
                                            cursor: "pointer",
                                            padding: "0px 15px 0px 0px",
                                          }}
                                          onClick={() => sortTable(6)}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            {" "}
                                            <div>Priority</div>{" "}
                                            <img
                                              src="images/arrow.png"
                                              width="10"
                                            />
                                          </div>
                                        </th>
                                        <th
                                          style={{
                                            cursor: "pointer",
                                            padding: "0px 15px 0px 0px",
                                          }}
                                          onClick={() => sortTable(7)}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            {" "}
                                            <div>Added on</div>{" "}
                                            <img
                                              src="images/arrow.png"
                                              width="10"
                                            />
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody style={{ fontSize: 13 }}>
                                      {getEmployee().length == 0 ? (
                                        <td colspan={7}>
                                          <p
                                            style={{
                                              textAlign: "center",
                                            }}
                                          >
                                            No task today yet..!
                                          </p>
                                        </td>
                                      ) : (
                                        getEmployee()
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div class="col-12">
                                <div
                                  class="row"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div class="col-12 col-md-6">
                                    <div
                                      style={{ fontSize: 13, fontWeight: 700 }}
                                    >
                                      {!getTodaysTasks.length
                                        ? "[Nothing to show]"
                                        : "Showing  " +
                                          (entryStart + 1) +
                                          " to " +
                                          entryEnd +
                                          " of " +
                                          getTodaysTasks.length +
                                          " entries"}
                                    </div>
                                  </div>
                                  <div class="col-12 col-md-6">
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                      }}
                                    >
                                      {handlePaging()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end col */}
              </div>
              {/* end row */}
              {/* end row */}
            </div>
            {/* container-fluid */}
          </div>
        </div>
      )}
    </>
  );
}
