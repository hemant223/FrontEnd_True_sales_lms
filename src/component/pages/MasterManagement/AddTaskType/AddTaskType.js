import React, { useState } from "react";
import { getDataAxios, postDataAxios } from "../../../../services/FetchNodeServices";
import moment from "moment/moment";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useEffect } from "react";

export default function AddTaskType(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  // const [CompanyId, setCompanyId] = useState(userData.company_id);
  const [TaskType, setTaskType] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      CreateTaskType();
    } else {
      CreateTaskType();
    }
    setValidated(true);
  };

  const CreateTaskType = async () => {
    try {
      var body = {
        task_type: TaskType,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        company_id: compName,
      };
      let response = await postDataAxios(`tasktype/add`, body);
      if (response.status) {
        swal({
          title: `Add task type successfully`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTaskType("");
          handleCancel(8);
          // window.location.reload();
        });
      } else {
        swal({
          title: "Something went wrong.",
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
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
                    <b>Add Task type</b>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <div class="row mt-3">
                        <Row className="mb-3">
                          <Form.Group
                            as={Col}
                            md="12"
                            controlId="validationCustom01"
                          >
                            <Form.Label>Task type</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Task type"
                              value={TaskType}
                              onChange={(event) =>
                                setTaskType(event.target.value)
                              }
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Task type is missing
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
                            onClick={() => handleCancel(8)}
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
