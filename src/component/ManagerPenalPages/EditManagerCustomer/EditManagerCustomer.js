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

export default function EditManagerCustomer(props) {
  // console.log("proooopppsss------> in manager edit customer", props);
  var UserData = JSON.parse(localStorage.getItem("user"));
  const [Firstname, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [EmailAddress, setEmailAddress] = useState("");
  const [Mobile, setMobile] = useState("");
  const [getCompanyId, setCompanyId] = useState(UserData.company_id);
  const [Created_At, setCreated_At] = useState("");
  const [Updated_At, setUpdated_At] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  const [getAssignName, setAssignName] = useState(
    props.customerDetail.UserName
  );
  const [Address, setAddress] = useState("");
  const [Pincode, setPincode] = useState("");
  const [Assign, setAssign] = useState("");
  const [Priority, setPriority] = useState("");
  const [Status, setStatus] = useState("");
  const [getTeamData, setTeamData] = useState([]);
  const [Note, setNote] = useState("");
  const [TeamId, setTeamId] = useState("");
  const [UserName, setUserName] = useState("");

  const [CustomerPriorityList, setCustomerPriorityList] = useState([]);
  const [CustomerID, setCustomerId] = useState(props.customerDetail.id);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    fetchTeam();
    FetchSingleCustomer();
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

  const updatecustomer = async () => {
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
        updated_at: Updated_At,
        address: Address,
        pincode: Pincode,
        user: userid == "" || null || undefined ? `${UserName}` : userid,
        priority: Priority ? Priority : "Warm",
        status: "Planned",
        note: Note,
        team_id: teamid == undefined || null ? `${TeamId}` : teamid,
        createdBy: UserData.id,
      };
      const result = await postDataAxios(
        `customers/update/${CustomerID}`,
        body
      );
      // console.log("rresult submited", body);
      if (result.status) {
        swal({
          title: `${result.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setFirstName(" ");
          setLastName(" ");
          setEmailAddress(" ");
          setMobile(" ");
          setAddress(" ");
          setPincode(" ");
          setAssign(" ");
          setPriority(" ");
          setStatus(" ");
          setNote(" ");
          handleBack(5);
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

  const handleEdit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      updatecustomer();
    } else {
      updatecustomer();
    }
    setValidated(true);
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

  const FetchSingleCustomer = async () => {
    try {
      var r = await getDataAxios(
        `customers/customerDetail/${CustomerID}/${getCompanyId}`
      );
      // console.log("geetinfprmation", r.data);
      setFirstName(r.data[0].firstname);
      setLastName(r.data[0].lastname);
      setMobile(r.data[0].mobile.split("+91")[1]);
      setEmailAddress(r.data[0].email);
      setAddress(r.data[0].address);
      setPincode(r.data[0].pincode);
      setPriority(r.data[0].priority);
      setAssign(`${r.data[0].user}`);
      setNote(r.data[0].note);
      setStatus(r.data[0].status);
      setCreated_At(r.data[0].created_at);
      setTeamId(r.data[0].team_id);
      setUserName(r.data[0].user);
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
                  <b>Edit Customer</b>
                  <Form noValidate validated={validated} onSubmit={handleEdit}>
                    <div class="row mt-3">
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
                          controlId="validationCustom05"
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
                          controlId="validationCustom06"
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
                            Enter valid Pincode
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom07"
                        >
                          <Form.Label>Priority</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={Priority}
                            onChange={(e) => setPriority(e.target.value)}
                            placeholder="select priority"
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
                          controlId="validationCustom08"
                        >
                          <Form.Label>Assign</Form.Label>
                          <Form.Select
                            aria-label="Default select example1"
                            value={Assign}
                            onChange={(e) => setAssign(e.target.value)}
                            placeholder="Select Assign"
                            required
                          >
                            <option selected value=" ">
                              {getAssignName}
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
                          controlId="validationCustom09"
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
    </>
  );
}
