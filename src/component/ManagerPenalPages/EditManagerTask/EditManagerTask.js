import React, { useEffect, useState } from "react";
import {
  postDataAxios,
  getDataAxios,
} from "../../../services/FetchNodeServices";
import moment from "moment/moment";
import swal from "sweetalert";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

export default function EditManagerTask(props) {
  // console.log("geting particular task id in Manager Task", props);
  var UserData = JSON.parse(localStorage.getItem("user"));
  const [Customer, setCustomer] = useState("");
  const [Created_At, setCreated_At] = useState("");
  const [Updated_At, setUpdated_At] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  const [TaskTypeList, setTaskTypeList] = useState([]);
  const [TaskPriorityList, setTaskPriorityList] = useState([]);
  const [TaskType, setTaskType] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Priority, setPriority] = useState("");
  const [TaskStatusList, setTaskStatusList] = useState([]);
  const [Status, setStatus] = useState("");
  const [CustomerList, setCustomerList] = useState([]);
  const [Mobile, setMobile] = useState("");
  const [Assign, setAssign] = useState("");
  const [getTeamData, setTeamData] = useState([]);
  const [Email, setEmail] = useState("");
  const [TaskAddedDate, setTaskAddedDate] = useState("");
  const [Note, setNote] = useState("");
  const [Refo, setRefo] = useState("");
  const [Namewithid, setNamewithid] = useState({});
  const [SinglTaskId, setSingleTaskId] = useState(props.item.id);

  const [OptionData, setOptionData] = useState("");
  const [AssignName, setAssignName] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    fetchTaskType();
    fetchTaskPriority();
    fetchTaskStatus();
    fetchCustomer();
    fetchTeam();
    FetchSingleTask();
  }, [props]);

  const fetchTaskStatus = async () => {
    try {
      const TaskStatusResult = await getDataAxios(
        `task/newPenalTaskStatus/${UserData.company_id}`
      );
      TaskStatusResult.status && setTaskStatusList(TaskStatusResult.result);
      // console.log('taskstatus....->',TaskStatusResult)
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchTaskType = async () => {
    try {
      const TaskTypeResult = await getDataAxios(
        `tasktype/display/${UserData.company_id}`
      );
      TaskTypeResult.status && setTaskTypeList(TaskTypeResult.result);
      // console.log("priorityDisplay====64", TaskTypeResult);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchTaskPriority = async () => {
    try {
      const TaskPriority = await getDataAxios(
        `taskpriority/display/${UserData.company_id}`
      );
      TaskPriority.status && setTaskPriorityList(TaskPriority.result);
      // console.log("TaskPriority====58", TaskPriority);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchCustomer = async () => {
    try {
      const CustomerResult = await getDataAxios(
        `customers/ManagerCustomersDisplayAll/${UserData.company_id}/${UserData.id}`
      );
      // console.log("Customer Result ========== 53", CustomerResult);
      CustomerResult.status && setCustomerList(CustomerResult.resultt[0]);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchTeam = async () => {
    try {
      const result = await getDataAxios(
        `team/managerPenalTeamsDisplay/${UserData.company_id}/${UserData.id}`
      );
      // console.log("result---->", result.data);
      setTeamData(result.data);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fillTaskType = () => {
    return TaskTypeList.map(function (item) {
      return (
        <option value={item.task_type_id} key={item.task_type_id}>
          {item.task_type}
        </option>
      );
    });
  };

  const fillPriority = () => {
    return TaskPriorityList.map(function (item) {
      return (
        <option value={item.task_priority_id} key={item.task_priority_id}>
          {item.taskpriority}
        </option>
      );
    });
  };

  const fillStatus = () => {
    return TaskStatusList.map(function (item) {
      return (
        <option value={item.taskstatus_id} key={item.taskstatus_id}>
          {item.task_status}
        </option>
      );
    });
  };

  const fillCustomer = () => {
    return CustomerList.map(function (item) {
      return <MenuItem value={item.id}>{item.name}</MenuItem>;
    });
  };

  const managerUserCustomer = () => {
    return getTeamData.map(function (item) {
      var t = [];
      var t1 = [];
      try {
        t = item.UserName.split(",");
        t1 = item.UserId.split(",");
      } catch (e) {
        t = [];
      }
      return (
        <optgroup label={`${item.team_name} / ${item.TeamHead}`}>
          {t.map((itm, index) => {
            return <option value={t1[index]}>{itm}</option>;
          })}
        </optgroup>
      );
    });
  };

  const UpdateCustomerTask = async () => {
    try {
      var AssignFinal = Assign.toString().trim();

      var body = {
        firstname: FirstName,
        lastname: LastName,
        status: Status ? Status : 1,
        customer: Customer,
        user: AssignFinal,
        note: Note,
        mobile: Mobile,
        created_at: Created_At,
        updated_at: Updated_At,
        company_id: UserData.company_id,
        refrence_from: Refo,
        task_type: TaskType,
        priority: Priority,
        task_created_by: UserData.id,
        task_added_date: TaskAddedDate,
      };
      const result = await postDataAxios(
        `task/updateApp/${SinglTaskId}/${UserData.company_id}`,
        body
      );
      if (result.status) {
        swal({
          title: `${result.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setCustomer("");
          setEmail("");
          setTaskType("");
          setPriority("");
          setCreated_At(null);
          setStatus("");
          setRefo("");
          setNote("");
          setAssign("");
          setMobile("");
          handleBack(6);
        });
      } else {
        swal({
          title: `${result.message}`,
          icon: "info",
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
      UpdateCustomerTask();
    } else {
      UpdateCustomerTask();
    }
    setValidated(true);
  };

  const FetchSingleTask = async () => {
    try {
      var tR = await getDataAxios(
        `task/DisplayTasks/${SinglTaskId}/${UserData.company_id}`
      );
      // var tR = await getDataAxios(`task/display/${UserData.company_id}`);
      // console.log("Getting info particular--->", tR.data);
      setOptionData(`${tR.data[0].firstname} ${tR.data[0].lastname}`);
      setCustomer(tR.data[0].customer);
      setMobile(tR.data[0].mobile);
      setAssign(tR.data[0].user);
      setAssignName(tR.data[0].UserName);
      setTaskType(tR.data[0].task_type);
      setStatus(tR.data[0].status);
      setPriority(tR.data[0].priority);
      setRefo(tR.data[0].refrence_from);
      setNote(tR.data[0].note);
      setEmail(tR.data[0].Email);
      setCreated_At(tR.data[0].created_at);
      setFirstName(tR.data[0].firstname);
      setLastName(tR.data[0].lastname);
      setTaskAddedDate(tR.data[0].task_added_date);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleBack = (option) => {
    {
      props.props == undefined
        ? props.handleDashComponent(option)
        : props.props.props.props.handleDashComponent(option);
    }
  };

  return (
    <>
      <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <b>Edit Task</b>
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
                          <Form.Label>Select Customer</Form.Label>
                          <FormControl fullWidth>
                            <Select
                              disabled
                              value={Customer}
                              readOnly
                              onChange={(event) =>
                                setCustomer(event.target.value)
                              }
                              input={<BootstrapInput />}
                              required
                            >
                              <div class="search-box chat-search-box">
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="Search..."
                                />
                                <i class="mdi mdi-magnify search-icon"></i>
                              </div>
                              <MenuItem selected value="">
                                -- Select Customer --
                              </MenuItem>
                              {fillCustomer()}
                            </Select>{" "}
                          </FormControl>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom02"
                        >
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            required
                            type="Email"
                            value={Email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Email"
                            // pattern="[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            disabled
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter valid email
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Mobile Number</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Mobile number"
                            readOnly
                            value={Mobile}
                            onChange={(event) => setMobile(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter valid mobile number
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Assign</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={Assign}
                            onChange={(event) => setAssign(event.target.value)}
                            placeholder="Select Priority"
                            required
                          >
                            <option>{AssignName}</option>
                            {managerUserCustomer()}
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Kindly assign user to any Customer
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom05"
                        >
                          <Form.Label>Task Type</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={TaskType}
                            onChange={(event) =>
                              setTaskType(event.target.value)
                            }
                            placeholder="Task type"
                            required
                          >
                            <option selected value="">
                              --Select task type--
                            </option>
                            {fillTaskType()}
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Kindly assign task to any Customer
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom06"
                        >
                          <Form.Label>Task status</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={Status}
                            onChange={(event) => setStatus(event.target.value)}
                            placeholder="Task type"
                            required
                          >
                            <option selected value="">
                              --Select task type--
                            </option>
                            {fillStatus()}
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Select status of task
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom07"
                        >
                          <Form.Label>Task Priority</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={Priority}
                            onChange={(event) =>
                              setPriority(event.target.value)
                            }
                            placeholder="Task Priority"
                            required
                            disabled
                          >
                            <option selected value="">
                              -- Select task priority --
                            </option>
                            {fillPriority()}
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Please select priority of task
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom08"
                        >
                          <Form.Label>Task Date & Time</Form.Label>
                          <Form.Control
                            required
                            type="datetime-local"
                            placeholder="Date"
                            value={Created_At}
                            onChange={(newValue) => {
                              setCreated_At(newValue.target.value);
                            }}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Please pick vaild date
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom09"
                        >
                          <Form.Label>Reference</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            value={Refo}
                            onChange={(event) => setRefo(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Please provide reference
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom10"
                        >
                          <Form.Label>Remark</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            value={Note}
                            onChange={(event) => setNote(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Please fill remark if any
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
                          Update
                        </button>
                        <button
                          onClick={() => handleBack(6)}
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
