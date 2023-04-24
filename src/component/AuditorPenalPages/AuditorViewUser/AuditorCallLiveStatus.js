import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { postDataAxios } from "../../../services/FetchNodeServices";

export default function AuditorCallLiveStatus(props) {
  // console.log("Props in CallLive status", props);
  const [getAverageTalkTime, setAverageTalkTime] = useState("");
  const [getTotalTalkTime, setTotalTalkTime] = useState("");
  const [getTotalBreak, setTotalBreak] = useState("");
  const [getAverageClockTime, setAverageClockTime] = useState("");
  const [getUserId, setUserId] = useState(props.getData.id);
  const [getCompanyId, setCompanyId] = useState(props.getData.company_id);

  useEffect(() => {
    fetchData();
  }, [props]);

  const fetchData = async () => {
    try {
      let body = {
        user: getUserId,
        company_id: getCompanyId,
      };
      let CallLiveResult = await postDataAxios(`calls/monthCSRDetails`, body);
      // console.log("CallLiveResult ======> ", CallLiveResult);
      if (CallLiveResult.status == true) {
        setAverageTalkTime(CallLiveResult.result[0].AverageTalkTime);
        setTotalTalkTime(CallLiveResult.result[0].TotalTalkTime);
        setTotalBreak(CallLiveResult.result[0].TotalBreak);
        setAverageClockTime(CallLiveResult.result[0].AverageClockInTime);
      } else {
        setAverageTalkTime("00:00:00");
        setTotalTalkTime("00:00:00");
        setTotalBreak("00:00:00");
        setAverageClockTime("00:00:00");
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleFetchLastMonth = async () => {
    try {
      let body = {
        user: getUserId,
        company_id: getCompanyId,
      };
      let CallLiveResult = await postDataAxios(
        `calls/lastmonthCSRDetails`,
        body
      );
      // console.log("CallLiveResult ======> ", CallLiveResult);
      if (CallLiveResult.status == true) {
        swal({
          title: `record found`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAverageTalkTime(CallLiveResult.result[0].AverageTalkTime);
          setTotalTalkTime(CallLiveResult.result[0].TotalTalkTime);
          setTotalBreak(CallLiveResult.result[0].TotalBreak);
          setAverageClockTime(CallLiveResult.result[0].AverageClockInTime);
        });
      } else {
        swal({
          title: `something went wrong`,
          icon: "error",
          button: "ok",
        }).then(() => {
          setAverageTalkTime("00:00:00");
          setTotalTalkTime("00:00:00");
          setTotalBreak("00:00:00");
          setAverageClockTime("00:00:00");
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleFetchLastThreeMonth = async () => {
    try {
      let body = {
        user: getUserId,
        company_id: getCompanyId,
      };
      let CallLiveResult = await postDataAxios(
        `calls/last3monthCSRDetails`,
        body
      );
      // console.log("CallLiveResult ======> ", CallLiveResult);
      if (CallLiveResult.status == true) {
        swal({
          title: `record found`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAverageTalkTime(CallLiveResult.result[0].AverageTalkTime);
          setTotalTalkTime(CallLiveResult.result[0].TotalTalkTime);
          setTotalBreak(CallLiveResult.result[0].TotalBreak);
          setAverageClockTime(CallLiveResult.result[0].AverageClockInTime);
        });
      } else {
        swal({
          title: `something went wrong`,
          icon: "error",
          button: "ok",
        }).then(() => {
          setAverageTalkTime("00:00:00");
          setTotalTalkTime("00:00:00");
          setTotalBreak("00:00:00");
          setAverageClockTime("00:00:00");
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  return (
    <>
      <div>
        <div className="card">
          <div className="card-body">
            <div class="row">
              <div class="col-12">
                <div class="grid-structure">
                  <div class="row">
                    <div class="col-10 col-md-10">
                      <div class="row">
                        <h5 class="mb-2">User status</h5>
                        <div class="col-6 col-md-3">
                          <div class="grid-cont1ainer">
                            <div class="card">
                              <div class="card-body card-body-admin">
                                <div class="widget-chart-1">
                                  <div class="widget-chart-box-1" dir="ltr">
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        color: "red",
                                      }}
                                    >
                                      <b>
                                        {getAverageTalkTime == null
                                          ? "00:00:00"
                                          : getAverageTalkTime}
                                      </b>
                                    </div>
                                    <h5
                                      style={{
                                        fontSize: "12px",
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                      class="header-title mt-0 mb-0"
                                    >
                                      Average Talktime
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 col-md-3">
                          <div class="grid-co1ntainer">
                            <div class="card">
                              <div class="card-body card-body-admin">
                                <div class="widget-chart-1">
                                  <div class="widget-chart-box-1" dir="ltr">
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        color: "red",
                                      }}
                                    >
                                      <b>
                                        {" "}
                                        {getTotalTalkTime == null
                                          ? "00:00:00"
                                          : getTotalTalkTime}
                                      </b>
                                    </div>
                                    <h5
                                      style={{
                                        fontSize: "12px",
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                      class="header-title mt-0 mb-0"
                                    >
                                      Total Talktime
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 col-md-3">
                          <div class="grid-con1tainer">
                            <div class="card">
                              <div class="card-body card-body-admin">
                                <div class="widget-chart-1">
                                  <div class="widget-chart-box-1" dir="ltr">
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        color: "red",
                                      }}
                                    >
                                      <b>
                                        {" "}
                                        {getTotalBreak == null
                                          ? "00:00:00"
                                          : getTotalBreak}{" "}
                                      </b>
                                    </div>
                                    <h5
                                      style={{
                                        fontSize: "12px",
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                      class="header-title mt-0 mb-0"
                                    >
                                      Total Break
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 col-md-3">
                          <div class="grid-con1tainer">
                            <div class="card">
                              <div class="card-body card-body-admin">
                                <div class="widget-chart-1">
                                  <div class="widget-chart-box-1" dir="ltr">
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        color: "red",
                                      }}
                                    >
                                      <b>
                                        {getAverageClockTime == null
                                          ? "00:00:00"
                                          : getAverageClockTime}{" "}
                                      </b>
                                    </div>
                                    <h5
                                      style={{
                                        fontSize: "12px",
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                      class="header-title mt-0 mb-0"
                                    >
                                      Average Clock In time
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-2 col-md-2">
                      <div class="col-12 col-md-12">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            flexDirection: "column",
                          }}
                        >
                          <div class="grid-cont1ainer">
                            <div class="row ">
                              <div>
                                <div className="dropdown float-end">
                                  <a
                                    href="#"
                                    className="dropdown-toggle arrow-none card-drop"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <button
                                      type="button"
                                      class="btn btn-primary btn-sm"
                                      style={{
                                        borderRadius: 5,
                                      }}
                                    >
                                      <i class="mdi mdi-filter"></i> Filter
                                    </button>
                                  </a>
                                  <div
                                    className="dropdown-menu dropdown-menu-end"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <div
                                      href="javascript:void(0);"
                                      className="dropdown-item"
                                      onClick={() => handleFetchLastMonth(2)}
                                    >
                                      Last month
                                    </div>
                                    {/* item*/}
                                    <div
                                      href="javascript:void(0);"
                                      className="dropdown-item"
                                      onClick={() =>
                                        handleFetchLastThreeMonth(3)
                                      }
                                    >
                                      Last 3 month
                                    </div>
                                    {/* item*/}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
