import React, { useEffect, useState } from "react";
import { postDataAxios, postData, getDataAxios } from "../../../services/FetchNodeServices";
import moment from "moment/moment";
import swal from "sweetalert";
// import Button from "react-bootstrap/Button";
import { Button } from "@mui/material";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function AddRoleClaims(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [CompanyId, setCompanyId] = useState();
  const [roleId, setRoleId] = useState();
  const [roles, setRoles] = useState([]);
  const [claimId, setClaimId] = useState();

  const [company, setCompany] = useState([])
  const [claim, setClaim] = useState([])
  //   const [Created_At, setCreated_At] = useState("");


  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);


  const handleValidate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      handleSubmit();
    } else {
      handleSubmit();
    }
    setValidated(true);
  };
  //   const handleSubmit = async () => {
  // event.preventDefault();
  // const form = event.currentTarget;
  // if (form.checkValidity() === false) {
  //   event.stopPropagation();
  //   setcheckvalidate(true);
  // } else if (!checkvalidate) {
  //   CreateTaskType();
  // } else {
  //   CreateTaskType();
  // }
  // setValidated(true);
  // try {
  //     var body = {
  //       roleId: 'eee',
  //       claimId: 'hhh',
  //       createdAt: 'CompanyId',
  //       updated_at: 'aa',
  //       company_id: 'aa',
  //     };
  //     let response = await postData(`rolesclaims/add_new_rolesclaims_data`, body);
  //     alert(JSON.stringify(response))
  //     if (response.status) {
  //       swal({
  //         title: `Add task type successfully`,
  //         icon: "success",
  //         button: "ok",
  //       }).then(() => {
  //         setRoleId("");
  //         handleCancel(8);
  //         // window.location.reload();
  //       });
  //     } else {
  //       swal({
  //         title: "Something went wrong.",
  //         icon: "error",
  //         button: "ok",
  //       });
  //     }
  //   } catch (error) {
  //     console.log("error in catch", error);
  //   }


  //   };

  const handleSubmit = async () => {
     try {
      var err=false
      if(!err){
    var body = {
      roleId: roleId,
      claimId: claimId,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      //   updated_at:moment().format("YYYY-MM-DD HH:mm:ss"),
      companyId: CompanyId,
    };
    let response = await postDataAxios(`rolesclaims/add_new_rolesclaims_data`, body);
    //   alert(response.status)
    if (response.status==true) {
      swal({
        title: `RoleClaims Added Successfully`,
        icon: "success",
        button: "ok",
      })
      handleCancel(90.1)
    } else {
      swal({
        title: "Something went wrong.",
        icon: "error",
        button: "ok",
      });
    }
  }
}catch(error){
      console.log('error in catch',error)
    }
   

  };
  const fetchAllRoles = async (cid) => {
    var body = { comId: cid }
    var res = await postData(
      `rolesclaims/display_all_roles`, body
    )

    setRoles(res.data)

  }
  useEffect(function () {
    fetchAllRoles()
  }, [])

  const fetchAllCompany = async () => {
    var res = await getDataAxios(
      `company/display_all_company`
    )

    setCompany(res.data)

  }
  useEffect(function () {
    fetchAllCompany()
  }, [])

  const fetchAllClaim = async (cid) => {

    var res = await postData(
      `rolesclaims/display_all_claims`, { id: cid }
    )

    setClaim(res.data)

  }
  useEffect(function () {
    fetchAllClaim()
  }, [])


  const fillRoles = () => {
    return roles.map(function (item, key) {
      // alert(JSON.stringify(item))
      return (
        <option value={item.id}>
          {item.name}
        </option>
      );
    });
  };

  const fillCompany = () => {

    return company.map(function (item, key) {
      // alert(JSON.stringify(item))
      return (
        <option value={item.id}>

          {item.name}
        </option>
      );
    });
  };

  const fillClaim = () => {
    return claim.map(function (item, key) {
      // alert(JSON.stringify(item))
      return (
        <option value={item.id}>
          {item.name}
        </option>
      );
    });
  };

  //   const CreateTeams = async () => {
  //     try {
  //       var body = {
  //         team_name: TeamName,
  //         team_head: TeamHead,
  //         team_status: TeamStatus,
  //         created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  //         company_id: CompanyId,
  //       };
  //       let response = await postDataAxios(`team/add`, body);
  //       if (response.status == true) {
  //         swal({
  //           title: `${response.message}`,
  //           icon: "success",
  //           button: "ok",
  //         }).then(() => {
  //           setTeamName("");
  //           setTeamHead("");
  //           setTeamStatus("");
  //           handleCancel(7);
  //           // window.location.reload();
  //         });
  //       } else {
  //         swal({
  //           title: `Something went wrong.`,
  //           icon: "error",
  //           button: "ok",
  //         });
  //       }
  //     } catch (error) {
  //       console.log("error in catch", error);
  //     }
  //   };



  //   const CreateTaskType = async () => {
  //     try {
  //       var body = {
  //         roleId: 'eee',
  //         claimId: 'hhh',
  //         createdAt: 'CompanyId',
  //         updated_at: 'aa',
  //         company_id: 'aa',
  //       };
  //       let response = await postDataAxios(`rolesclaims/add_new_rolesclaims_data`, body);
  //     //   alert(JSON.stringify(response))
  //       if (response.status) {
  //         swal({
  //           title: `Add task type successfully`,
  //           icon: "success",
  //           button: "ok",
  //         }).then(() => {
  //           setRoleId("");
  //           handleCancel(8);
  //           // window.location.reload();
  //         });
  //       } else {
  //         swal({
  //           title: "Something went wrong.",
  //           icon: "error",
  //           button: "ok",
  //         });
  //       }
  //     } catch (error) {
  //       console.log("error in catch", error);
  //     }
  //   };


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
                    <b>Add RolesClaims</b>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleValidate}
                    >
                      <div class="row mt-3">
                        {/* <Row className="mb-3">
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustom01"
                          >
                            <Form.Label>Role ID</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Task type"
                              value={roleId}
                              onChange={(event) =>
                                setRoleId(event.target.value)
                              }
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                             Role ID is missing
                            </Form.Control.Feedback>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Task type"
                              value={claimId}
                              onChange={(event) =>
                                setClaimId(event.target.value)
                              }
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                            Claim ID is missing
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row> */}

                        {/* <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                         
                        >
                          <Form.Label>Role ID</Form.Label>
                          <Form.Control
                            required
                            aria-label="Default select example"      
                            value={roleId}
                            onChange={(event) => setRoleId(event.target.value)}
                            placeholder="Role ID"       
                          />
                          <option selected value="">
                                --Select Users--
                              </option>
                              {fillRoles()}
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Role ID
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Claim ID</Form.Label>
                          <Form.Control
                            type="text"
                            value={claimId}
                            onChange={(e) => setClaimId(e.target.value)}
                            placeholder="Claim ID "
                            required
                            
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Claim ID
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row> */}


                        <Row className="mb-3">
                          {/* <Form.Group as={Col} md="6"  controlId="validationCustom01">
                            <Form.Label>Company ID</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={CompanyId}
                              onChange={(event) => {setCompanyId(event.target.value); 
                                fetchAllRoles(event.target.value); fetchAllClaim(event.target.value)} }
                              placeholder="Company ID"
                              required
                            >
                              <option selected>
                                --Select Company--
                              </option>
                              {fillCompany()}
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Kindly select team head
                            </Form.Control.Feedback>
                          </Form.Group> */}
                           <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom07"
                        >
                          <Form.Label>Company ID</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={CompanyId}
                            onChange={(event) => {setCompanyId(event.target.value); 
                              fetchAllRoles(event.target.value); fetchAllClaim(event.target.value)} }

                            placeholder="select Company"
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
                            Select Company
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
                          <Form.Group as={Col} md="6" controlId="validationCustom07">
                            <Form.Label>Claim ID</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={claimId}
                              onChange={(event) =>
                                setClaimId(event.target.value)
                              }
                              placeholder="Claim ID"
                              required
                            >
                               <option selected value="">
                                --Select Claim--
                              </option>
                              {fillClaim()}
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Select Claim
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>


                      </div>
                      <div class="col-xl-6">
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
                              marginLeft: 10,
                              color: "#fff",
                              borderRadius: 5,
                              height: "38px",
                              borderColor: "white",
                            }}
                            onClick={() => handleCancel(90.1)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Form>
                    {/* <div>
<Button  onClick={handleSubmit}  fullWidth variant="contained"> Submit</Button>
</div> */}


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
