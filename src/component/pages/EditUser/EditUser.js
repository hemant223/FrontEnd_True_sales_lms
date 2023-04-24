import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {
  getDataAxios,
  postDataAndImage,
  ServerURL,
} from "../../../services/FetchNodeServices";
import swal from "sweetalert";
import moment from "moment";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function EditUser(props) {
  console.log("props in Edit user", props.item);
  var userData = JSON.parse(localStorage.getItem("user"));
  const [getId, setId] = useState(props.item.id);
  const [getFirstName, setFirstName] = useState(props.item.firstname);
  const [getLastName, setLastName] = useState(props.item.lastname);
  const [getImage, setImage] = useState({ fileBytes: "", fileUrl: "" });
  const [getMobile, setMobile] = useState(props.item.mobile);
  const [getEmail, setEmail] = useState(props.item.email);
  const [getRoleId, setRoleId] = useState(props.item.role_id);
  const [TeamId, setTeamId] = useState(props.item.team_id);
  const [getUpdateAt, setUpdateAt] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  const [getJoiningDate, setJoiningDate] = useState("");
  const [getStatus, setStatus] = useState(props.item.status);
  const [getCompanyId, setCompanyId] = useState(userData.company_id);
  const [getTeamData, setTeamData] = useState([]);
  const [getRoleData, setRoleData] = useState([]);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    // fetchUserDetail();
    fetchTeams();
    fetchRoles();
  }, []);

  const handleImage = (event) => {
    setImage({
      fileBytes: event.target.files[0],
      fileUrl: URL.createObjectURL(event.target.files[0]),
    });
  };

  const fetchRoles = async () => {
    try {
      let response = await getDataAxios(
        `roles/newPenalRoleDisplay/${getCompanyId}`
      );
      if (response.status) {
        setRoleData(response.result);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  /* const fetchUserDetail = async () => {
    try {
      let response = await getDataAxios(
        `usersR/display/${getId}/${getCompanyId}`
      );
      if (response.status) {
        // console.log("response in edit user", response.data[0]);
        // setData(response.data);
        setFirstName(response.data[0].firstname);
        setLastName(response.data[0].lastname);
        setImage({
          fileBytes: "",
          fileUrl: `${ServerURL}/images/${response.data[0].user_picture}`,
        });
        setMobile(response.data[0].mobile.split("+91")[1]);
        setEmail(response.data[0].email);
        setRoleId(response.data[0].role_id);
        setTeamId(response.data[0].team_id);
        setJoiningDate(response.data[0].date_of_joining);
        setStatus(response.data[0].status);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  }; */

  const updatedaetails = async () => {
    const formData = new FormData();
    formData.append("firstname", getFirstName);
    formData.append("lastname", getLastName);
    formData.append("user_picture", getImage.fileBytes);
    formData.append("mobile", getMobile);
    formData.append("email", getEmail);
    formData.append("role_id", getRoleId);
    formData.append("team_id", TeamId);
    formData.append("updated_at", getUpdateAt);
    formData.append(
      "date_of_joining",
      moment(getJoiningDate).format("YYYY-MM-DD HH:mm:ss")
    );
    formData.append("status", getStatus);
    formData.append("id", getId);
    formData.append("company_id", getCompanyId);
    const config = { headers: { "content-type": "multipart/form-data" } };
    let response = await postDataAndImage(
      `usersR/update/${getId}/${getCompanyId}`,
      formData,
      config
    );
    // console.log("gettting data ------->", response);
    if (response.status) {
      swal({
        title: `${response.message}`,
        icon: "success",
        button: "ok",
      }).then(() => {
        handleBack(3);
      });
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      updatedaetails();
    } else {
      updatedaetails();
    }
    setValidated(true);
  };

  const fetchTeams = async () => {
    try {
      let result = await getDataAxios(`team/teamsShow/${getCompanyId}`);
      if (result.status) {
        setTeamData(result.data);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fillRoles = () => {
    return getRoleData.map(function (item, key) {
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
                <div class="card-body">
                  <b>Edit User</b>
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleUpdate}
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
                      <div class="col-12 col-md-9 mb-2">
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
                              value={getLastName}
                              onChange={(event) =>
                                setLastName(event.target.value)
                              }
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
                              value={getMobile}
                              onChange={(event) =>
                                setMobile(event.target.value)
                              }
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
                              value={getEmail}
                              onChange={(event) => setEmail(event.target.value)}
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
                          md="6"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Role</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={getRoleId}
                            onChange={(event) => setRoleId(event.target.value)}
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
                            Please select the role of this user
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Team</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={TeamId}
                            onChange={(event) => setTeamId(event.target.value)}
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
                            onChange={(newValue) => {
                              setJoiningDate(newValue.target.value);
                            }}
                            value={getJoiningDate}
                          />

                          <Form.Control.Feedback>
                            Looks good!
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
                            <option value={"Active"} key="Active">
                              Active
                            </option>
                            <option value="Inactive" key="Inactive">
                              Inactive
                            </option>
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
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
                          onClick={() => handleBack(3)}
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
