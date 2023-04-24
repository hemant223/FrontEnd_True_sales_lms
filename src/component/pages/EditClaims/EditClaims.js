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
export default function EditClaims(props) {
  // console.log("Edit Role Props", props);
  const [getSlug, setSlug] = useState(props.item.slug);
  const [getClaimName, setClaimName] = useState(props.item.name);
  const [getCompanyId, setCompanyId] = useState(props.item.company_id);
  const [getClaimId, setClaimId] = useState(props.item.id);
  const [isCheck, setIsCheck] = useState([]);
  const [AllClaims, setAllClaims] = useState([]);
  const [getClaimNameErr, setClaimNameErr] = useState("");
  const [claimNameErr, setclaimNameErr] = useState("");
  const [parentid, setparentId] = useState(props.item.parent_id);
  const [validated, setValidated] = useState(false);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [companyList, setCompanyList] = useState([]);

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
      return <option value={item.id}>{item.name}</option>;
    });
  };

  const fetchCompany = async () => {
    // try {
    let response = await getDataAxios(`company/display_all_company`);
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
      handleAdd();
    } else {
      handleAdd();
    }
    setValidated(true);
  };

  const handleAdd = async (e) => {
    try {
      var err = false;
      if (!err) {
        var body = {
          name: getClaimName,
          slug: getSlug.toLowerCase(),
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          company_id: getCompanyId,
          parent_id: parentid,
          id: getClaimId,
        };
        // alert(JSON.stringify(body))
        const result = await postDataAxios(`claims/update/${getClaimId}`, body);
        // alert(result.status)
        if (result.status == true) {
          swal({
            title: `Claims Added Successfully`,
            icon: "success",
            button: "ok",
          });
          // window.location.reload()
          handleBack(80.1);
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
                  <b>Edit Claims</b>
                  <hr />
                  <Form noValidate validated={validated} onSubmit={handleEdit}>
                    <div class="row mt-3">
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom01"
                        >
                          <Form.Label>Claim name</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Enter Claim name"
                            value={getClaimName}
                            onChange={(event) =>
                              setClaimName(event.target.value)
                            }
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Claim name is missing!
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom01"
                        >
                          <Form.Label>Slug</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Enter Slug"
                            value={getSlug}
                            onChange={(event) => setSlug(event.target.value)}
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

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom02"
                        >
                          <Form.Label>Parent</Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={parentid}
                            onChange={(event) =>
                              setparentId(event.target.value)
                            }
                            placeholder="Enter Slug"
                            required
                          >
                            <option selected value="">
                              --Select Parent--
                            </option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                          </Form.Select>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Please Select Parent
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
                          onClick={() => handleBack(80.1)}
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
  );
}
