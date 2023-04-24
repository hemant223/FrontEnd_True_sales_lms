import React, { useState, useEffect } from "react";
import { postDataAxios, getDataAxios } from "../../../../services/FetchNodeServices";
import moment from "moment/moment";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function AddCustomerPriority(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [CompanyId, setCompanyId] = useState('');
  const [CustomerPriorityName, setCustomerPriorityName] = useState("");
  const [CustomerPriorityColor, setCustomerPriorityColor] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [companyList, setCompanyList] = useState([]);


  const handleAddCusPriority = async () => {
    try {
      var body = {
        customer_priority: CustomerPriorityName,
        color: CustomerPriorityColor,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        company_id: CompanyId,
      };
      let response = await postDataAxios(`customerpriority/add`, body);
      if (response.status == true) {
        swal({
          title: `${response.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setCustomerPriorityName("");
          setCustomerPriorityColor("");
          handleCancel(12);
          // window.location.reload();
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

  const fillCompany = () => {
    console.log("companyList", companyList);
    return companyList.map(function (item) {
      return (
        <option value={item.id}>
          {item.name}
        </option>
      );
    });
  };



  const fetchCompany = async () => {
    // try {
    let response = await getDataAxios(
      `company/display_all_company`
    );
    // alert(JSON.stringify(response.data))
    // if (response.status) {
    setCompanyList(response.data);
    // }
    // } catch (error) {
    // console.log("error in catch", error);
    // }
  };

  useEffect(() => {
    fetchCompany();
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      handleAddCusPriority();
    } else {
      handleAddCusPriority();
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
                    <b>Add Customer Priority</b>
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
                            <Form.Label>Customer priority name</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Enter priority name"
                              value={CustomerPriorityName}
                              onChange={(event) =>
                                setCustomerPriorityName(event.target.value)
                              }
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Please enter customer priority
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustom02"
                          >
                            <Form.Label>Customer priority color</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              value={CustomerPriorityColor}
                              onChange={(event) =>
                                setCustomerPriorityColor(event.target.value)
                              }
                              placeholder="Enter color"
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Provide relevant priority color
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustom02"
                          >
                            <Form.Label>Company</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={CompanyId}
                              onChange={(event) =>
                                setCompanyId(event.target.value)
                              }
                              placeholder="Enter Company"
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
                              Please Select Company
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
                              color: "#fff",
                              borderRadius: 5,
                              height: "38px",
                              borderColor: "white",
                            }}
                            onClick={() => handleCancel(12)}
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
