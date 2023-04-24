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
export default function AddUserData(props) {
  const [Customer, setCustomer] = useState("");
  const [getErrCustomerId, setErrCustomerId] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [Assign, setAssign] = useState("");

  
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getMobile, setMobile] = useState("");
  const [getEmail, setEmail] = useState("");
  const [TeamId, setTeamId] = useState("");
  const [teamData, setTeamData] = useState([]);
  const [compName, setCompName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [getStatus, setStatus] = useState("");
  const [getJoiningDate, setJoiningDate] = useState(null);
  const [roleId, setRoleId] = useState();
  const [roles, setRoles] = useState([]);
  const [getImage, setImage] = useState({ url: "/icon.png",
  bytes: "", }); 
  const handleUserPicture = (event) => {
    setImage({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };
        
     
  const fetchAllCompanyId = async () => {
    var joy = await getDataAxios("company/display_all_company");
    setCompanyList(joy.data);
  };
  useEffect(function () {
    fetchAllCompanyId();
  }, []);

  // Fill Company  Name
  const fillCompanyName = () => {
    return companyList.map((item) => {
      return <option value={item.id}> {item.name}</option>;
    });
  };

  // Handle Change Company //
  const handleChangeCompany = async (event) => {
    setCompName(event.target.value);
    fetchAllRoles(event.target.value)
    fetchAllTeams(event.target.value)
  };


  const fetchAllRoles = async (cid) => {
    var body = { comId: cid }
    var res = await postData(
      `usersR/display_all_roles`, body
    )
    setRoles(res.data)
  }
  const fetchAllTeams = async (cid) => {
    var body = { id: cid }
    var res = await postData(
      `usersR/display_all_team`, body
    )
    setTeamData(res.data)
  }
  useEffect(function () {
    fetchAllRoles()
    fetchAllTeams()
  }, [])


  const fillRoles = () => {
    return roles.map(function (item, key) {
      return (
        <option value={item.id}>
          {item.name}
        </option>
      );
    });
  };
  const fillTeams = () => {
    return teamData.map(function (item, key) {
      // alert(JSON.stringify(item))
      return (
        <option value={item.id}>
          {item.team_name}  
        </option>
      );
    });
  };




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
            var formData = new FormData();
  formData.append("firstname", getFirstName);
  formData.append("lastname", getLastName);
  formData.append("user_picture", getImage.bytes);
  formData.append("mobile", getMobile);
  formData.append("email", getEmail);
  formData.append("team_id", TeamId);
  formData.append("company_id", compName);
  formData.append("status", getStatus);
  formData.append(
      "date_of_joining",
      moment(getJoiningDate).format("YYYY-MM-DD HH:mm:ss")
    );
  formData.append("role_id", roleId);
  formData.append("createdAt", moment().format("YYYY-MM-DD HH:mm:ss"));       
var result = await postData("usersR/add_new_user_data", formData, true);
        if (result.result) {
          swal({
            title: `Users Added SuccesFully`,
            icon: "success",
            button: "ok",
          })
          handleBack(90.5)

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
                  <b>Add Company</b>
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
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="First Name"
                            
                            value={getFirstName}
                            onChange={(event) => setFirstName(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter First Name
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom02"
                        >
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={getLastName}
                            onChange={(event) => setLastName(event.target.value)}
                            placeholder="Last Name"
                            required
                          
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Last Name
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
                            placeholder="Mobile Number"
                            
                            value={getMobile}
                            onChange={(event) => setMobile(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Mobile Number
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="text"
                            value={getEmail}
                            onChange={(event) =>
                              setEmail(event.target.value)
                            }
                            placeholder="Email"
                            required
                            
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Email
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>


                      <Row className="mb-3">

                      <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom05"
                        >
                          <Form.Label>Company</Form.Label>

                        <Form.Select
                            aria-label="Default select example"
                            value={compName}
                            onChange={handleChangeCompany}
                            placeholder="Select Company Name"
                            required
                          >
                            <option selected value="">
                              Select Company Name
                            </option>
                            {fillCompanyName()}
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Comapny
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom05"
                        >
                          <Form.Label>Team</Form.Label>
                          <Form.Select
                              aria-label="Default select example"
                              value={TeamId}
                              onChange={(event) =>
                                setTeamId(event.target.value)
                              }
                            >
                              <option disabled value="">
                                -- Select Team --
                              </option>
                              {fillTeams()}
                            </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Team
                          </Form.Control.Feedback>
                        </Form.Group>

                       
                      </Row>
                     
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom05"
                        >
                          <Form.Label>Status</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Status"
                            
                            value={getStatus}
                            onChange={(event) =>
                              setStatus(event.target.value)
                            }
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Status
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom05"
                        >
                          <Form.Label>Joining Date</Form.Label>
                          <Form.Control
                            required
                            type="datetime-local"
                            placeholder="Date"
                            value={getJoiningDate}
                            onChange={(event) => {
                              setJoiningDate(event.target.value);
                            }}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Please pick a valid date
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                      <Form.Group as={Col} md="6" controlId="validationCustom07">
                            <Form.Label>Role ID</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={roleId}
                              onChange={(event) =>
                                setRoleId(event.target.value)
                              }
                              placeholder="Role"
                              required
                            >
                              <option selected value="">
                                --Select Role--
                              </option>
                              {fillRoles()}
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Select Role
                            </Form.Control.Feedback>
                          </Form.Group>

                  
                      </Row>



                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom07"
                        >
                          <Form.Label>Picture</Form.Label>
                          <Button
                          onChange={handleUserPicture}
                          style={{ background: "#4261F7", color: "#fff" }}
                          fullWidth
                          variant="contained"
                          component="label"
                        >
                          Upload
                          <input hidden accept="image/*" multiple type="file" />
                        </Button>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Plesese Upload Picture
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom08"
                        >
                          <Form.Label>Show Picture</Form.Label>
                          <Avatar
                          alt="Remy Sharp"
                          src={getImage.url}
                          sx={{ width: 70, height: 70 }}
                          variant="square"
                        />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter upload Picture
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
                          onClick={() => handleBack(90.5)}
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
