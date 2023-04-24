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
export default function AddSfIntregrationData(props) {

    const [Customer, setCustomer] = useState("");
    const [getErrCustomerId, setErrCustomerId] = useState("");
    const [checkvalidate, setcheckvalidate] = useState(false);
    const [validated, setValidated] = useState(false);
    const [Assign, setAssign] = useState("");

    
    const [tokenUrl, setTokenUrl] = useState("");
    const [mainUrl, setMainUrl] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [apiName, setApiName] = useState("");
   const [id, setId] = useState('')




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
            tokenUrl: tokenUrl,
            mainUrl: mainUrl,
            companyId: companyId,
            apiName: apiName,
          };
          var result = await postData("sf_integration/add_new_sf_integration_data", body);
        if (result.result == true) {
          swal({
            title: `Sf integration Added SuccesFully`,
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
                        <b>Add Sf Intregration</b>
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
                                <Form.Label>Token Url</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Token Url"
                                  value={tokenUrl}
                                  onChange={(event) =>
                                    setTokenUrl(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Token Url
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom02"
                              >
                                <Form.Label>Main Url</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={mainUrl}
                                  onChange={(event) =>
                                    setMainUrl(event.target.value)
                                  }
                                  placeholder="Main Url"
                                  required
                                ></Form.Control>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Main Url
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom03"
                              >
                                <Form.Label>Company Id</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="End Time"
                                  value={companyId}
                                  onChange={(event) =>
                                    setCompanyId(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Company Id
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom04"
                              >
                                <Form.Label>Api name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={apiName}
                                  onChange={(event) =>
                                    setApiName(event.target.value)
                                  }
                                  placeholder="Api name"
                                  required
                                ></Form.Control>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  In Api name
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
                          onClick={() => handleBack(4.4)}
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
