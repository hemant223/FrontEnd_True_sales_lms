import { event } from "jquery";
import moment from "moment";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { Row } from "react-bootstrap";
import { checkRequire } from "../../../services/Checks";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import Form from "react-bootstrap/Form";
export default function AddRole(props) {
  const userData = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState("");

  const [updated, setUpdated] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [getCompanyError, setCompanyError] = useState("");
  const [nameErr, setNameErr] = useState("");
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

  const handleSubmit = async (e) => {
    var err = false;
    if (!checkRequire(compName&&name)) {
      err = true;
      // setCompanyId("Company name is missing");
      setCompanyError("Company Name is Mising");
      setNameErr(" Name is Mising");
      setCompanyName("");
      
    }
    if (checkRequire(compName&&name)) {
      var a = (
        <p style={{ color: "#10c469", marginTop: "5px", fontSize: ".75rem" }}>
          Looks good!
        </p>
      );
      setCompanyError(a);
      setNameErr(a);
    }

    if (!err) {
      let body = {
        company_id: compName,
        name: name,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: updated,
      };
      let response = await postDataAxios(`priority/add_priority`, body);
      // alert(JSON.stringify(response));
      if (response.result == true) {
        swal({
          title: "Submit Data in Priority.",
          icon: "success",
          button: "ok",
        });
        handleBack(70.1)
      } else {
        swal({
          title: "Error occurred in Company.",
          icon: "error",
          button: "ok",
        });
      }
    }
  };

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
                  <b>Add Priority</b>
                  <hr />
                  <form>
                    <div class="row">
                      <div class="col-6 mb-2">
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

                        <span style={{ color: "#ff5b5b", fontSize: ".75rem" }}>
                          {getCompanyError}
                        </span>
                      </div>
                      <div class="col-6 mb-2">
                        <label for="simpleinput" class="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          id="simpleinput"
                          class="form-control"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                        />
                        <span style={{ color: "#ff5b5b", fontSize: ".75rem" }}>
                          {nameErr}
                        </span>
                      </div>

                      <div class="w-100"></div>
                    </div>
                  </form>

                  <div class="col-xl-6 mt-3">
                    <div class="button-list">
                      <button
                        onClick={() => handleSubmit()}
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
                        onClick={() => handleBack(70.1)}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
