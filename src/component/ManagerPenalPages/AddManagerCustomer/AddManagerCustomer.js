import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import {
  postDataAxios,
  getDataAxios,
} from "../../../services/FetchNodeServices";
import swal from "sweetalert";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function AddManagerCustomer(props) {
  var UserData = JSON.parse(localStorage.getItem("user"));
  const [Firstname, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [EmailAddress, setEmailAddress] = useState("");
  const [Mobile, setMobile] = useState("");
  const [getCompanyId, setCompanyId] = useState(UserData.company_id);
  const [Created_At, setCreated_At] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  const [Address, setAddress] = useState("");
  const [Pincode, setPincode] = useState("");
  const [Assign, setAssign] = useState("");
  const [Priority, setPriority] = useState("");
  const [Status, setStatus] = useState("");
  const [getTeamData, setTeamData] = useState([]);
  const [Note, setNote] = useState("");
  const [CustomerType, setCustomerType] = useState("");
  const [FirmName, setFirmName] = useState("");

  const [CustomerPriorityList, setCustomerPriorityList] = useState([]);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    fetchTeam();
    fetchCustomerPriority();
  }, []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      CreateCustomers();
    } else {
      CreateCustomers();
    }
    setValidated(true);
  };

  const CreateCustomers = async () => {
    try {
      var a = Assign.toString().trim();
      var teamid = a.split(" ")[1];
      var userid = a.split(" ")[0];
      if (userid == UserData.id) {
        teamid = 0;
      }
      var body = {
        name: Firstname + " " + LastName,
        firstname: Firstname,
        lastname: LastName,
        email: EmailAddress,
        mobile: Mobile,
        company_id: getCompanyId,
        created_at: Created_At,
        address: Address,
        pincode: Pincode,
        user: userid,
        priority: Priority ? Priority : "Warm",
        status: "Planned",
        note: Note,
        createdBy: UserData.id,
        team_id: teamid,
      };
      const result = await postDataAxios("customers/add", body);
      // console.log("rresult submited", result);
      if (result.status == true) {
        swal({
          title: `${result.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setFirstName("");
          setLastName("");
          setEmailAddress("");
          setAddress("");
          setMobile("");
          setPincode("");
          setAssign("");
          setPriority("");
          setStatus("");
          setNote("");
          setCustomerType("");
          setFirmName("");
          handleBack(5);
        });
      } else {
        swal({
          title: "Something went wrong",
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const managerUserCustomer = () => {
    return getTeamData.map(function (item) {
      var t = [];
      var t1 = [];
      var t2 = [];
      try {
        t = item.UserName.split(",");
        t1 = item.UserId.split(",");
        t2 = item.id;
      } catch (e) {
        t = [];
      }
      return (
        <optgroup label={`${item.team_name} / ${item.TeamHead}`}>
          {t.map((itm, index) => {
            return <option value={`${t1[index]} ${t2}`}>{itm} </option>;
          })}
        </optgroup>
      );
    });
  };

  const fetchCustomerPriority = async () => {
    try {
      const result = await getDataAxios(
        `customerpriority/display/${UserData.company_id}`
      );
      setCustomerPriorityList(result.result);
    } catch (error) {
      console.log("error in catch", error);
    }
  };
  const fillPriority = () => {
    return CustomerPriorityList.map(function (item) {
      return (
        <option value={item.customer_priority} key={item.customer_priority}>
          {item.customer_priority}
        </option>
      );
    });
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
                <div class="card-body ">
                  <b>Add Customer</b>
                  <div class="row mt-3">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom01"
                        >
                          <Form.Label>First name</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Enter first name"
                            value={Firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            // pattern="^[a-z A-Z]+$"
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter valid first name
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom02"
                        >
                          <Form.Label>Last name</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            value={LastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name"
                            // pattern="^[a-z A-Z]+$"
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter valid last name
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
                            value={Mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Enter mobile number"
                            pattern="[6-9]{1}[0-9]{9}"
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
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            value={EmailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            placeholder="Enter email"
                            pattern="[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
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
                          controlId="validationCustom04"
                        >
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            value={Address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Address"
                            // pattern="[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter valid address
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Pincode</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            value={Pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="Pincode"
                            pattern="^[1-9][0-9]{5}$"
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter valid pincode
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Priority</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => setPriority(e.target.value)}
                            placeholder="Priority"
                            value={Priority}
                            required
                          >
                            <option selected value="">
                              --Select Priority--
                            </option>
                            {fillPriority()}
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Select relevant priority
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
                            onChange={(e) => setAssign(e.target.value)}
                            placeholder="Select Priority"
                            required
                          >
                            <option selected value="">
                              --Assign User--
                            </option>
                            {managerUserCustomer()}
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Kindly assign to any user
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom01"
                        >
                          <Form.Label>Note</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            value={Note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder=" Enter Note"
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter note if any
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

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
                            onClick={() => handleBack(5)}
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
      </div>
    </>
  );
}
