import { event } from "jquery";
import moment from "moment";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { checkRequire } from "../../../services/Checks";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import { Avatar, Button } from "@mui/material";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
export default function AddCompanyData(props) {
  const [Customer, setCustomer] = useState("");
  const [getErrCustomerId, setErrCustomerId] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [Assign, setAssign] = useState("");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [licence, setlicence] = useState("");
  const [authorisedPersonName, setAuthorisedPersonName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyPicture, setCompanyPicture] = useState({
    url: "/icon.png",
    bytes: "",
  });

  const handleCompanyPicture = (event) => {
    setCompanyPicture({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  const handleBack = (option) => {
    props.handleDashComponent(option);
  };

  //   const handleSubmit = async () => {
  //     var formData = new FormData();
  //     formData.append("name", name);
  //     formData.append("address", address);
  //     formData.append("licence", licence);
  //     formData.append("authorisedPersonName", authorisedPersonName);
  //     formData.append("authorEmail", authorEmail);

  //     formData.append("createdAt", moment().format("YYYY-MM-DD HH:mm:ss"));
  //     formData.append("companyPhone", companyPhone);
  //     formData.append("companyPicture", companyPicture.bytes);
  //     var result = await postData("company/add_new_company_data", formData, true);
  //     if (result.result) {
  //       swal({
  //         title: "Company Data Added Sucessfully",
  //         icon: "success",
  //         button: "ok",
  //       });
  //     } else {
  //       swal({
  //         title: `Something went wrong.`,
  //         icon: "error",
  //         button: "ok",
  //       });
  //     }
  //   };

  const handleAddCustomer = async () => {
    try {
      var err = false;
         
      var a = Assign.toString().trim();
      var teamid = a.split(" ")[1];
      var userid = a.split(" ")[0];
      if (!err) {

        var formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("licence", licence);
        formData.append("authorisedPersonName", authorisedPersonName);
        formData.append("authorEmail", authorEmail);

        formData.append("createdAt", moment().format("YYYY-MM-DD HH:mm:ss"));
        formData.append("companyPhone", companyPhone);
        formData.append("companyPicture", companyPicture.bytes);
        var result = await postDataAxios(
          "company/add_new_company_data",
          formData,
          true
        );
        if (result.result == true) {
          swal({
            title: `Company Added SuccesFully`,
            icon: "success",
            button: "ok",
          });
          handleBack(4.2);
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
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Name
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom02"
                        >
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            placeholder="Address"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Address
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Licence</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Licence"
                            value={licence}
                            onChange={(event) => setlicence(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Licence
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom04"
                        >
                          <Form.Label>Authorised Person Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={authorisedPersonName}
                            onChange={(event) =>
                              setAuthorisedPersonName(event.target.value)
                            }
                            placeholder="Authorised Person Name"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Authorised Person Name
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom05"
                        >
                          <Form.Label>Author Email</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Author Email"
                            value={authorEmail}
                            onChange={(event) =>
                              setAuthorEmail(event.target.value)
                            }
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Author Email
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom06"
                        >
                          <Form.Label>Company Phone</Form.Label>
                          <Form.Control
                            type="text"
                            value={companyPhone}
                            onChange={(event) =>
                              setCompanyPhone(event.target.value)
                            }
                            placeholder="Company Phone"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Company Phone
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
                            onChange={handleCompanyPicture}
                            style={{ background: "#4261F7", color: "#fff" }}
                            fullWidth
                            variant="contained"
                            component="label"
                          >
                            Upload
                            <input
                              hidden
                              accept="image/*"
                              multiple
                              type="file"
                            />
                          </Button>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom08"
                        >
                          <Form.Label>Show Picture</Form.Label>
                          <Avatar
                            alt="Remy Sharp"
                            src={companyPicture.url}
                            sx={{ width: 70, height: 70 }}
                            variant="square"
                          />
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
                          onClick={() => handleBack(4.2)}
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
