import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import ManagerTaskTable from "./ManagerTaskTable";
import EditManagerTask from "../EditManagerTask/EditManagerTask";
import ManagerViewUser from "../ManagerViewUser/ManagerViewUser";

export default function ManagerTaskDetail(props) {
  // console.log("props in particular task view", props);
  const [GetTaskData, setTaskData] = useState(props.taskDetail);
  const [getTaskId, setTaskId] = useState(props.taskDetail.id);

  useEffect(() => {}, [props]);

  const handleTask = () => {
    props.handleDashComponent(
      "",
      <EditManagerTask
        item={GetTaskData}
        handleDashComponent={props.handleDashComponent}
      />
    );
  };

  const handleBack = () => {
    props.getData != undefined
      ? props.handleDashComponent("", <ManagerViewUser {...props} />)
      : props.handleDashComponent(6);
  };

  return (
    <>
      <div class="container-fluid">
        <div className="card">
          <div className="card-body">
            <div class="row">
              <div class="col-12">
                <div class="grid-structure">
                  <div class="row">
                    <div class="col-10 col-md-10">
                      <div class="row">
                        <div class="col-6 col-md-2">
                          <div class="grid-cont1ainer">
                            <div class="row">
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 12, margin: 0 }}
                              >
                                First name
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {GetTaskData.firstname}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 col-md-2">
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
                                {GetTaskData.lastname}
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
                                {GetTaskData.mobile}
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
                                {GetTaskData.CustomerEmail}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 col-md-2">
                          <div class="grid-con1tainer">
                            <div class="row">
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 12, margin: 0 }}
                              >
                                Reference
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {GetTaskData.refrence_from}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 col-md-2">
                          <div class="grid-con1tainer">
                            <div class="row">
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 12, margin: 0 }}
                              >
                                Assigned to
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {GetTaskData.UserName}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 col-md-2">
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
                                {GetTaskData.TeamName}
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
                                Task Date & Time
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {moment(GetTaskData.created_at).format(
                                  "DD/MM/YYYY HH:mm a"
                                )}
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
                                Task Type
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {GetTaskData.TaskType}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 col-md-2">
                          <div class="grid-con1tainer">
                            <div class="row">
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 12, margin: 0 }}
                              >
                                Task Priority
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {GetTaskData.TaskPriority}
                              </label>
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
                            flexDirection: "column",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="button"
                            class="btn btn-success btn-xs"
                            style={{
                              borderRadius: 5,
                            }}
                            onClick={() => handleTask()}
                          >
                            <i class="mdi mdi-pencil"></i> Edit Task
                          </button>

                          <button
                            type="button"
                            class="btn btn-success btn-xs"
                            style={{
                              borderRadius: 5,
                              marginTop: 35,
                              textAlign: "center",
                            }}
                            onClick={() => handleBack()}
                          >
                            <i class="m-r-10 mdi mdi-arrow-left-bold"></i> Go
                            Back
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <ManagerTaskTable getTaskId={getTaskId} />
        </div>
      </div>
    </>
  );
}
