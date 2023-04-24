import React, { useEffect, useState } from "react";
import { getDataAxios } from "../../../services/FetchNodeServices";

function CompanyConfig(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [CompanyInfo, setCompanyInfo] = useState([]);
  const [CompanyId, setCompanyId] = useState(userData.company_id);

  useEffect(() => {
    getCompanyinfo();
  }, []);

  const getCompanyinfo = async () => {
    try {
      const result = await getDataAxios(`company/display/${CompanyId}`);
      setCompanyInfo(result.result[0]);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  return (
    <>
      <div class="container-fluid">
        <div className="card">
          <div className="card-body">
            <div class="row">
              <div class="col-12">
                <div class="c1ard">
                  <div class="card1-body">
                    <div class="grid-structure">
                      <div class="row">
                        <div
                          class="col-6 col-md-3 form-label"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div class="grid-cont1ainer">
                            <img src="images/logo-light.png" />
                          </div>
                        </div>
                        <div class="col-lg-9">
                          <div class="row">
                            <div class="col-6 col-md-3">
                              <div class="grid-cont1ainer">
                                <div class="row">
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 12, margin: 0 }}
                                  >
                                    Company Name
                                  </label>
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 14, color: "#353A40" }}
                                  >
                                    {CompanyInfo.name}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-md-3">
                              <div class="grid-con1tainer">
                                <div class="row">
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 12, margin: 0 }}
                                  >
                                    Contact person-Last name
                                  </label>
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 14, color: "#353A40" }}
                                  >
                                    {CompanyInfo.authorised_person_name}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-md-3">
                              <div class="grid-con1tainer">
                                <div class="row">
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 12, margin: 0 }}
                                  >
                                    Email
                                  </label>
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 14, color: "#353A40" }}
                                  >
                                    {CompanyInfo.auth_emailid}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-md-3">
                              <div class="grid-con1tainer">
                                <div class="row">
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 12, margin: 0 }}
                                  >
                                    Mobile
                                  </label>
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 14, color: "#353A40" }}
                                  >
                                    {CompanyInfo.company_phone}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-md-3">
                              <div class="grid-con1tainer">
                                <div class="row">
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 12, margin: 0 }}
                                  >
                                    Plan type
                                  </label>
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 14, color: "#353A40" }}
                                  >
                                    Plus91labs
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-md-3">
                              <div class="grid-con1tainer">
                                <div class="row">
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 12, margin: 0 }}
                                  >
                                    Plan Status
                                  </label>
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 14, color: "#353A40" }}
                                  >
                                    {CompanyInfo.licence == "Yes"
                                      ? "Active"
                                      : "No Active"}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h4 className="mt-0 header-title">TrueSales LMS contact</h4>
        <div className="card">
          <div className="card-body">
            <div class="row">
              <div class="col-12">
                <div class="c1ard">
                  <div class="card1-body">
                    <div class="grid-structure">
                      <div class="row">
                        <div class="col-lg-12">
                          <div class="row">
                            <div class="col-6 col-md-3">
                              <div class="grid-cont1ainer">
                                <div class="row">
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 12, margin: 0 }}
                                  >
                                    Contact number
                                  </label>
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 14, color: "#353A40" }}
                                  >
                                    {CompanyInfo.company_phone}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-md-3">
                              <div class="grid-co1ntainer">
                                <div class="row">
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 12, margin: 0 }}
                                  >
                                    Email
                                  </label>
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 14, color: "#353A40" }}
                                  >
                                    info@truesales.ai
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="col-6 col-md-3">
                              <div class="grid-con1tainer">
                                <div class="row">
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 12, margin: 0 }}
                                  >
                                    Website
                                  </label>
                                  <label
                                    for="simpleinput"
                                    class="form-label"
                                    style={{ fontSize: 14, color: "#353A40" }}
                                  >
                                    <a
                                      href="https://truesales.ai/"
                                      target={"_blank"}
                                    >
                                      https://truesales.ai/
                                    </a>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default CompanyConfig;
