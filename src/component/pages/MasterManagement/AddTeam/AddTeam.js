import React, { useState, useEffect } from "react";
import {
  getDataAxios,
  postData,
  postDataAxios,
} from "../../../../services/FetchNodeServices";
import moment from "moment/moment";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function AddTeam(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [UsersList, setUsersList] = useState([]);
  // const [CompanyId, setCompanyId] = useState(userData.company_id);
  const [TeamName, setTeamName] = useState("");
  const [TeamHead, setTeamHead] = useState("");
  const [TeamStatus, setTeamStatus] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);

  const [compName, setCompName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userName, setUserName] = useState("");
  

  // Fetch All CompanyId//
  const fetchAllCompanyId = async () => {
    var joy = await getDataAxios("company/display_all_company");
    setCompanyList(joy.data);
  };

  const fetchAllTeam = async (cid) => {
    console.log('ciddd',cid);
    var joy = await postData("team/display_all_user_name_by_company_id",{id:cid});
    setUserList(joy.data);
  };
  useEffect(function () {
    fetchAllCompanyId();
    fetchAllTeam();
  }, []);

  // Fill Company  Name
  const fillCompanyName = () => {
    return companyList.map((item) => {
      return <option value={item.id}> {item.name}</option>;
    });
  };
  const fillUserName = () => {
    return userList.map((item) => {
      return <option value={item.id}> {item.name}</option>;
    });
  };

  // Handle Change Company //
  const handleChangeCompany = async (event) => {
    setCompName(event.target.value);
    fetchAllTeam(event.target.value);
  };
  const handleChangeUser = async (event) => {
    setUserName(event.target.value);
  };

  useEffect(() => {
    fetchUsersRoleWise();
  }, []);

  const fetchUsersRoleWise = async () => {
    try {
      let response = await getDataAxios(
        `usersR/DisplayUsersRoleWise`
      );
      if (response.status) {
        setUsersList(response.result);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const CreateTeams = async () => {
    try {
      var body = {
        team_name: TeamName,
        team_head: userName,
        team_status: TeamStatus,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        company_id: compName,
      };
      let response = await postDataAxios(`team/add`, body);
      if (response.status == true) {
        swal({
          title: `${response.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTeamName("");
          setTeamHead("");
          setTeamStatus("");
          handleCancel(7);
          // window.location.reload();
        });
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
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
      CreateTeams();
    } else {
      CreateTeams();
    }
    setValidated(true);
  };

  const fillUsers = () => {
    return UsersList.map(function (item, key) {
      return (
        <option value={item.id} key={item.id}>
          {item.name} / ({item.RoleName})
        </option>
      );
    });
  };

  const handleCancel = (option) => {
    props.handleDashComponent(option);
  };
  return (
    <>
      <div>
        <div class="content">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body" style={{ padding: "2%" }}>
                    <b>Add Team</b>
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
                            <Form.Label>Team name</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Enter team name"
                              value={TeamName}
                              onChange={(event) =>
                                setTeamName(event.target.value)
                              }
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Team name is missing!
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustom02"
                          >
                            <Form.Label> Team status</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={TeamStatus}
                              onChange={(event) =>
                                setTeamStatus(event.target.value)
                              }
                              placeholder="Select team status"
                              required
                            >
                              <option selected value="">
                                --Select team status--
                              </option>
                              <option value="working">Working</option>
                              <option value="not working">Not working</option>
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Please enter team status
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>


                        <Row className="mb-3">
                          <Form.Label>Comapny Name</Form.Label>
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
                        </Row>


                        <Row className="mb-3">
                          <Form.Group as={Col} md="6">
                            <Form.Label>Team head</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={userName}
                              onChange={handleChangeUser}
                              placeholder="Team head"
                            >
                              <option selected value="">
                                --Select Users--
                              </option>
                              {fillUserName()}
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Kindly select team head
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>

                        
                      </div>
                      <div class="col-xl-12">
                        <div class="button-list">
                          <Button
                            variant="primary"
                            type="submit"
                            style={{
                              background: "#4261F7",
                              color: "#fff",
                              borderRadius: 5,
                              height: "38px",
                            }}
                          >
                            Create
                          </Button>
                          <Button
                            variant="secondary"
                            style={{
                              background: "#C9C9CB",
                              color: "#fff",
                              borderRadius: 5,
                              height: "38px",
                              borderColor: "white",
                            }}
                            onClick={() => handleCancel(7)}
                          >
                            Cancel
                          </Button>
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
