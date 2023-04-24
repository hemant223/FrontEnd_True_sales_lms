import React, { useState } from "react";
import { getDataAxios, postDataAxios } from "../../../../services/FetchNodeServices";
import moment from "moment/moment";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useEffect } from "react";
export default function AddBreakType(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [CompanyId, setCompanyId] = useState(userData.company_id);
  const [BreakType, setBreakType] = useState("");
  const [BreakStatus, setBreakStatus] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [compName, setCompName] = useState("");
  const [companyList, setCompanyList] = useState([]);

  // Fetch All CompanyId//
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
  };



  
  const CreateBreakType = async () => {
    try {
      var body = {
        break_type: BreakType,
        created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
        company_id: compName,
        breakstatus: BreakStatus,
      };
      let response = await postDataAxios(`breaktype/add`, body);
      if (response.status == true) {
        swal({
          title: `${response.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setBreakType("");
          handleCancel(21);
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
      CreateBreakType();
    } else {
      CreateBreakType();
    }
    setValidated(true);
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
                    <b>Add break type</b>
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
                            <Form.Label>Break type</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              value={BreakType}
                              onChange={(event) =>
                                setBreakType(event.target.value)
                              }
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
                            controlId="validationCustom01"
                          >
                            <Form.Label>Break status</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              required
                              type="text"
                              value={BreakStatus}
                              onChange={(event) =>
                                setBreakStatus(event.target.value)
                              }
                            >
                              <option selected value="">
                                --Select Status--
                              </option>
                              <option value="Enable">Enable</option>
                              <option value="Disable">Disable</option>
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              kindly select a status
                            </Form.Control.Feedback>
                          </Form.Group>


                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustom01"
                          >
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
                            onClick={() => handleCancel(21)}
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
