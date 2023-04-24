import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {
  getDataAxios,
  postData,
  postDataAndImage,
} from "../../../services/FetchNodeServices";
import swal from "sweetalert";
import moment from "moment";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function AddUser(props) {


  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getImage, setImage] = useState({ fileBytes: "", fileUrl: "" });
  const [getMobile, setMobile] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getRoleId, setRoleId] = useState("");
  const [TeamId, setTeamId] = useState("");
  const [getCreatedAt, setCreatedAt] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  const [getJoiningDate, setJoiningDate] = useState(null);
  const [getStatus, setStatus] = useState("");
  const [getCountry, setCountry] = useState("");
  const [getStates, setStates] = useState("");
  const [getCity, setCity] = useState("");
  const [getCompanyId, setCompanyId] = useState('');
  const [company , setCompany] =useState([]);
  const [getTeamData, setTeamData] = useState([]);
  const [getRoleData, setRoleData] = useState([]);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [getFlag, setFlag] = useState(false);

  // alert(JSON.stringify(getRoleId))
  useEffect(() => {
    fetchTeams();
    
  }, []);

  const handleAdduser = async () => {
    try {
      // console.log("TeamId", TeamId);
      var formData = new FormData();
      formData.append("firstname", getFirstName);
      formData.append("lastname", getLastName);
      formData.append("user_picture", getImage.fileBytes);
      formData.append("mobile", getMobile);
      formData.append("email", getEmail);
      formData.append("role_id", getRoleId);
      formData.append("team_id", TeamId);
      formData.append("created_at", getCreatedAt);
      formData.append(
        "date_of_joining",
        moment(getJoiningDate).format("YYYY-MM-DD HH:mm:ss")
      );
      formData.append("status", getStatus ? getStatus : "Inactive");
      formData.append("user_state", getStates);
      formData.append("user_country", getCountry);
      formData.append("user_city", getCity);
      formData.append("company_id", getCompanyId);
      const config = { headers: { "content-type": "multipart/form-data" } };
      let response = await postDataAndImage(`usersR/add`, formData, config);
      if (response.status == true) {
        swal({
          title: `${response.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setFirstName("");
          setLastName("");
          setImage({ fileBytes: "", fileUrl: "" });
          setMobile("");
          setEmail("");
          setRoleId("");
          setTeamId("");
          setCreatedAt("");
          setJoiningDate("");
          setStatus("");
          setStates("");
          setCountry("");
          setCity("");
          handleClose(3);
        });
      } else {
        swal({
          title: `${response.message}`,
          icon: "error",
          button: "ok",
        }).then(() => {
          setFirstName("");
          setLastName("");
          setImage({ fileBytes: "", fileUrl: "" });
          setMobile("");
          setEmail("");
          setRoleId("");
          setTeamId("");
          setCreatedAt("");
          setJoiningDate("");
          setStatus("");
          setStates("");
          setCountry("");
          setCity("");
          handleClose(3);
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
      handleAdduser();
    } else {
      handleAdduser();
    }
    setValidated(true);
  };

  // const fetchRoles = async () => {
  //   try {
  //     let response = await getDataAxios(
  //       `roles/newPenalRoleDisplay/${getCompanyId}`
  //     );
  //     // alert(JSON.stringify(response))
  //     if (response.status) {
  //       setRoleData(response.result);
  //     }
  //   } catch (error) {
  //     console.log("error in catch", error);
  //   }
  // };

  useEffect(() => {
    fetchAllRoles();
    
  }, []);
  
  
  
  



  const fetchAllCompany=async()=>{
    // var body={comId:cid}
     var res=await getDataAxios(
      `whatsapp/display_all_company`,
      )
      // alert(JSON.stringify(res))
    
      setCompany(res.data)
      
  }
      useEffect (function(){
        fetchAllCompany() 
  },[])

  const fetchTeams = async (value) => {
    try {
      let result = await getDataAxios(`team/teamsShow/${getCompanyId}`);
      if (result.status) {
        setTeamData(result.data);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };
  const handleImage = (event) => {
    setImage({
      fileBytes: event.target.files[0],
      fileUrl: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleSelectRole = (event) => {
    setFlag(false);
    // alert(JSON.stringify(event))
    setRoleId(event.target.value);
    fetchTeams(event.target.value);
    getRoleData.map((item) => {
      if (item.name == "Manager" && item.id == event.target.value) {
        setFlag(true);
        setTeamId("0");
      }
    });
  };
  
  const fillRoles = () => {
    return getRoleData.map(function (item, key) {
      //  alert(JSON.stringify(getRoleData))
      return (
        <option value={item.id} key={item.id}>
          {item.name}
        </option>
      );
    });
  };


  const fillTeams = () => {
    return getTeamData.map(function (item, key) {
      return (
        <option key={item.id} value={item.id}>
          {item.team_name}
        </option>
      );
    });
  };

        const fillCompany = () => {
          
          return company.map(function (item, key) {
              // alert(JSON.stringify(item))
            return (
              <option  value={item.id}>
      
                {item.name}
              </option>
            );
          });
        };
        
        
        const fetchAllRoles = async (cid) => {
          var body = { comId: cid }
          var res = await postData(
            `rolesclaims/display_all_roles`,body
          )
      
          setRoleData(res.data)
      
        }


  const handleClose = (option) => {
    props.handleDashComponent(option);
  };

  return (
    <>
      <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <b>Add User</b>
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <div class="row mt-3">
                      <div class="col-12 col-md-3">
                        <div
                          class="card border border-default"
                          style={{ marginBottom: 10 }}
                        >
                          <div class="text-center">
                            <div className="dropdown float-end">
                              <IconButton
                                style={{ background: "#fff" }}
                                className="text-mute"
                                aria-label="upload picture"
                                component="label"
                              >
                                <input
                                  style={{ display: "none" }}
                                  type="file"
                                  accept="image/*"
                                  id="contained-button-filepic"
                                  class="form-control mb-2"
                                  onChange={(event) => handleImage(event)}
                                />
                                <EditIcon />
                              </IconButton>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={
                                  getImage.fileUrl == ""
                                    ? "images/profile.png"
                                    : getImage.fileUrl
                                }
                                className="rounded-circle avatar-xl mt-2 img-thumbnail mb-2"
                                alt="profile-image"
                              />
                              <p className="text-muted font-13 mb-2 form-label">
                                Profile Picture
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="col-12 col-md-9">
                        <Row className="mb-3 row">
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustom01"
                          >
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="First name"
                              value={getFirstName}
                              onChange={(event) =>
                                setFirstName(event.target.value)
                              }
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
                              placeholder="Last name"
                              onChange={(event) =>
                                setLastName(event.target.value)
                              }
                              value={getLastName}
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
                              placeholder="Mobile number"
                              onChange={(event) =>
                                setMobile(event.target.value)
                              }
                              value={getMobile}
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
                            controlId="validationCustom03"
                          >
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Email"
                              onChange={(event) => setEmail(event.target.value)}
                              value={getEmail}
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
                      </div>
                      <Row className="mb-3">
                      <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Company</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={getCompanyId}
                            onChange={(event) => {setCompanyId(event.target.value);
                              fetchAllRoles(event.target.value);

                            }}
                            // onChange={(event) => handleSelectRole(event)}
                            required
                          >
                            <option selected value="">
                              --Select Company--
                            </option>
                            {fillCompany()}
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter valid email
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Role</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={getRoleId}
                            // onChange={(event) => setRoleId(event.target.value)}
                            onChange={(event) => handleSelectRole(event)}
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
                            Enter valid email
                          </Form.Control.Feedback>
                        </Form.Group>
                        {getFlag == true ? (
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="validationCustom04"
                          >
                            <Form.Label>Team</Form.Label>
                            <Form.Select
                              disabled
                              aria-label="Default select example"
                              value="0"
                              onChange={(event) => setTeamId(0)}
                            >
                              <option disabled value="">
                                -- Select Team --
                              </option>
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Enter valid email
                            </Form.Control.Feedback>
                          </Form.Group>
                        ) : (
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="validationCustom04"
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
                              Enter valid email
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}
                      </Row>

                      <Row className="mb-3">
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

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom06"
                        >
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={getStatus}
                            onChange={(event) => setStatus(event.target.value)}
                            required
                          >
                            <option selected value="">
                              --Select Status--
                            </option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            kindly select a status
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
                          onClick={() => handleClose(3)}
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
