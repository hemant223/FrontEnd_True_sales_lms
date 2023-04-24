import React, { useEffect } from "react";
import { useState } from "react";
import ManagerCustomerTable from "./ManagerCustomerComponent/ManagerCustomerTable";
import moment from "moment";
import ManagerCustomerGraph from "./ManagerCustomerComponent/ManagerCustomerGraph";
import ManagerViewUser from "../ManagerViewUser/ManagerViewUser";
import EditManagerCustomer from "../EditManagerCustomer/EditManagerCustomer";

export default function ManagerCustomerDetails(props) {
  // console.log("ggeetin all data particular customers", props);
  const [ManagerCustomerInfo, setManagerCustomerInfo] = useState(
    props.customerDetail
  );
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  var detail = {
    id: ManagerCustomerInfo.id,
    company: ManagerCustomerInfo.company_id,
    name: props.customerDetail.name,
  };

  useEffect(() => {
    try {
      setStartdate(
        moment(props.customerDetail.created_at).format("YYYY-MM-DD")
      );
      setEnddate(moment().format("YYYY-MM-DD"));
    } catch (e) {
      console.log("eeeee in Manager customer details", e);
    }
  }, [props]);

  const handleFilter = async (status) => {
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const currentOfMonth = moment().format("YYYY-MM-DD");

    const startDateofLastMonth = moment()
      .subtract(1, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDateofLastMonth = moment()
      .subtract(1, "months")
      .endOf("month")
      .format("YYYY-MM-DD");

    const startDateofLast3Months = moment()
      .subtract(3, "months")
      .format("YYYY-MM-DD");
    const endDateofLast3Months = moment().format("YYYY-MM-DD");

    const CustomerJoinDate = moment(props.customerDetail.created_at).format(
      "YYYY-MM-DD"
    );
    const CustomerCurrentDate = moment().format("YYYY-MM-DD");

    if (status == 1) {
      setStartdate(startOfMonth);
      setEnddate(currentOfMonth);
    } else if (status == 2) {
      setStartdate(startDateofLastMonth);
      setEnddate(endDateofLastMonth);
    } else if (status == 3) {
      setStartdate(startDateofLast3Months);
      setEnddate(endDateofLast3Months);
    } else if (status == 4) {
      setStartdate(CustomerJoinDate);
      setEnddate(CustomerCurrentDate);
    }
  };

  const handleEditCustomer = (item) => {
    props.handleDashComponent(
      "",
      <EditManagerCustomer customerDetail={item} {...props} />
    );
  };

  const handleBack = () => {
    props.userInfo == undefined
      ? props.handleDashComponent(5)
      : props.handleDashComponent("", <ManagerViewUser {...props} />);
  };

  return (
    <>
      <div class="container-fluid">
        <div className="card">
          <div className="card-body">
            <div class="row">
              <div class="col-12">
                <div class="grid-structure">
                  <div class="row">
                    <div class="col-10 col-md-10">
                      <div class="row">
                        <div class="col-6 col-md-3">
                          <div class="grid-cont1ainer">
                            <div class="row">
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 12, margin: 0 }}
                              >
                                First name
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {ManagerCustomerInfo.firstname}
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
                                Last name
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {ManagerCustomerInfo.lastname}
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
                                {ManagerCustomerInfo.mobile}
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
                                {ManagerCustomerInfo.email}
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
                                Reference
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {ManagerCustomerInfo.Refrence == undefined
                                  ? ManagerCustomerInfo.refrence_from
                                  : ManagerCustomerInfo.Refrence}
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
                                Assigned to
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {props.userInfo == undefined
                                  ? ManagerCustomerInfo.UserName
                                  : props.userInfo.name}
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
                                Priority
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {ManagerCustomerInfo.priority}
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
                                Status
                              </label>
                              <label
                                for="simpleinput"
                                class="form-label"
                                style={{ fontSize: 14, color: "#353A40" }}
                              >
                                {ManagerCustomerInfo.status}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-2 col-md-2">
                      <div class="col-12 col-md-12">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            flexDirection: "column",
                          }}
                        >
                          <button
                            type="button"
                            class="btn btn-success btn-xs"
                            style={{
                              borderRadius: 5,
                            }}
                            onClick={() =>
                              handleEditCustomer(ManagerCustomerInfo)
                            }
                          >
                            <i class="mdi mdi-pencil"></i>
                            Edit Customer
                          </button>

                          <button
                            type="button"
                            class="btn btn-success btn-xs"
                            style={{
                              borderRadius: 5,
                              marginTop: 35,
                              textAlign: "center",
                            }}
                            onClick={() => handleBack()}
                          >
                            <i class="m-r-10 mdi mdi-arrow-left-bold"></i>
                            Go Back
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div class="grid-structure">
                <div
                  class="row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div class="col-6 col-md-9 form-label">
                    <div class="grid-cont1ainer">
                      <h5 class="mt-0">Interaction Timeline</h5>
                    </div>
                  </div>
                  <div
                    class="col-6 col-md-3"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div class="grid-cont1ainer">
                      <div class="row ">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="dropdown float-end">
                            <a
                              href="#"
                              className="dropdown-toggle arrow-none card-drop"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                style={{
                                  borderRadius: 5,
                                }}
                              >
                                <i class="mdi mdi-filter"></i> Filter
                              </button>
                            </a>
                            <div
                              className="dropdown-menu dropdown-menu-end"
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                href="javascript:void(0);"
                                className="dropdown-item"
                                onClick={() => handleFilter(1)}
                              >
                                Current month
                              </div>
                              {/* item*/}
                              <div
                                href="javascript:void(0);"
                                className="dropdown-item"
                                onClick={() => handleFilter(2)}
                              >
                                Last month
                              </div>
                              {/* item*/}
                              <div
                                href="javascript:void(0);"
                                className="dropdown-item"
                                onClick={() => handleFilter(3)}
                              >
                                Last 3 month
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "100%" }}>
                  <ManagerCustomerGraph
                    startdate={startdate}
                    enddate={enddate}
                    ManagerCustomerInfo={ManagerCustomerInfo}
                  />
                </div>
              </div>
              <ManagerCustomerTable
                startdate={startdate}
                enddate={enddate}
                detail={detail}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
