import React, { useState, useEffect } from "react";
import { getDataAxios, postDataAxios } from "../../../../services/FetchNodeServices";
import moment from "moment/moment";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function AddTemplate(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [CompanyId, setCompanyId] = useState();
  const [TemplateName, setTemplateName] = useState("");
  const [TemplateDescription, setTemplateDescription] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const[company,setCompany]=useState([])

  const CreateTeams = async () => {
    try {
      var body = {
        template_name: TemplateName,
        template_description: TemplateDescription,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        company_id: CompanyId,
      };
      let response = await postDataAxios(`template/add`, body);
      if (response.status == true) {
        swal({
          title: `${response.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTemplateName("");
          setTemplateDescription("");
          handleCancel(19);
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

  const fetchAllCompany=async()=>{
    // var body={comId:cid}
     var res=await getDataAxios(
      `whatsapp/display_all_company`,
      )
      // alert(JSON.stringify(res))
    
      setCompany(res.data)
      
  }
      useEffect (function(){
        fetchAllCompany() 
  },[])

  const fillCompany = () => {

    return company.map(function (item, key) {
        // alert(JSON.stringify(item))
      return (
        <option  value={item.id}>

          {item.name}
        </option>
      );
    });
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
                    <b>Add Template</b>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <div class="row mt-3">
                      <Row className="mb-3">
                      <Form.Group as={Col} md="12" controlId="validationCustom07">
                            <Form.Label>Company ID</Form.Label>
                            <Form.Select
                             required
                              aria-label="Default select example"
                              value={CompanyId}
                              onChange={(event) => {setCompanyId(event.target.value); 
                                 
                              } }
                              placeholder="Company"
                            >
                              <option selected value=''>
                                --Select Company--
                              </option>
                              {fillCompany()}
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Kindly select Company ID
                            </Form.Control.Feedback>
                          </Form.Group>
                          </Row>
                     
                        <Row className="mb-3">
                          <Form.Group
                            as={Col}
                            md="12"
                            controlId="validationCustom01"
                          >
                            <Form.Label>Template name</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Enter template name"
                              value={TemplateName}
                              onChange={(event) =>
                                setTemplateName(event.target.value)
                              }
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Template name is missing!
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>
                        <Row className="mb-3">
                          <Form.Group
                            as={Col}
                            md="12"
                            controlId="validationCustom02"
                          >
                            <Form.Label> Template description</Form.Label>
                            <Form.Control
                              required
                              // type="text"
                              as="textarea"
                              rows={4}
                              placeholder="Enter template description"
                              value={TemplateDescription}
                              onChange={(event) =>
                                setTemplateDescription(event.target.value)
                              }
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Please enter template Description
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
                            onClick={() => handleCancel(19)}
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
