import moment from "moment";
import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { ProgressBarLine } from "react-progressbar-line";
import {
  getDataAxios,
  ServerURL,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import ManagerViewUser from "../ManagerViewUser/ManagerViewUser";
import TeamAttendanceTable from "./TeamAttendanceTable";
import TeamTodaysTask from "./TeamTodaysTask";
import io from "socket.io-client";
// var socket = io.connect("http://localhost:8002");
// var socket = io.connect("http://164.52.195.173:8002");
var socket = io.connect("https://socketio.truesales.in");
// var socket = io.connect("https://socketio.truesales.in");

export default function TeamShows(props) {
  // console.log("props in Teams Show", props);
  const [getLoading, setLoading] = useState(false);
  const [getTeamsDetail, setTeamsDetail] = useState([]);
  const [getTeamName, setTeamName] = useState("");
  const [getTeamDate, setTeamDate] = useState("");
  const [getTeamMember, setTeamMember] = useState("");
  const [getTeamHead, setTeamHead] = useState("");
  const [getTotalUser, setTotalUser] = useState("");
  const [getActiveUser, setActiveUser] = useState("");
  const [getTotalTask, setTotalTask] = useState("");
  const [getCompletedTask, setCompletedTask] = useState("");
  const [getConnectedCall, setConnectedCall] = useState([]);
  const [getNotConnectedCall, setNotConnectedCall] = useState([]);
  const [getMissedCall, setMissedCall] = useState([]);
  const [getAnsweredCall, setAnsweredCall] = useState([]);
  const [getTotalCall, setTotalCall] = useState([]);
  const [TotalIdle, setTotalIdle] = useState([]);
  const [getRefresh, setRefresh] = useState(false);
  const [TotalLoggedIn, setTotalLoggedIn] = useState([]);
  const [TotalLoggedOut, setTotalLoggedOut] = useState([]);
  const [TeamOnBreak, setTeamOnBreak] = useState([]);
  const [YetToStart, setYetToStart] = useState([]);
  const [TeamAVGTIME, setTeamAVGTIME] = useState(" ");
  const [TeamTotalBrk, setTeamtotalBrk] = useState("");
  const [TeamOnCall, setTeamOnCall] = useState([]);
  const [TIMEEEEE, setTIMEEEEE] = useState("");

  useEffect(() => {
    fetchTeamDetails();
    fetchCallsInfo();
    handleTotalIdle();
    handleTotalLoggedIn();
    handleTotalLoggedOut();
    handleTeamOnBreak();
    handleYetToStart();
    handleAVGTeamBRK();
    handleTeamBreak();
    handleTeamOnCall();
  }, [props]);

  useEffect(() => {
    socket.on("displaycalllive", (data) => {
      // console.log("Displayyyyyyyyyyyyyyyyyyyyy---->", JSON.stringify(data))
      fetchTeamDetails();
      handleTeamOnCall();
      setRefresh(!getRefresh);
    });
    socket.on("displaywrapping", (data) => {
      // console.log("Wraapinigggggggggggggggggggggggg", JSON.stringify(data));
      fetchTeamDetails();
      handleTeamOnCall();
      setRefresh(!getRefresh);
    });
    socket.on("displayIdle", (data) => {
      // console.log("Idleeeeeeeeeeeeeeeeeeee", JSON.stringify(data));
      fetchTeamDetails();
      handleTeamOnCall();
      setRefresh(!getRefresh);
    });
  }, [getRefresh]);

  const fetchTeamDetails = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      let response = await getDataAxios(
        `team/managerPenalTeamsMembersShow/${userData.company_id}/${
          userData.id
        }/${props.item.id}/${moment().format("YYYY-MM-DD")}`
      );
      // console.log("response in Teams page", response);
      if (response.status == true) {
        setTeamsDetail(response.TeamDetail[0]);
        setTeamName(response.TeamDetail[0][0].team_name);
        setTeamDate(response.TeamDetail[0][0].TeamDate);
        setTeamHead(response.TeamDetail[0][0].TeamHead);
        setTeamMember(response.TeamDetail[0].length);
        setTotalUser(response.TeamMember[0][0].TotalUser);
        setActiveUser(response.TeamMember[0][0].ActiveUser);
        setTotalTask(response.TotalTask[0][0].TotalTask);
        setCompletedTask(response.TotalTask[0][0].CompleteTask);
      } else {
      }
    } catch (error) {
      console.log("error in 66_Teamshow", error);
    }
  };

  const fetchCallsInfo = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      let callResponse = await getDataAxios(
        `calls/managerPenalTeamMemberCalls/${userData.company_id}/${userData.id}/${props.item.id}`
      );
      // console.log("calls Info", callResponse);
      setConnectedCall(callResponse.Connected[0]);
      setNotConnectedCall(callResponse.NotConnected[0]);
      setMissedCall(callResponse.Missed[0]);
      setAnsweredCall(callResponse.Answered[0]);
      setTotalCall(callResponse.TotalCalls[0]);
    } catch (error) {
      console.log("error in TeamShow-104", error);
    }
  };

  const handleViewUserPage = (userInfo) => {
    props.handleDashComponent(
      "",
      <ManagerViewUser
        handleDashComponent={props.handleDashComponent}
        {...props}
        userInfo={userInfo}
      />
    );
  };

  const handleTotalIdle = async () => {
    try {
      let body = { team_id: props.item.id, company_id: props.item.company_id };
      let respose_Totalidle = await postDataAxios(
        `attendence/totalTeamIdleTime`,
        body
      );
      if (respose_Totalidle.result.length == 0) {
        setTotalIdle("00:00:00");
      } else {
        if (respose_Totalidle.result[0].totalTime != null) {
          setTotalIdle(
            respose_Totalidle.result[0].totalTime == null
              ? "00:00:00"
              : respose_Totalidle.result[0].totalTime
          );
        } else {
          if (respose_Totalidle.result[0].TotalTimeBr != null) {
            setTotalIdle(
              respose_Totalidle.result[0].totalTime == null
                ? "00:00:00"
                : respose_Totalidle.result[0].totalTime
            );
          } else {
            setTotalIdle(
              respose_Totalidle.result[0].totalTime == null
                ? "00:00:00"
                : respose_Totalidle.result[0].totalTime
            );
          }
        }
      }
    } catch (error) {
      console.log("TeamShow_error 155", error);
    }
  };

  const handleTotalLoggedIn = async () => {
    try {
      let body = { company_id: props.item.company_id, team_id: props.item.id };
      let respose_totalLogged_in = await postDataAxios(
        `attendence/teamsLoggedInMember`,
        body
      );
      // console.log("gggggggggggggggggggggggggggggggggg", respose_totalLogged_in.result);
      setTotalLoggedIn(respose_totalLogged_in.result);
    } catch (error) {
      console.log("error in TeamShow", error);
    }
  };

  const handleTotalLoggedOut = async () => {
    try {
      let body = { company_id: props.item.company_id, team_id: props.item.id };
      let respose_totalLogged_out = await postDataAxios(
        `attendence/teamsLoggedOutMember`,
        body
      );
      // console.log("TotalLoggedOut----------------->150", respose_totalLogged_out);
      setTotalLoggedOut(respose_totalLogged_out.result);
    } catch (error) {
      console.log("error in 179_TeamShow", error);
    }
  };

  const handleTeamOnBreak = async () => {
    try {
      let body = { team_id: props.item.id };
      let res_Team_On_break = await postDataAxios(
        `break/teamsMemberOnBreak`,
        body
      );
      setTeamOnBreak(res_Team_On_break.result);
    } catch (error) {
      console.log("error in 191 line TeamShow", error);
    }
  };

  const handleYetToStart = async () => {
    try {
      let body = { team_id: props.item.id };
      let res_Yet_To_start = await postDataAxios(
        "attendence/noActivityTeamMember",
        body
      );
      setYetToStart(res_Yet_To_start.result);
    } catch (error) {
      console.log("Error in TeamShow--->", error);
    }
  };

  const handleAVGTeamBRK = async () => {
    try {
      let body = { company_id: props.item.company_id, team_id: props.item.id };
      let res_TEAMLogin = await postDataAxios(
        "attendence/TeamaverageLoginTimeManager",
        body
      );
      let Convert_Time = moment
        .utc(res_TEAMLogin.result[0].AverageLoginTime * 1000)
        .format("HH:mm");
      setTeamAVGTIME(Convert_Time);
    } catch (error) {
      console.log("Error in TeamShow--->", error);
    }
  };

  const handleTeamBreak = async () => {
    try {
      let body = { company_id: props.item.company_id, team_id: props.item.id };
      let res_Team_Break = await postDataAxios(
        "break/teamsMemberTotalBreak",
        body
      );
      let TotalBreaks =
        res_Team_Break.result[0] == undefined || null
          ? "00:00"
          : res_Team_Break.result[0].TotalBreak.slice("", 5);
      setTeamtotalBrk(TotalBreaks);
    } catch (error) {
      console.log("Error in TeamShow--->", error);
    }
  };

  const handleTeamOnCall = async () => {
    try {
      let body = { company_id: props.item.company_id, team_id: props.item.id };
      let res_On_Call = await postDataAxios("attendence/teamsOnCall", body);
      // console.log("res_On_Call_result----------------->242", res_On_Call);
      setTeamOnCall(res_On_Call.data);
    } catch (error) {
      console.log("Error in TeamShow--->", error);
    }
  };

  const showTeamMembers = () => {
    return getTeamsDetail.map(function (item, key) {
      let userDate = new Date(item.LiveTimeStatus);
      let userone = userDate.getHours();
      let usertwo = userDate.getMinutes();
      let userthree = userDate.getSeconds();
      var originalTime = moment();
      var SubtractTime = originalTime.subtract({
        hours: userone,
        minutes: usertwo,
        seconds: userthree,
      });
      var j = SubtractTime.toString();

      let userIdle = new Date(item.IdleTime);
      let userhr = userIdle.getHours();
      let usermt = userIdle.getMinutes();
      let usersc = userIdle.getSeconds();
      var originalTimeIdle = moment();
      var SubtractTimeIdle = originalTimeIdle.subtract({
        hours: userhr,
        minutes: usermt,
        seconds: usersc,
      });
      var SBTidleTime = SubtractTimeIdle.toString();

      return (
        <div class="col-lg-3 col-xl-3 col-lg-66" style={{ marginBottom: 0 }}>
          <div class="card">
            <div class="card-body card-body-border">
              <div class="row">
                <div class="col-3 col-md-4 col-lg-66">
                  {item.user_picture == null ? (
                    <div class="position-relative">
                      <img
                        src="assets/images/users/user-7.jpg"
                        alt="image"
                        width="60"
                        class="img-fluid  rounded-circle"
                      />
                      {item.livestatus == "On call" ? (
                        <span
                          class="position-absolute top-10 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                          title="On Call"
                          tabindex="0"
                          data-plugin="tippy"
                          data-tippy-placement="top"
                        ></span>
                      ) : item.livestatus == "Wrapping up" ? (
                        <span
                          class="position-absolute top-10 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"
                          title="Wrapping up"
                          tabindex="0"
                          data-plugin="tippy"
                          data-tippy-placement="top"
                        ></span>
                      ) : (
                        <span
                          class="position-absolute top-10 start-100 translate-middle p-1 bg-success border border-light rounded-circle"
                          title="Idle"
                          tabindex="0"
                          data-plugin="tippy"
                          data-tippy-placement="top"
                        ></span>
                      )}
                    </div>
                  ) : (
                    <div class="position-relative">
                      <img
                        src={`${ServerURL}/images/${item.user_picture}`}
                        alt="image"
                        width="60"
                        class="img-fluid  rounded-circle"
                      />
                      {item.livestatus == "On call" ? (
                        <span
                          class="position-absolute top-10 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                          title="On Call"
                          tabindex="0"
                          data-plugin="tippy"
                          data-tippy-placement="top"
                        ></span>
                      ) : item.livestatus == "Wrapping up" ? (
                        <span
                          class="position-absolute top-10 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"
                          title="Wrapping up"
                          tabindex="0"
                          data-plugin="tippy"
                          data-tippy-placement="top"
                        ></span>
                      ) : (
                        <span
                          class="position-absolute top-10 start-100 translate-middle p-1 bg-success border border-light rounded-circle"
                          title="Idle"
                          tabindex="0"
                          data-plugin="tippy"
                          data-tippy-placement="top"
                        ></span>
                      )}
                    </div>
                  )}
                </div>
                <div class="col-9 col-md-8">
                  <div class="row">
                    <div class="col-lg-12 col-xl-12">
                      <h5 class="header-title">{item.name.split(" ", 1)}</h5>
                    </div>

                    <div class="col-lg-12 col-xl-12">
                      <span>
                        {item.livestatus == "On call" ? (
                          <div
                            style={{
                              color: "red",
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                          >
                            On call since{" "}
                            {item.LiveTimeStatus != null
                              ? moment(j).format("HH:mm:ss")
                              : "-:-:-"}{" "}
                          </div>
                        ) : item.livestatus == "Wrapping up" ? (
                          <p
                            style={{
                              color: "rgb(255, 166, 0)",
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                          >
                            Wrapping up
                          </p>
                        ) : item.livestatus == "Idle" ? (
                          <p
                            style={{
                              color: "green",
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                          >
                            Idle on since{" "}
                            {item.IdleTime != null
                              ? moment(SBTidleTime).format("HH:mm:ss")
                              : "-:-:-"}{" "}
                          </p>
                        ) : (
                          item.team_name
                        )}
                      </span>
                    </div>

                    <div class="col-lg-12 col-xl-12">
                      <button
                        class="btn btn-success mt-1 rounded-pill btn-xs"
                        style={{
                          cursor: "pointer",
                          padding: "0.1rem 0.8rem",
                          backgroundColor: "#2b921b",
                          border: "none",
                        }}
                        onClick={() => handleViewUserPage(item)}
                      >
                        <i class="mdi mdi-eye"></i> Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
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
      // return `(${(a / t) * 100}%)`
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
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-9 col-xl-9 col-lg-66">
                  <div class="row">
                    <div class="col-lg-12 col-xl-12 col-lg-66">
                      <div class="card">
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-3 col-sm-12  col-lg-66 text-center">
                              Team Name
                            </div>
                            <div class="col-md-3 col-sm-12  col-lg-66 text-center">
                              Created on
                            </div>
                            <div class="col-md-3 col-sm-12 col-lg-66 text-center">
                              Total team members
                            </div>
                            <div class="col-md-3 col-sm-12 col-lg-66 text-center">
                              Manager
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-3 col-sm-12 col-lg-66 text-center">
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 12, color: "#353A40" }}
                              >
                                {getTeamName}
                              </label>
                            </div>
                            <div class="col-md-3 col-sm-12 col-lg-66 text-center">
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 12, color: "#353A40" }}
                              >
                                {moment(getTeamDate).format("DD/MM/YYYY")}
                              </label>
                            </div>
                            <div class="col-md-3 col-sm-12 col-lg-66 text-center">
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 12, color: "#353A40" }}
                              >
                                {getTeamMember}
                              </label>
                            </div>
                            <div class="col-md-3 col-sm-12 col-lg-66 text-center">
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 12, color: "#353A40" }}
                              >
                                {getTeamHead}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4 col-sm-4 col-lg-66">
                      <div class="card">
                        <div class="card-body">
                          <h5 class="header-title mt-0 mb-2">
                            Total logged-In users
                          </h5>
                          <div class="widget-chart-1">
                            <div
                              class="widget-chart-box-1 float-start"
                              dir="ltr"
                            >
                              <div style={{ width: 60, height: 60 }}>
                                <CircularProgressbar
                                  value={getActiveUser}
                                  maxValue={getTotalUser}
                                  text={`${getTotalUser}`}
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
                                {getActiveUser}
                                <span>
                                  {userd(getActiveUser, getTotalUser)}
                                </span>
                              </h4>
                              <p class="text-muted mb-1">Active users</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4 col-sm-4 col-lg-66">
                      <div class="card">
                        <div class="card-body">
                          <h5 class="header-title mt-0 mb-2">
                            Overall tasks status
                          </h5>
                          <div class="widget-chart-1">
                            <div
                              class="widget-chart-box-1 float-start"
                              dir="ltr"
                            >
                              <div style={{ width: 60, height: 60 }}>
                                <CircularProgressbar
                                  value={getCompletedTask}
                                  maxValue={getTotalTask}
                                  text={`${getTotalTask}`}
                                  styles={buildStyles({
                                    strokeLinecap: "butt",
                                    textSize: 20,
                                    pathTransitionDuration: 1,
                                    pathTransition: "none",
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
                                {getCompletedTask}
                                <span>
                                  {userT(getCompletedTask, getTotalTask)}
                                </span>
                              </h4>
                              <p class="text-muted mb-1">Complete task</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4 col-xl-4 col-lg-66">
                      <div class="card">
                        <div class="card-body">
                          <h4 class="header-title mt-0 mb-2">
                            Total Idle Time
                          </h4>
                          <h5 class="mt-0 mb-0">
                            <h3>{TotalIdle}</h3>
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-xl-3 col-lg-66">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="header-title mt-0 mb-3">Call Progress</h4>
                      <h5 class="mt-0 mb-0">
                        Connected
                        <ProgressBarLine
                          value={getConnectedCall.length}
                          max={getTotalCall.length}
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
                          max={getTotalCall.length}
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
                          max={getTotalCall.length}
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
                          max={getTotalCall.length}
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
              </div>
              {/* Team Member Table render  */}

              <div class="col-lg-12 col-xl-12">
                <div class="card">
                  <div class="card-body">
                    <h4 class="header-title mt-0 mb-3">Team members</h4>
                    <div class="content">
                      <div class="contain1er-fluid">
                        <div class="col-md-12">
                          <div class="row">{showTeamMembers()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*-----team Member live status------ */}
              <div class="col-lg-12 col-xl-12">
                <div class="card">
                  <div class="card-body" style={{ paddingBottom: 0 }}>
                    <h4 class="header-title mt-0 mb-2">
                      Team member live status
                    </h4>
                    <div class="content">
                      <div class="row">
                        <div className="col-lg-66 text-center cols-7">
                          <div
                            class="card card-body-admin"
                            style={{ display: "block" }}
                          >
                            <div
                              class=""
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <div class="widget-chart-1">
                                <div
                                  class="widget-chart-box-1 float-start"
                                  dir="ltr"
                                >
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      padding: "20% 20% 0% 20%",
                                    }}
                                  >
                                    <CircularProgressbar
                                      maxValue={
                                        getTeamsDetail.length == 0
                                          ? "0"
                                          : getTeamsDetail.length
                                      }
                                      value={
                                        TotalLoggedIn.length == 0
                                          ? "0"
                                          : TotalLoggedIn.length
                                      }
                                      text={`${
                                        TotalLoggedIn.length == 0
                                          ? "0"
                                          : TotalLoggedIn.length
                                      }/${
                                        getTeamsDetail.length == 0
                                          ? "0"
                                          : getTeamsDetail.length
                                      }`}
                                      styles={buildStyles({
                                        textSize: 27,
                                        pathTransitionDuration: 1,
                                        pathTransition: "none",
                                        pathColor: `rgba(240, 80, 80, 1)`,
                                        textColor: "#f05050",
                                        trailColor: "#ededed",
                                        backgroundColor: "#f05050",
                                      })}
                                    />
                                  </div>
                                </div>
                              </div>
                              <h6
                                className="text-center"
                                style={{ margin: "15px 0px 15px 0px" }}
                              >
                                Logged In
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-66 text-center cols-7">
                          <div
                            class="card card-body-admin"
                            style={{ display: "block" }}
                          >
                            <div
                              class=""
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <div class="widget-chart-1">
                                <div
                                  class="widget-chart-box-1 float-start"
                                  dir="ltr"
                                >
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      padding: "20% 20% 0% 20%",
                                    }}
                                  >
                                    <CircularProgressbar
                                      maxValue={
                                        getTeamsDetail.length == 0
                                          ? "0"
                                          : getTeamsDetail.length
                                      }
                                      value={
                                        TotalLoggedOut.length == 0
                                          ? "0"
                                          : TotalLoggedOut.length
                                      }
                                      text={`${
                                        TotalLoggedOut.length == 0
                                          ? "0"
                                          : TotalLoggedOut.length
                                      }/${
                                        getTeamsDetail.length == 0
                                          ? "0"
                                          : getTeamsDetail.length
                                      }`}
                                      styles={buildStyles({
                                        strokeLinecap: "butt",
                                        textSize: 27,
                                        pathTransitionDuration: 1,
                                        pathTransition: "none",
                                        pathColor: `rgba(240, 80, 80, 1)`,
                                        textColor: "#f05050",
                                        trailColor: "#ededed",
                                        backgroundColor: "#f05050",
                                      })}
                                    />
                                  </div>
                                </div>
                              </div>
                              <h6
                                className="text-center"
                                style={{ margin: "15px 0px 15px 0px" }}
                              >
                                Logged Out
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-66 text-center cols-7">
                          <div
                            class="card card-body-admin"
                            style={{ display: "block" }}
                          >
                            <div
                              class=""
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <div class="widget-chart-1">
                                <div
                                  class="widget-chart-box-1 float-start"
                                  dir="ltr"
                                >
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      padding: "20% 20% 0% 20%",
                                    }}
                                  >
                                    <CircularProgressbar
                                      maxValue={
                                        getTeamsDetail.length == 0
                                          ? "0"
                                          : getTeamsDetail.length
                                      }
                                      value={
                                        TeamOnBreak.length == 0
                                          ? "0"
                                          : TeamOnBreak.length
                                      }
                                      text={`${
                                        TeamOnBreak.length == 0
                                          ? "0"
                                          : TeamOnBreak.length
                                      }/${
                                        getTeamsDetail.length == 0
                                          ? "0"
                                          : getTeamsDetail.length
                                      }`}
                                      styles={buildStyles({
                                        strokeLinecap: "butt",
                                        textSize: 27,
                                        pathTransitionDuration: 1,
                                        pathTransition: "none",
                                        pathColor: `rgba(240, 80, 80, 1)`,
                                        textColor: "#f05050",
                                        trailColor: "#ededed",
                                        backgroundColor: "#f05050",
                                      })}
                                    />
                                  </div>
                                </div>
                              </div>
                              <h6
                                className="text-center"
                                style={{ margin: "15px 0px 15px 0px" }}
                              >
                                On Break
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-66 text-center cols-7">
                          <div
                            class="card card-body-admin"
                            style={{ display: "block" }}
                          >
                            <div
                              class=""
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <div class="widget-chart-1">
                                <div
                                  class="widget-chart-box-1 float-start"
                                  dir="ltr"
                                >
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      padding: "20% 20% 0% 20%",
                                    }}
                                  >
                                    <CircularProgressbar
                                      maxValue={
                                        getTeamsDetail.length == 0
                                          ? "0"
                                          : getTeamsDetail.length
                                      }
                                      value={
                                        YetToStart.length == 0
                                          ? "0"
                                          : YetToStart.length
                                      }
                                      text={`${
                                        YetToStart.length == 0
                                          ? "0"
                                          : YetToStart.length
                                      }/${
                                        getTeamsDetail.length == 0
                                          ? "0"
                                          : getTeamsDetail.length
                                      }`}
                                      styles={buildStyles({
                                        strokeLinecap: "butt",
                                        textSize: 27,
                                        pathTransitionDuration: 1,
                                        pathTransition: "none",
                                        pathColor: `rgba(240, 80, 80, 1)`,
                                        textColor: "#f05050",
                                        trailColor: "#ededed",
                                        backgroundColor: "#f05050",
                                      })}
                                    />
                                  </div>
                                </div>
                              </div>
                              <h6
                                className="text-center"
                                style={{ margin: "15px 0px 15px 0px" }}
                              >
                                Yet to start
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-66 text-center cols-7">
                          <div
                            class="card card-body-admin"
                            style={{ display: "block" }}
                          >
                            <div
                              class=""
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <div class="widget-chart-1">
                                <div
                                  class="widget-chart-box-1 float-start"
                                  dir="ltr"
                                >
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      padding: "20% 20% 0% 20%",
                                    }}
                                  >
                                    <CircularProgressbar
                                      text={`${TeamTotalBrk} hrs`}
                                      styles={buildStyles({
                                        textSize: "25px",
                                        pathTransitionDuration: 0.5,
                                        pathTransition: "none",
                                        pathColor: "#FFF",
                                        textColor: "red",
                                        trailColor: "#FFF",
                                        backgroundColor: "#FFF",
                                      })}
                                    />
                                  </div>
                                </div>
                              </div>
                              <h6
                                className="text-center"
                                style={{ margin: "15px 0px 15px 0px" }}
                              >
                                Total Break
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-66 text-center cols-7">
                          <div
                            class="card card-body-admin"
                            style={{ display: "block" }}
                          >
                            <div
                              class=""
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <div class="widget-chart-1">
                                <div
                                  class="widget-chart-box-1 float-start"
                                  dir="ltr"
                                >
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      padding: "20% 20% 0% 20%",
                                    }}
                                  >
                                    <CircularProgressbar
                                      text={`${TeamAVGTIME} hrs`}
                                      styles={buildStyles({
                                        textSize: "25px",
                                        pathTransitionDuration: 0.5,
                                        pathTransition: "none",
                                        pathColor: "#FFF",
                                        textColor: "red",
                                        trailColor: "#FFF",
                                        backgroundColor: "#FFF",
                                      })}
                                    />
                                  </div>
                                </div>
                              </div>
                              <h6
                                className="text-center"
                                style={{ margin: "15px 0px 15px 0px" }}
                              >
                                Average Login Time
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-66 text-center cols-7">
                          <div
                            class="card card-body-admin"
                            style={{ display: "block" }}
                          >
                            <div
                              class=""
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <div class="widget-chart-1">
                                <div
                                  class="widget-chart-box-1 float-start"
                                  dir="ltr"
                                >
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      padding: "20% 20% 0% 20%",
                                    }}
                                  >
                                    <CircularProgressbar
                                      maxValue={
                                        getTeamsDetail.length == 0
                                          ? "0"
                                          : getTeamsDetail.length
                                      }
                                      value={
                                        TeamOnCall.length == 0
                                          ? "0"
                                          : TeamOnCall.length
                                      }
                                      text={`${
                                        TeamOnCall.length == 0
                                          ? "0"
                                          : TeamOnCall.length
                                      }/${
                                        getTeamsDetail.length == 0
                                          ? "0"
                                          : getTeamsDetail.length
                                      }`}
                                      styles={buildStyles({
                                        strokeLinecap: "butt",
                                        textSize: 25,
                                        pathTransitionDuration: 1,
                                        pathTransition: "none",
                                        pathColor: `rgba(240, 80, 80, 1)`,
                                        textColor: "#f05050",
                                        trailColor: "#ededed",
                                        backgroundColor: "#f05050",
                                      })}
                                    />
                                  </div>
                                </div>
                              </div>
                              <h6
                                className="text-center"
                                style={{ margin: "15px 0px 15px 0px" }}
                              >
                                On Call
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-12 col-xl-12">
                <TeamAttendanceTable {...props} />
              </div>
              <div class="col-lg-12 col-xl-12">
                <TeamTodaysTask {...props} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
