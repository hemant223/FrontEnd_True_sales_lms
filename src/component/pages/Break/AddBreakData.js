import { event } from "jquery";
import moment from "moment";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { checkRequire } from "../../../services/Checks";
import {
  getDataAxios,
  postData,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import { Avatar, Button } from "@mui/material";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
export default function AddBreakData(props) {

    const [Customer, setCustomer] = useState("");
    const [getErrCustomerId, setErrCustomerId] = useState("");
    const [checkvalidate, setcheckvalidate] = useState(false);
    const [validated, setValidated] = useState(false);
    const [Assign, setAssign] = useState("");


  const [attendanceId, setAttendanceId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [inTimeGps, setInTimeGps] = useState("");
  const [outTimeGps, setOutTimeGps] = useState("");
  const [status, setStatus] = useState("");
  // const [createdAt, setCreatedAt] = useState('')
  const [duration, setDuration] = useState("");
  const [breakType, setBreakType] = useState("");




  const handleBack = (option) => {
    props.handleDashComponent(option);
  };

 






  const handleAddCustomer = async () => {
    try {
      var err = false;
    
      var a = Assign.toString().trim();
      var teamid = a.split(" ")[1];
      var userid = a.split(" ")[0];
      if (!err) {
        var body = {
            attendanceId: attendanceId,
            startTime: startTime,
            endTime: endTime,
            inTimeGps: inTimeGps,
            outTimeGps: outTimeGps,
            status: status,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            duration: duration,
            breakType: breakType,
          };
          var result = await postData("break/add_new_break_data", body);
        if (result.result == true) {
          swal({
            title: `Break Added SuccesFully`,
            icon: "success",
            button: "ok",
          })
        } else {
          swal({
            title: `Something went wrong`,
            icon: "info",
            button: "ok",
          });
        }
      } else {
        swal({
          title: "Please select customer",
          icon: "warning",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      handleAddCustomer();
    } else {
      handleAddCustomer();
    }
    setValidated(true);
  };

  return (
    <>
   


      <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body" style={{ padding: "2%" }}>
                  <b>Add Break</b>
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <div class="row mt-3">
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom01"
                        >
                          <Form.Label>Attendence</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Attendence"
                            value={attendanceId}
                            onChange={(event) =>
                              setAttendanceId(event.target.value)
                            }
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Attendence
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom02"
                        >
                          <Form.Label>Start Time</Form.Label>
                          <Form.Control
                            type="text"
                            value={startTime}
                          onChange={(event) => setStartTime(event.target.value)}
                            placeholder="Start Time"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Start Time
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom03"
                        >
                          <Form.Label>End Time</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="End Time"
                            value={endTime}
                            onChange={(event) => setEndTime(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter End Time
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom04"
                        >
                          <Form.Label>In Time Gps</Form.Label>
                          <Form.Control
                            type="text"
                            value={inTimeGps}
                            onChange={(event) => setInTimeGps(event.target.value)}
                            placeholder="In Time Gps"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                          In Time Gps
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom05"
                        >
                          <Form.Label>Out Time Gps</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Out Time Gps"
                            value={outTimeGps}
                          onChange={(event) =>
                            setOutTimeGps(event.target.value)
                          }
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Out Time Gps
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom06"
                        >
                          <Form.Label>Status</Form.Label>
                          <Form.Control
                            type="text"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            placeholder="Status"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Status
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom05"
                        >
                          <Form.Label>Duration</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Duration"
                           value={duration}
                          onChange={(event) => setDuration(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Duration
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom06"
                        >
                          <Form.Label>Break Type</Form.Label>
                          <Form.Control
                            type="text"
                            value={breakType}
                            onChange={(event) => setBreakType(event.target.value)}
                            placeholder="Break Type"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Break Type
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>



                    </div>
                    <div class="col-xl-6">
                      <div class="button-list">
                        <button
                          type="submit"
                          class="btn btn-sm waves-effect waves-light"
                          style={{
                            background: "#4261F7",
                            color: "#fff",
                            borderRadius: 5,
                            height: "38px",
                          }}
                        >
                          Create
                        </button>

                        <button
                          onClick={() => handleBack(4.3)}
                          class="btn btn-sm waves-effect waves-light"
                          style={{
                            background: "#C9C9CB",
                            color: "#fff",
                            borderRadius: 5,
                            height: "38px",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
