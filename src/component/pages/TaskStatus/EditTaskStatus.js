import React, { useEffect, useState } from "react";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import swal from "sweetalert";
import moment from "moment";
import { checkRequire } from "../../../services/Checks";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
export default function EditTaskStatus(props) {

  

  const [taskStatus, setTaskStatus] = useState(props.item.task_status);
  const [getCompanyId, setCompanyId] = useState(props.item.company_id);
  const [taskStatusId, setTaskStatusId] = useState(props.item.taskstatus_id);
  const [isCheck, setIsCheck] = useState([]);
  const [AllClaims, setAllClaims] = useState([]);
  const [getClaimNameErr, setClaimNameErr] = useState("");
  const [claimNameErr, setclaimNameErr] = useState("");
  const [validated, setValidated] = useState(false);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [taskColor,setTaskColor]=useState(props.item.status_color)

  useEffect(() => {
    // fetchClaims();
    // fetchSelectedClaims();
    fetchCompany();
  }, []);

  // const fetchClaims = async () => {

  //     let result = await getDataAxios(`claims/display/${getCompanyId}`);
  //     // console.log("Claims -----> ", result.result);

  //       setAllClaims(result.result);


  // };
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


const handleEdit = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
  } else if (!checkvalidate) {
      handleChange();
  } else {
      handleChange();
  }
  setValidated(true);
};


  const handleChange = async (e) =>{
     try {
    var err = false;
    if (!err) {
        var body = {
            name: taskStatus,
            color: taskColor,
            company_id: getCompanyId,
            id:taskStatusId,
        };
        
        const result = await postDataAxios(`taskstatus/edit_task_status_data/${taskStatusId}`, body);
        // alert(result.status)
        if (result.status == true) {
            swal({
                title: `Task Status Updated Successfully`,
                icon: "success",
                button: "ok",
            })
            // window.location.reload()
            handleBack(80.2)

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
}

  // const handleMultiChecked = (event, cid) => {
  //   const temp = [...isCheck];
  //   if (event) {
  //     for (let i = 0; i < temp.length; i++) {
  //       if (temp[i] == cid) {
  //         temp.splice(i, 1);
  //       }
  //     }
  //   } else {
  //     temp.push(cid);
  //   }
  //   setIsCheck(temp);
  // };

  // const showClaims = () => {
  //   return AllClaims.map((item, index) => {
  //     const checked = isCheck.includes(item.id);
  //     return (
  //       <>
  //         <div
  //           class="form-check mb-2  form-check-primary"
  //           style={{ marginRight: 40, width: 150 }}
  //         >
  //           <input
  //             class="form-check-input"
  //             type="checkbox"
  //             value={item.id}
  //             id={item.id}
  //             checked={checked}
  //             onChange={(e) => handleMultiChecked(!e.target.checked, item.id)}
  //           />
  //           <label class="form-check-label" for="customckeck1">
  //             {item.slug}
  //           </label>
  //         </div>
  //       </>
  //     );
  //   });
  // };

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
                  <b>Edit Task Status</b>
                  <hr />
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleEdit}
                  >
                    <div class="row mt-3">
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom01"
                        >
                          <Form.Label>Task Status</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Enter Task Status name"
                            value={taskStatus}
                            onChange={(event) =>
                              setTaskStatus(event.target.value)
                            }
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Task Status is missing!
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom01"
                        >
                          <Form.Label>Color</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Enter Color"
                            value={taskColor}
                            onChange={(event) =>
                              setTaskColor(event.target.value)
                            }
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Slug is missing!
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
                            value={getCompanyId}
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
                          Update
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
                          onClick={() => handleBack(24)}
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





    </>
  )

}
