import React, { useEffect, useState } from "react";
import { getDataAxios } from "../../../services/FetchNodeServices";
import moment from "moment";

export default function CallStatus(props) {
  const [UserId, setUserId] = useState(props.getData.id);
  const [CompanyId, setCompany] = useState(props.getData.company_id);
  const [CallTime, setCallTime] = useState("");
  const [TotalIdleTime, setTotalIdle] = useState("");

  useEffect(() => {
    fetchOnCallTime();
    IdleTime();
  }, [props]);

  const fetchOnCallTime = async () => {
    try {
      let responseResult = await getDataAxios(
        `break/callStatusDuration/${CompanyId}/${UserId}`
      );
      // console.log("responseResult", responseResult.result);
      if (responseResult.status == true && responseResult.result.length != 0) {
        let aaa = moment(responseResult.result[0].CallTime);
        let hour = aaa.hours();
        let min = aaa.minutes();
        let sec = aaa.seconds();
        var originalTime = moment();
        // console.log("original time--->", originalTime.toString());
        var SubtractTime = originalTime.subtract({
          hours: hour,
          minutes: min,
          seconds: sec,
        });
        var finalSubtractTime =
          SubtractTime.hours() +
          ":" +
          SubtractTime.minutes() +
          ":" +
          SubtractTime.seconds();
        // console.log("finalSubtractTime -----> ", finalSubtractTime);
        setCallTime(finalSubtractTime);
      } else {
        setCallTime("00:00:00");
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const IdleTime = async () => {
    try {
      let currentTime = moment().format("HH:mm");
      // console.log("currentTimeeee", currentTime);
      let totalIdleTimeResult = await getDataAxios(
        `break/totalIdleTime/${CompanyId}/${UserId}`
      );
      // console.log("totalIdleTimeResult ----> ", totalIdleTimeResult.result);
      if (
        totalIdleTimeResult.status == true &&
        totalIdleTimeResult.result.length != 0
      ) {
        var onlyTime = totalIdleTimeResult.result[0].updated_at.split(" ")[1];
        var inhour = onlyTime.split(":")[0];
        var inmins = onlyTime.split(":")[1];
        // var insec = onlyTime.split(":")[2];
        var crrhour = currentTime.split(":")[0];
        var crrmins = currentTime.split(":")[1];
        // var crrsec = currentTime.split(":")[2];
        const time1 = moment(`${inhour}:${inmins}`, `hh:mm`);
        const time2 = moment(`${crrhour}:${crrmins}`, `hh:mm`);
        const subtract = JSON.stringify(time2.subtract(time1));
        const splited_time = subtract.split("T")[1].split(".")[0];
        const date = splited_time.split(":")[0];
        const date2 = splited_time.split(":")[1];
        const FinalTime = `${date}:${date2}`;
        // console.log("FinalTime-------------->>>>>>>317", FinalTime);
        setTotalIdle(FinalTime);
      } else {
        setTotalIdle("00:00:00");
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
                        <h5 class="mb-2">Call Live Status</h5>
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
                                      <b>{CallTime}</b>
                                    </div>
                                    <h5
                                      style={{
                                        fontSize: "12px",
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                      class="header-title mt-0 mb-0"
                                    >
                                      Call time
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
                                      <b>{TotalIdleTime}</b>
                                    </div>
                                    <h5
                                      style={{
                                        fontSize: "12px",
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                      class="header-title mt-0 mb-0"
                                    >
                                      Total idle time
                                    </h5>
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
