import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TopbarFilter(props) {
  // console.log("props in topbar filter", props);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const [getOpen, setOpen] = useState(false);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [getToDate, setToDate] = useState("");
  const [getFromDate, setFromDate] = useState("");

  const selectDateFunc = (str) => {
    if (str == "Today") {
      dispatch({
        type: "ADD_CART",
        payload: [
          {
            str: str,
            startDate: moment().format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
          },
        ],
      });
      setRefresh(!refresh);
    } else if (str == "last 7 Days") {
      dispatch({
        type: "ADD_CART",
        payload: [
          {
            str: str,
            startDate: moment()
              .subtract(7, "days")
              .startOf("days")
              .format("YYYY-MM-DD"),
            endDate: moment()
              .subtract(1, "days")
              .endOf("days")
              .format("YYYY-MM-DD"),
          },
        ],
      });
      setRefresh(!refresh);
    } else if (str == "Last 30 Days") {
      dispatch({
        type: "ADD_CART",
        payload: [
          {
            str: str,
            startDate: moment()
              .subtract(30, "days")
              .startOf("days")
              .format("YYYY-MM-DD"),
            endDate: moment()
              .subtract(1, "days")
              .endOf("days")
              .format("YYYY-MM-DD"),
          },
        ],
      });
      setRefresh(!refresh);
    } else if (str == "Date Range") {
      setOpen(false);
      dispatch({
        type: "ADD_CART",
        payload: [
          {
            str: str,
            startDate: moment(getFromDate).format("YYYY-MM-DD"),
            endDate: moment(getToDate).format("YYYY-MM-DD"),
          },
        ],
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setcheckvalidate(false);
    setValidated(false);
    setToDate("");
    setFromDate("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      selectDateFunc("Date Range");
    } else {
      selectDateFunc("Date Range");
    }
    setValidated(true);
  };

  const showCalendar = () => {
    return (
      <>
        <div>
          <Dialog
            open={getOpen}
            TransitionComponent={Transition}
            keepMounted
            // onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <div class="content">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-12">
                    <div class="card">
                      <div class="card-body" style={{ padding: "2%" }}>
                        <b>Date Range</b>
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleSubmit}
                        >
                          <div class="row mt-3">
                            <div class="col mb-2">
                              <Row className="mb-1">
                                <Form.Group
                                  as={Col}
                                  md="6"
                                  controlId="validationCustom05"
                                >
                                  <Form.Label>From</Form.Label>
                                  <Form.Control
                                    required
                                    type="date"
                                    class="form-control"
                                    value={getFromDate}
                                    onChange={(newValue) => {
                                      setFromDate(newValue.target.value);
                                    }}
                                  />
                                  <Form.Control.Feedback>
                                    Looks good!
                                  </Form.Control.Feedback>
                                  <Form.Control.Feedback type="invalid">
                                    Please pick a valid from date
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="6"
                                  controlId="validationCustom05"
                                >
                                  <Form.Label>To</Form.Label>
                                  <Form.Control
                                    required
                                    type="date"
                                    class="form-control"
                                    value={getToDate}
                                    onChange={(newValue) => {
                                      setToDate(newValue.target.value);
                                    }}
                                  />
                                  <Form.Control.Feedback>
                                    Looks good!
                                  </Form.Control.Feedback>
                                  <Form.Control.Feedback type="invalid">
                                    Please pick a valid to date
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Row>
                            </div>
                          </div>

                          <div class="col-xl-12">
                            <div class="button-list mt-2">
                              <Button
                                variant="primary"
                                type="submit"
                                style={{
                                  background: "#4261F7",
                                  color: "#fff",
                                  height: "30px",
                                }}
                              >
                                Submit
                              </Button>
                              <Button
                                variant="secondary"
                                style={{
                                  background: "#C9C9CB",
                                  color: "#fff",
                                  height: "30px",
                                  borderColor: "white",
                                  marginLeft: 12,
                                }}
                                onClick={handleClose}
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
          </Dialog>
        </div>
      </>
    );
  };

  return (
    <>
      {showCalendar()}
      <li
        className="d-none d-lg-block"
        style={{ marginTop: "20px", marginRight: " 15px" }}
      >
        <div className="button-list ">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill waves-effect "
            onClick={() => selectDateFunc("Today")}
          >
            Today
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill waves-effect"
            onClick={() => selectDateFunc("last 7 Days")}
          >
            last 7 Days
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill waves-effect"
            onClick={() => selectDateFunc("Last 30 Days")}
          >
            Last 30 Days
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill waves-effect"
            onClick={() => setOpen(true)}
          >
            Date Range
          </button>
        </div>
      </li>
    </>
  );
}
