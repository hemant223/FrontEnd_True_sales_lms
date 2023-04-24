import React, { useState, useEffect } from "react";
import $ from "jquery";
import { PieChart } from "react-minimal-pie-chart";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import swal from "sweetalert";
import moment from "moment";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ProgressBarLine } from "react-progressbar-line";
import { useSelector } from "react-redux";
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

export default function DefaultManager(props) {
  var cartItem = useSelector((state) => state.cart);
  // console.log("cart Item in default managerrr 73---->", cartItem.str);
  // console.log("props in default manager ", props);
  const [getOverallTask, setOverallTask] = useState([]);
  const [getOverallTaskCompleted, setOverallTaskCompleted] = useState([]);
  const [getTotalUsers, setTotalUsers] = useState([]);
  const [getActiveUsers, setActiveUsers] = useState([]);
  const [getAnsweredCall, setAnsweredCall] = useState([]);
  const [getMissedCall, setMissedCall] = useState([]);
  const [getConnectedCall, setConnectedCall] = useState([]);
  const [getNotConnectedCall, setNotConnectedCall] = useState([]);
  const [getTotalCalls, setTotalCalls] = useState([]);
  const [getLowPriority, setLowPriority] = useState([]);
  const [getHighPriority, setHighPriority] = useState([]);
  const [getMediumPriority, setMediumPriority] = useState([]);
  const [getTotalPriority, setTotalPriority] = useState([]);
  const [getTotalTalkTime, setTotalTalkTime] = useState([]);
  const [getTotalTalkTimeSplit, setTotalTalkTimeSplit] = useState([]);
  const [getAvgTalkTime, setAvgTalkTime] = useState([]);
  const [getAvgTalkTimeSplit, setAvgTalkTimeSplit] = useState([]);
  const [getTotalBreakTime, setTotalBreakTime] = useState([]);
  const [getTotalBreakTimeSplit, setTotalBreakTimeSplit] = useState([]);
  const [getAvgBreakTime, setAvgBreakTime] = useState([]);
  const [getAvgBreakTimeSplit, setAvgBreakTimeSplit] = useState([]);
  const [getTotalLoginTimeSplit, setTotalLoginTimeSplit] = useState([]);
  const [getTotalLoginTime, setTotalLoginTime] = useState([]);
  const lastWeekStartDate = moment()
    .subtract(1, "weeks")
    .startOf("week")
    .format("DD");
  const lastWeekEndDate = moment()
    .subtract(1, "weeks")
    .endOf("week")
    .format("DD MMM");

  useEffect(() => {
    fetchOverAllTask();
    fetchLoggedInUsers();
    fetchCallsProgress();
    fetchTaskPirority();
    fetchWidgetsAnalysis();
  }, [cartItem]);

  useEffect(() => {
    {
      $(function () {
        $(".dial")
          .knob({
            // min: getTotalUsers.length,
            min: 38,
            max: 1000,
          })
          .trigger("change");
      });
    }
  }, []);

  const fetchLoggedInUsers = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      let responseUsers = await getDataAxios(
        `usersR/managerPenalActiveUser/${userData.company_id}/${userData.id}/${userData.role_id}`
      );
      // console.log("Logged In user", responseUsers);
      setTotalUsers(responseUsers.result.length);
      setActiveUsers(responseUsers.result.length);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchOverAllTask = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      let responseOverAllTask = await getDataAxios(
        `usersR/managerPenalOverAllTask/${userData.company_id}/${userData.id}`
      );
      // console.log("overAll Task data --> ", responseOverAllTask);
      setOverallTask(responseOverAllTask.totalTask[0][0].Total_task);
      setOverallTaskCompleted(responseOverAllTask.completeTask[0]);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchCallsProgress = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      let responseCallProgress = await getDataAxios(
        `calls/managerPenalAnsweredAndMissed/${userData.company_id}/${userData.id}`
      );
      // console.log("calls progress data", responseCallProgress);
      setAnsweredCall(responseCallProgress.Answered[0]);
      setMissedCall(responseCallProgress.Missed[0]);
      setConnectedCall(responseCallProgress.Connected[0]);
      setNotConnectedCall(responseCallProgress.NotConnected[0]);
      setTotalCalls(responseCallProgress.totalCalls[0]);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchTaskPirority = async () => {
    let userData = JSON.parse(localStorage.getItem("user"));
    const getTaskPriorityId = JSON.parse(localStorage.getItem("taskPirority"));
    try {
      const body = {
        high: getTaskPriorityId[0].task_priority_id,
        medium: getTaskPriorityId[1].task_priority_id,
        low: getTaskPriorityId[2].task_priority_id,
      };
      let responseTaskPirority = await postDataAxios(
        `priority/managerPenalTaskPriorityName/${userData.company_id}/${userData.id}`,
        body
      );
      // console.log("task pirority data ---> ", responseTaskPirority);
      setHighPriority(responseTaskPirority.highPriority[0]);
      setLowPriority(responseTaskPirority.lowPriority[0]);
      setMediumPriority(responseTaskPirority.mediumPriority[0]);
      setTotalPriority(responseTaskPirority.TotalPriority[0]);
    } catch (e) {
      console.log("e", e);
    }
  };

  const fetchWidgetsAnalysis = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      var startDate, endDate;
      if (cartItem.startDate != undefined) {
        startDate = cartItem.startDate;
        endDate = cartItem.endDate;
      } else {
        startDate = moment()
          .subtract(1, "weeks")
          .startOf("week")
          .format("YYYY-MM-DD");
        endDate = moment()
          .subtract(1, "weeks")
          .endOf("week")
          .format("YYYY-MM-DD");
      }
      let responseWidgetsAnalysis = await getDataAxios(
        `attendence/managerPenalWidgetsAnalysis/${userData.company_id}/${userData.id}/${startDate}/${endDate}`
      );
      // console.log(
      //   "responseWidgetsAnalysis ----> 1833",
      //   responseWidgetsAnalysis
      // );
      if (responseWidgetsAnalysis.status == true) {
        setTotalLoginTime(responseWidgetsAnalysis.TotalLoginTimeFormatted);
        setTotalLoginTimeSplit(
          responseWidgetsAnalysis.TotalLoginTimeFormatted.split(":")[2]
        );
        setTotalTalkTime(responseWidgetsAnalysis.TotalTalkTimeformatted);
        setAvgTalkTime(responseWidgetsAnalysis.AverageTalkTimeFormatted);
        setTotalTalkTimeSplit(
          responseWidgetsAnalysis.TotalTalkTimeformatted.split(":")[2]
        );
        setAvgTalkTimeSplit(
          responseWidgetsAnalysis.AverageTalkTimeFormatted.split(":")[2]
        );
        setTotalBreakTime(responseWidgetsAnalysis.TotlBrkFormatted);
        setAvgBreakTime(responseWidgetsAnalysis.AvgBrkFormatted);
        setTotalBreakTimeSplit(
          responseWidgetsAnalysis.TotlBrkFormatted.split(":")[2]
        );
        setAvgBreakTimeSplit(
          responseWidgetsAnalysis.AvgBrkFormatted.split(":")[2]
        );
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        }).then(() => {
          setTotalLoginTime("00:00:00");
          setTotalLoginTimeSplit("00:00:00");
          setTotalTalkTime("00:00:00");
          setAvgTalkTime("00:00:00");
          setTotalTalkTimeSplit("00:00:00");
          setAvgTalkTimeSplit("00:00:00");
          setTotalBreakTime("00:00:00");
          setAvgBreakTime("00:00:00");
          setTotalBreakTimeSplit("00:00:00");
          setAvgBreakTimeSplit("00:00:00");
        });
      }
    } catch (e) {
      console.log("error in widgets", e);
    }
  };

  const fetchTotalLoginTime = async () => {
    let userData = JSON.parse(localStorage.getItem("user"));

    let responseTotalLoginTime = await getDataAxios(
      `attendence/managerPenalTotalLoginTime/${userData.company_id}/${userData.id}`
    );
    setTotalLoginTimeSplit(
      responseTotalLoginTime.TotalLoginTimeFormatted.split(":")[2]
    );
    setTotalLoginTime(responseTotalLoginTime.TotalLoginTimeFormatted);
  };

  const fetchTotalBreakTimeAndAvgBreakTime = async () => {
    let userData = JSON.parse(localStorage.getItem("user"));
    let responseTotalBreakTimeAndAvgBreakTime = await getDataAxios(
      `break/managerPenalTotalBreakTimeAndAvgBreakTime/${userData.company_id}/${userData.id}`
    );
    setTotalBreakTimeSplit(
      responseTotalBreakTimeAndAvgBreakTime.TotalBreakTimeformatted.split(
        ":"
      )[2]
    );
    setTotalBreakTime(
      responseTotalBreakTimeAndAvgBreakTime.TotalBreakTimeformatted
    );
    setAvgBreakTimeSplit(
      responseTotalBreakTimeAndAvgBreakTime.AverageBreakTimeFormatted.split(
        ":"
      )[2]
    );
    setAvgBreakTime(
      responseTotalBreakTimeAndAvgBreakTime.AverageBreakTimeFormatted
    );
  };

  const fetchTotalTalkTimeAndAvgTalkTime = async () => {
    let userData = JSON.parse(localStorage.getItem("user"));
    let responseTotalTalkTimeAndAvgTalkTime = await getDataAxios(
      `calls/managerPenalTotalTalkTimeAndAvgTalkTime/${userData.company_id}/${userData.id}`
    );
    // console.log(
    //   "responseTotalTalkTimeAndAvgTalkTime",
    //   responseTotalTalkTimeAndAvgTalkTime.TotalTalkTimeformatted
    // );
    setTotalTalkTimeSplit(
      responseTotalTalkTimeAndAvgTalkTime.TotalTalkTimeformatted.split(":")[2]
    );
    setTotalTalkTime(
      responseTotalTalkTimeAndAvgTalkTime.TotalTalkTimeformatted
    );
    setAvgTalkTimeSplit(
      responseTotalTalkTimeAndAvgTalkTime.AverageTalkTimeFormatted.split(":")[2]
    );
    setAvgTalkTime(
      responseTotalTalkTimeAndAvgTalkTime.AverageTalkTimeFormatted
    );
  };

  const userT = (b, c) => {
    if (b == 0 || c == 0) {
      return "00...";
    } else {
      return `(${((b / c) * 100).toFixed(2)}%)`;
    }
  };

  const userd = (a, t) => {
    if (a == 0 || t == 0) {
      return "00...";
    } else {
      return `(${((a / t) * 100).toFixed(2)}%)`;
    }
  };

  return (
    <>
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
                        <h5 class="header-title mt-0 mb-2">
                          Total logged-In users
                        </h5>
                        <div class="widget-chart-1">
                          <div class="widget-chart-box-1 float-start" dir="ltr">
                            <div style={{ width: 60, height: 60 }}>
                              <CircularProgressbar
                                value={getActiveUsers}
                                maxValue={getTotalUsers}
                                text={`${getTotalUsers}`}
                                styles={buildStyles({
                                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                  strokeLinecap: "butt",
                                  // Text size
                                  textSize: 20,
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
                            <h4 class="fw-normal pt-2 mb-1 bw1">
                              {getActiveUsers}
                              <span>
                                {userd(getActiveUsers, getTotalUsers)}
                              </span>
                            </h4>
                            <p class="text-muted mb-1">Active users</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-6 col-md-6 col-lg-66">
                    <div class="card">
                      <div class="card-body card-body-admin">
                        <h5 class="header-title mt-0 mb-2">
                          Overall task status
                        </h5>
                        <div class="widget-chart-1">
                          <div class="widget-chart-box-1 float-start" dir="ltr">
                            <div style={{ width: 60, height: 60 }}>
                              <CircularProgressbar
                                value={getOverallTaskCompleted.length}
                                maxValue={getOverallTask}
                                text={`${getOverallTask}`}
                                styles={buildStyles({
                                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                  strokeLinecap: "butt",
                                  // Text size
                                  textSize: 20,
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
                            <h4 class="fw-normal pt-2 mb-1 bw1">
                              {getOverallTaskCompleted.length == 0
                                ? 0
                                : getOverallTaskCompleted.length}
                              <span>
                                {userT(
                                  parseInt(getOverallTaskCompleted.length),
                                  parseInt(getOverallTask)
                                )}
                              </span>
                            </h4>
                            <p class="text-muted mb-1">Completed Tasks</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                            value={getNotConnectedCall.length}
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
                            background="#71b6f9"
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
                      {cartItem.str == undefined
                        ? `Last Week Analysis - ${lastWeekStartDate} to ${lastWeekEndDate}`
                        : cartItem.str}
                    </h4>
                    <div class="row">
                      <div class="col-md-6 col-6 col-xl-4 text-center display-center-admin">
                        <div class="mt-3" dir="ltr">
                          <div style={{ width: 120, height: 120 }}>
                            <CircularProgressbar
                              value={parseInt(getTotalLoginTimeSplit)}
                              text={`${getTotalLoginTime}`}
                              maxValue={60}
                              styles={buildStyles({
                                textSize: "16px",
                                pathTransitionDuration: 0.5,
                                pathTransition: "none",
                                pathColor: "#FF8ACC",
                                textColor: "#FF8ACC",
                                trailColor: "#ededed",
                                backgroundColor: "#FF8ACC",
                              })}
                            />
                          </div>
                          <h5 class="text-muted">Total Login Time</h5>
                        </div>
                      </div>
                      <div class="col-md-6 col-6 col-xl-4 text-center display-center-admin">
                        <div class="mt-3" dir="ltr">
                          <div style={{ width: 120, height: 120 }}>
                            <CircularProgressbar
                              value={parseInt(getTotalTalkTimeSplit)}
                              text={`${getTotalTalkTime}`}
                              maxValue={60}
                              styles={buildStyles({
                                textSize: "16px",
                                pathTransitionDuration: 0.5,
                                pathTransition: "none",
                                textColor: "#FF8ACC",
                                pathColor: "#FF8ACC",
                                trailColor: "#ededed",
                                backgroundColor: "#FF8ACC",
                              })}
                            />
                          </div>

                          <h5 class="text-muted">Total TalkTime</h5>
                        </div>
                      </div>
                      <div class="col-md-6 col-6 col-xl-4 text-center display-center-admin">
                        <div class="mt-3" dir="ltr">
                          <div style={{ width: 120, height: 120 }}>
                            <CircularProgressbar
                              value={parseInt(getTotalBreakTimeSplit)}
                              text={`${getTotalBreakTime}`}
                              maxValue={60}
                              styles={buildStyles({
                                textSize: "16px",
                                pathTransitionDuration: 0.5,
                                pathTransition: "none",
                                textColor: "#FF8ACC",
                                trailColor: "#ededed",
                                backgroundColor: "#FF8ACC",
                                pathColor: "#FF8ACC",
                              })}
                            />
                          </div>

                          <h5 class="text-muted">Total Break time</h5>
                        </div>
                      </div>
                      <div class="col-md-6 col-6 col-xl-4 text-center display-center-admin">
                        <div class="mt-3" dir="ltr">
                          <div style={{ width: 120, height: 120 }}>
                            <CircularProgressbar
                              value={parseInt(getAvgTalkTimeSplit)}
                              text={`${getAvgTalkTime}`}
                              maxValue={60}
                              styles={buildStyles({
                                textSize: "16px",
                                pathTransitionDuration: 0.5,
                                pathTransition: "none",
                                textColor: "#FF8ACC",
                                trailColor: "#ededed",
                                backgroundColor: "#FF8ACC",
                                pathColor: "#FF8ACC",
                              })}
                            />
                          </div>

                          <h5 class="text-muted">Average TalkTime</h5>
                        </div>
                      </div>
                      <div class="col-md-6 col-6 col-xl-4 text-center display-center-admin">
                        <div class="mt-3" dir="ltr">
                          <div style={{ width: 120, height: 120 }}>
                            <CircularProgressbar
                              value={parseInt(getAvgBreakTimeSplit)}
                              text={`${getAvgBreakTime}`}
                              maxValue={60}
                              styles={buildStyles({
                                textSize: "16px",
                                pathTransitionDuration: 0.5,
                                pathTransition: "none",
                                textColor: "#FF8ACC",
                                trailColor: "#ededed",
                                backgroundColor: "#FF8ACC",
                                pathColor: "#FF8ACC",
                              })}
                            />
                          </div>

                          <h5 class="text-muted">Average Break</h5>
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
    </>
  );
}
