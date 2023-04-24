import React, { useEffect, useState } from "react";
import {
  postDataAxios,
  getDataAxios,
} from "../../../services/FetchNodeServices";
import moment from "moment/moment";
import swal from "sweetalert";
import { checkRequire } from "../../../services/Checks";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Selecttt from "react-select";

export default function AddTask(props) {
  var UserData = JSON.parse(localStorage.getItem("user"));
  const [Customer, setCustomer] = useState("");
  const [Created_At, setCreated_At] = useState("");
  const [TaskTypeList, setTaskTypeList] = useState([]);
  const [TaskPriorityList, setTaskPriorityList] = useState([]);
  const [TaskType, setTaskType] = useState("");
  const [Priority, setPriority] = useState("");
  const [TaskStatusList, setTaskStatusList] = useState([]);
  const [Status, setStatus] = useState("");
  const [CustomerList, setCustomerList] = useState([]);
  const [getTempCustomerList, setTempCustomerList] = useState([]);
  const [Mobile, setMobile] = useState("");
  const [Assign, setAssign] = useState("");
  const [getAssignUserName, setAssignUserName] = useState("");
  const [getTeamData, setTeamData] = useState([]);
  const [Email, setEmail] = useState("");
  const [Note, setNote] = useState("");
  const [Refo, setRefo] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [getErrCustomerId, setErrCustomerId] = useState("");

  useEffect(() => {
    fetchTaskType();
    fetchTaskPriority();
    fetchTaskStatus();
    fetchCustomer();
    fetchTeam();
  }, []);

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
        `customers/displayAll/${UserData.company_id}`
      );
      // console.log("Customer Result ========== 53", CustomerResult);
      setCustomerList(CustomerResult.Data[0]);
      setTempCustomerList(CustomerResult.Data[0]);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchTeam = async () => {
    try {
      const result = await getDataAxios(
        `team/teamsHeadDisplay/${UserData.company_id}`
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

  const data = CustomerList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const handleAddCustomer = async () => {
    try {
      var err = false;
      if (!checkRequire(Customer)) {
        err = true;
        setErrCustomerId("images/cross.png");
      }
      if (checkRequire(Customer)) {
        setErrCustomerId("images/tick.png");
      }
      var a = Assign.toString().trim();
      var teamid = a.split(" ")[1];
      var userid = a.split(" ")[0];
      if (!err) {
        var body = {
          firstname: FirstName,
          lastname: LastName,
          status: Status,
          customer: Customer,
          user: userid,
          note: Note,
          mobile: Mobile,
          created_at: moment(Created_At).format("YYYY-MM-DD HH:mm:ss"),
          company_id: UserData.company_id,
          refrence_from: Refo,
          task_type: TaskType,
          priority: Priority,
          task_created_by: UserData.id,
          task_added_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        const result = await postDataAxios("task/add", body);
        if (result.status == true) {
          swal({
            title: `${result.message}`,
            icon: "success",
            button: "ok",
          }).then(() => {
            setCustomer("");
            setEmail("");
            setTaskType("");
            setPriority("");
            setCreated_At("");
            setStatus("");
            setRefo("");
            setNote("");
            setAssign("");
            setAssignUserName("");
            setMobile("");
            setErrCustomerId("");
            handleBack(6);
          });
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

  const handleSelectCustomer = (event) => {
    setCustomer(event.value);
    handleFetchCustomerDetail(event.value);
  };


  
  const handleFetchCustomerDetail = async (Cus_id) => {
    try {
      const fetchCustomerDetail = await getDataAxios(
        `customers/customerDetail/${Cus_id}/${UserData.company_id}`
      );
      // console.log("fetchCustomerDetail------------->>>>>>>", fetchCustomerDetail);
      setFirstName(fetchCustomerDetail.data[0].firstname);
      setLastName(fetchCustomerDetail.data[0].lastname);
      setEmail(fetchCustomerDetail.data[0].email);
      setMobile(fetchCustomerDetail.data[0].mobile);
      setAssign(fetchCustomerDetail.data[0].user);
      setAssignUserName(fetchCustomerDetail.data[0].UserName);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleBack = (option) => {
    props.handleDashComponent(option);
  };

  return (
    <>
      <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body" style={{ padding: "2%" }}>
                  <b>Add Task</b>
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
                          <img
                            class="col"
                            src={getErrCustomerId}
                            width={"10px"}
                            height={"10px"}
                          />
                          <Selecttt
                            className="basic-single"
                            classNamePrefix="select customer"
                            defaultValue={0}
                            isSearchable={true}
                            options={data}
                            onChange={(event) => handleSelectCustomer(event)}
                          />
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
                            disabled
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
                          <Form.Control
                            type="text"
                            value={getAssignUserName}
                            onChange={(e) => setAssign(e.target.value)}
                            placeholder="Assign user"
                            required
                            disabled
                          ></Form.Control>
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
                          <Form.Label>Task Status</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={Status}
                            onChange={(event) => setStatus(event.target.value)}
                            placeholder="Task type"
                            required
                          >
                            <option selected value="">
                              --Select task status--
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
                            placeholder="Task type"
                            required
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
                          Create
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
