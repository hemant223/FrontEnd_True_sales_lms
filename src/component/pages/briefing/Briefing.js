import React, { useState, useEffect } from "react";
import {
  getDataAxios,
  postDataAndImage,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import moment from "moment/moment";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import swal from "sweetalert"; 
import Swal from "sweetalert2"; 
import Checkbox from "@mui/material/Checkbox";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import ImagePicker from "react-image-picker";
import { PaginationItem } from "@mui/material";
import "react-image-picker/dist/index.css";
import img1 from "../../../images/1icon.png";
import img2 from "../../../images/2icon.png";
import img3 from "../../../images/3icon.png";
import img4 from "../../../images/4icon.png";
import img5 from "../../../images/5icon.png";
import img6 from "../../../images/6icon.png";
import img7 from "../../../images/7icon.png";
import img8 from "../../../images/8icon.png";

const imageList = [img1, img2, img3, img4, img5, img6, img7, img8];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};
const finalArr = [];
export default function Briefing(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [entryStart, setEntryStart] = useState(0);
  const [Page, setPage] = useState(1);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [CompanyId, setCompanyId] = useState('');
  const [getBriefingData, setBriefingData] = useState([]);
  const [getTeamData, setTeamData] = useState([]);
  const [getTempTeamData, setTempTeamData] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [getOpen1, setOpen1] = useState(false);
  const [getIcon, setIcon] = useState({ fileBytes: "", fileUrl: "" });
  const [getTitle, setTitle] = useState("");
  const [getDescription, setDescription] = useState("");
  const [getPostTo, setPostTo] = useState([]);
  const [getFromDate, setFromDate] = useState("");
  const [getToDate, setToDate] = useState("");
  const [getFromDateUpdate, setFromDateUpdate] = useState("");
  const [getToDateUpdate, setToDateUpdate] = useState("");
  const [getCreatedAt, setCreatedAt] = useState("");
  const [getId, setId] = useState("");
  const [getLoading, setLoading] = useState(true);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [SaveImageUrl, setSaveImageUrl] = useState("");
  const [getImageModal, setImageModal] = useState(false);
  const [ImageModaledit, setImageModaledit] = useState("");
  const [getErrIcon, setErrIcon] = useState("");
  const [getErrPostTo, setErrPostTo] = useState("");
  const [TEXT, setTEXT] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [isCheck, setIsCheck] = useState([]);

  useEffect(() => {
    fetchBriefingData();
    fetchTeams();
    testExample();
  }, []);

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

  // const handleMultipleDelete = async () => {

  //   var body = { id: isCheck };
  //   var response = await postDataAxios("briefings/delete_all_all_briefings", body);

  //   if (response.status) {
  //     swal({
  //       title: "All Data of Team Delete Sucessfully",
  //       icon: "success",
  //       button: "ok",
  //     });
  //     window.location.reload();
  //     fetchTeams();
  //   } else {
  //     swal({
  //       title: `Something went wrong.`,
  //       icon: "error",
  //       button: "ok",
  //     });
  //   }

  // }

  const handleMultipleDelete = async () => {
    Swal.fire({
      title: "Do you want to delete this Multiple Role Details?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {
        var body = { id: isCheck };
          var response = await postDataAxios("briefings/delete_all_all_briefings", body);
  
  
        if (response.status) {
          Swal.fire("Deleted!", "", "success");
          fetchBriefingData();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
    
  };




  const handleMultiChecked = (event, cid) => {
    const { checked } = event.target;
    let id = cid;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }

  };

  useEffect(() => {
    fetchCompany();
  }, []);


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

  const fetchTeams = async () => {
    try {
      let result = await getDataAxios(`team/display`);
//  alert(JSON.stringify(result.data))
      if (result.status) {
        setTeamData(result.data);
        setTempTeamData(result.data);
      }
    } catch (error) {
      console.log("error in catch breifing", error);
    }
  };

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      if (
        (item.msg_title &&
          item.msg_title
            .toLowerCase()
            .includes(e.target.value.toLowerCase())) ||
        (item.msg_description &&
          item.msg_description
            .toLowerCase()
            .includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setBriefingData(searchArr);
  };

  const handleTeamSearch = async (e) => {
    var searchArr = [];
    getTempTeamData.map((item) => {
      if (
        item.team_name &&
        item.team_name.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        searchArr.push(item);
      }
    });
    setTeamData(searchArr);
  };

  const handleModel = () => {
    setImageModal(true);
    setOpen(false);
  };

  const handleModeledit = () => {
    setImageModaledit(true);
    setOpen1(false);
  };

  function onPick(image) {
    setSaveImageUrl(image.src);
    setIcon(image.src);
    setImageModal(false);
    setOpen(true);
  }

  function onPickedit(image) {
    setSaveImageUrl(image.src);
    setIcon(image.src);
    setImageModaledit(false);
    setOpen1(true);
  }

  const handleAddBref = async () => {
    const teamsId = Object.values(getPostTo);
    var getIcon = JSON.stringify(SaveImageUrl);
    var formData = new FormData();
    formData.append("posted_team", teamsId.toString());
    formData.append("icon", getIcon);
    formData.append("company_id", CompanyId);
    formData.append("msg_title", getTitle);
    formData.append("msg_description", getDescription);
    formData.append("created_at", moment().format("YYYY-MM-DD, HH:mm:ss"));
    formData.append("date_from", moment(getFromDate).format("YYYY/MM/DD"));
    formData.append("date_to", moment(getToDate).format("YYYY/MM/DD"));

    let config = { headers: { "content-type": "multipart/form-data" } };
    let response = await postDataAndImage(`briefings/add`, formData, config);
    if (response.status == true) {
      swal({
        title: `${response.message}`,
        icon: "success",
        button: "ok",
      }).then(() => {
        setIcon({ fileBytes: "", fileUrl: "" });
        setTitle("");
        setDescription("");
        setPostTo([]);
        setFromDate("");
        setToDate("");
        fetchTeams();
        props.handleDashComponent(13);
        handleClose();
        window.location.reload();
      });
    } else {
      swal({
        title: "Something went wrong",
        icon: "error",
        button: "ok",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if (getPostTo.length <= 0) {
        setcheckvalidate(true);
        event.stopPropagation();
        setTEXT("Please select the team");
      } else {
        var a = (
          <p style={{ color: "#10c469", marginTop: "5px" }}>Looks Good!</p>
        );
        setTEXT(a);
      }
    } else if (!checkvalidate) {
      if (getPostTo.length <= 0) {
        setcheckvalidate(true);
        event.stopPropagation();
        setTEXT("Please select the team");
      } else {
        var a = (
          <p style={{ color: "#10c469", marginTop: "5px" }}>Looks Good!</p>
        );
        setTEXT(a);
        handleAddBref();
      }
    } else {
      if (getPostTo.length <= 0) {
        setcheckvalidate(true);
        event.stopPropagation();
        setTEXT("Please select the team");
      } else {
        var a = (
          <p style={{ color: "#10c469", marginTop: "5px" }}>Looks Good!</p>
        );
        setTEXT(a);
        handleAddBref();
      }
    }
    setValidated(true);
  };

  const testExample = () => {
    var tempObj = {};
    getTeamData.filter((item) => {
      tempObj = { value: item.id, label: item.team_name };
    });
    finalArr.push(tempObj);
  };

  const showAddDialogBox = () => {
    return (
      <>
        <div>
          <Dialog
            open={open}
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
                        <b>Add Breifing</b>
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleSubmit}
                        >
                          <div class="row mt-3">
                            <Row className="mb-1">
                              <Form.Label>Select Icon</Form.Label>

                              <Button
                                variant="secondary"
                                onClick={() => handleModel()}
                                style={{
                                  background: "#C9C9CB",
                                  color: "#fff",
                                  borderRadius: 5,
                                  height: "38px",
                                  borderColor: "white",
                                  width: "34%",
                                  marginLeft: "14px",
                                  fontSize: 12,
                                }}
                              >
                                Browser Icons Library
                              </Button>

                              <Dialog
                                open={getImageModal}
                                TransitionComponent={Transition}
                                keepMounted
                                // onClose={handleClose}
                                aria-describedby="alert-dialog-slide-description"
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    margin: 8,
                                  }}
                                >
                                  <ImagePicker
                                    images={imageList.map((image, i) => ({
                                      src: image,
                                      value: i,
                                    }))}
                                    onPick={onPick}
                                  />
                                </div>
                              </Dialog>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom05"
                              >
                                <img
                                  src={getIcon}
                                  className="rounded-circle avatar-sm img-thumbnail mb-2"
                                  alt="image"
                                />
                              </Form.Group>

                              <img
                                class="col-1"
                                src={getErrIcon}
                                width={"10px"}
                                height={"10px"}
                              />
                            </Row>

                            <Row className="mb-1 column">
                              <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom02"
                              >
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter briefing title here"
                                  class="form-control"
                                  value={getTitle}
                                  onChange={(event) =>
                                    setTitle(event.target.value)
                                  }
                                  required
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter valid last name
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-1 column">
                              <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom02"
                              >
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  placeholder="Enter briefing description here"
                                  value={getDescription}
                                  onChange={(event) =>
                                    setDescription(event.target.value)
                                  }
                                  required
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Description is missing
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="12"
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

                            <div class="w-100"></div>
                            <div class="col mb-2">
                              <label for="example-select" class="form-label">
                                Post To
                              </label>
                              <img
                                src={getErrPostTo}
                                width={"10px"}
                                height={"10px"}
                              />
                              <FormControl fullWidth size="small" sx={{ m: 1 }}>
                                <Select
                                  labelId="demo-multiple-checkbox-label"
                                  id="demo-multiple-checkbox"
                                  multiple
                                  value={getPostTo}
                                  onChange={(e) => handleChangeUpdate(e)}
                                  input={<BootstrapInput />}
                                  MenuProps={MenuProps}
                                >
                                  <div class="search-box chat-search-box">
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="Search..."
                                      onChange={(e) => handleTeamSearch(e)}
                                    />
                                    <i class="mdi mdi-magnify search-icon"></i>
                                  </div>
                                  <MenuItem>
                                    -- Select where to post --
                                  </MenuItem>
                                  {getTeamData.map((item, label) => (
                                    <MenuItem key={item.id} value={item.id}>
                                      <Checkbox
                                        style={{ marginLeft: 2 }}
                                        checked={
                                          getPostTo.indexOf(item.id) > -1
                                            ? true
                                            : false
                                        }
                                      />
                                      {item.team_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <span
                                  style={{ fontSize: "0.75rem", color: "red" }}
                                >
                                  {TEXT}
                                </span>
                              </FormControl>
                            </div>
                            <div class="w-100"></div>
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

                          <div class="col-xl-12 ">
                            <div class="button-list mt-2">
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

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      if (getPostTo.length <= 0) {
        setcheckvalidate(true);
        event.stopPropagation();
        setTEXT("Please select the team");
      } else {
        var a = <p style={{ color: "#10c469" }}>Looks Good!</p>;
        setTEXT(a);
      }
    } else if (!checkvalidate) {
      if (getPostTo.length <= 0) {
        setTEXT("Please select the team");
      } else {
        var a = <p style={{ color: "#10c469" }}>Looks Good!</p>;
        setTEXT(a);
        handleEditBriefing();
      }
    } else {
      if (getPostTo.length <= 0) {
        setTEXT("Please select the team");
      } else {
        var a = <p style={{ color: "#10c469" }}>Looks Good!</p>;
        setTEXT(a);
        handleEditBriefing();
      }
    }
    setValidated(true);
  };

  const handleEditBriefing = async () => {
    var getIcon = JSON.stringify(SaveImageUrl);
    const teamsId = Object.values(getPostTo);
    var formData = new FormData();
    formData.append("company_id", CompanyId);
    formData.append("msg_title", getTitle);
    formData.append("msg_description", getDescription);
    formData.append("created_at", getCreatedAt);
    formData.append("updated_at", moment().format("YYYY-MM-DD, HH:mm:ss"));
    formData.append("icon", getIcon);
    formData.append("posted_team", teamsId.toString());
    formData.append(
      "date_from",
      moment(getFromDateUpdate).format("YYYY/MM/DD")
    );
    formData.append("date_to", moment(getToDateUpdate).format("YYYY/MM/DD"));
    formData.append("id", getId);
    let config = { headers: { "content-type": "multipart/form-data" } };
    let response = await postDataAndImage(
      `briefings/newPenalUpdate/${getId}`,
      formData,
      config
    );

    if (response.status == true) {
      swal({
        title: `${response.message}`,
        icon: "success",
        button: "ok",
      }).then(() => {
        setIcon({ fileBytes: "", fileUrl: "" });
        setTitle("");
        setDescription("");
        setPostTo([]);
        setFromDateUpdate("");
        setToDate("");
        fetchTeams();
        props.handleDashComponent(13);
        handleClose();
        window.location.reload();
        setLoading(false);
      });
    } else {
      swal({
        title: "Something went wrong",
        icon: "error",
        button: "ok",
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setIcon({ fileBytes: "", fileUrl: "" });
    setTitle("");
    setDescription("");
    setPostTo([]);
    setFromDate("");
    setToDate("");
    setSaveImageUrl("");
    setErrPostTo("");
    setErrIcon("");
    setFromDateUpdate("");
    setToDateUpdate("");
    setOpen(false);
    setOpen1(false);
    setcheckvalidate(false);
    setValidated(false);
    setTEXT("");
  };

  const fetchBriefingData = async () => {
    try {
      let response = await getDataAxios(
        `briefings/display`
      );

      if (response.status) {
        setBriefingData(response.data);
        setTempTableData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const sortTable = (n) => {
    let table,
      rows,
      switching,
      i,
      x,
      y,
      willSwitch,
      directory,
      switchCount = 0;
    table = document.getElementById("productTable");
    switching = true;
    directory = "ascending";

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        willSwitch = false;

        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        if (directory === "ascending") {
          if (n === 0) {
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
              willSwitch = true;
              break;
            }
          } else if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            willSwitch = true;
            break;
          }
        } else if (directory === "descending") {
          if (n === 0) {
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
              willSwitch = true;
              break;
            }
          } else if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            willSwitch = true;
            break;
          }
        }
      }
      if (willSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;

        switchCount++;
      } else {
        if (switchCount === 0 && directory === "ascending") {
          directory = "descending";
          switching = true;
        }
      }
    }
  };

  const showEntry = (value) => {
    setEntryEnd(
      entryStart + value > getBriefingData.length
        ? getBriefingData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getBriefingData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getBriefingData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleViewPage = (item) => {
    setOpen1(true);
    var obj = Object.values(item.posted_team);
    let ar =
      item.posted_team != undefined ||
        item.posted_team != null ||
        item.posted_team != ""
        ? item.posted_team.split(",")
        : "";
    setSaveImageUrl(item.icon);
    setIcon(item.icon);
    setTitle(item.msg_title);
    setDescription(item.msg_description);
    var result = ar.map(function (x) {
      return parseInt(x, 10);
    });
    setPostTo(result);
    setFromDateUpdate(item.date_from);
    setToDateUpdate(item.date_to);
    setCompanyId(item.company_id);
    setCreatedAt(item.created_at);
    setId(item.id);
  };

  const handleChangeUpdate = (event) => {
    const {
      target: { value },
    } = event;
    setPostTo(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const showEditDialogBox = () => {
    return (
      <>
        <div>
          <Dialog
            open={getOpen1}
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
                        <b>Edit Breifing</b>
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleEditSubmit}
                        >
                          <div class="row mt-3">
                            <Row className="mb-1">
                              <Form.Label>Select Icon</Form.Label>

                              <Button
                                variant="secondary"
                                onClick={() => handleModeledit()}
                                style={{
                                  background: "#C9C9CB",
                                  color: "#fff",
                                  borderRadius: 5,
                                  height: "38px",
                                  borderColor: "white",
                                  width: "34%",
                                  marginLeft: "14px",
                                  fontSize: 12,
                                }}
                              >
                                Browser Icons Library
                              </Button>

                              <Dialog
                                open={ImageModaledit}
                                TransitionComponent={Transition}
                                keepMounted
                                // onClose={handleClose}
                                aria-describedby="alert-dialog-slide-description"
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    margin: 8,
                                  }}
                                >
                                  <ImagePicker
                                    images={imageList.map((image, i) => ({
                                      src: image,
                                      value: i,
                                    }))}
                                    onPick={onPickedit}
                                  />
                                </div>
                              </Dialog>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom05"
                              >
                                <img
                                  src={getIcon}
                                  className="rounded-circle avatar-sm img-thumbnail mb-2"
                                  alt="image"
                                />
                              </Form.Group>

                              <img
                                class="col-1"
                                src={getErrIcon}
                                width={"10px"}
                                height={"10px"}
                              />
                            </Row>

                            <Row className="mb-1 column">
                              <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom02"
                              >
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter briefing title here"
                                  class="form-control"
                                  value={getTitle}
                                  onChange={(event) =>
                                    setTitle(event.target.value)
                                  }
                                  required
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter valid last name
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-1 column">
                              <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom02"
                              >
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  placeholder="Enter briefing description here"
                                  value={getDescription}
                                  onChange={(event) =>
                                    setDescription(event.target.value)
                                  }
                                  required
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Description is missing
                                </Form.Control.Feedback>
                              </Form.Group>


                              <Form.Group
                                as={Col}
                                md="12"
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

                            <div class="w-100"></div>
                            <div class="col mb-2">
                              <label for="example-select" class="form-label">
                                Post To
                              </label>
                              <img
                                src={getErrPostTo}
                                width={"10px"}
                                height={"10px"}
                              />
                              <FormControl fullWidth size="small" sx={{ m: 1 }}>
                                <Select
                                  labelId="demo-multiple-checkbox-label"
                                  id="demo-multiple-checkbox"
                                  multiple
                                  value={getPostTo}
                                  onChange={(e) => handleChangeUpdate(e)}
                                  input={<BootstrapInput />}
                                  MenuProps={MenuProps}
                                >
                                  <div class="search-box chat-search-box">
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="Search..."
                                      onChange={(e) => handleTeamSearch(e)}
                                    />
                                    <i class="mdi mdi-magnify search-icon"></i>
                                  </div>
                                  <MenuItem>
                                    -- Select where to post --
                                  </MenuItem>
                                  {getTeamData.map((item, label) => (
                                    <MenuItem key={item.id} value={item.id}>
                                      <Checkbox
                                        style={{ marginLeft: 2 }}
                                        checked={
                                          getPostTo.indexOf(item.id) > -1
                                            ? true
                                            : false
                                        }
                                      />
                                      {item.team_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <span
                                  style={{ fontSize: "0.75rem", color: "red" }}
                                >
                                  {TEXT}
                                </span>
                              </FormControl>
                            </div>

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
                                  value={moment(getFromDateUpdate).format(
                                    "YYYY-MM-DD"
                                  )}
                                  onChange={(newValue) => {
                                    setFromDateUpdate(newValue.target.value);
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
                                  value={moment(getToDateUpdate).format(
                                    "YYYY-MM-DD"
                                  )}
                                  onChange={(newValue) => {
                                    setToDateUpdate(newValue.target.value);
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
                          <div class="col-xl-12 ">
                            <div class="button-list mt-2">
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
                                  marginLeft: "12px",
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

  // const handleDelete = async (id) => {
  //   var body = { id: id }
  //   var result = await postDataAxios('briefings/delete_briefings_data', body)
  //   if (result.status) {

  //     swal({
  //       title: `Breifing Delete Successfully`,
  //       icon: "success",
  //       button: "ok",
  //     })
  //     fetchBriefingData();
  //   }
  //   else {
  //     swal({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: 'Something went wrong!',
  //     })
  //   }
  // };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Do you want to delete this Task Status Details?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {
         var body = { id: id }
          var result = await postDataAxios('briefings/delete_briefings_data', body)
  
        if  (result.status){
          Swal.fire("Deleted!", "", "success");
          fetchBriefingData();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };


  const showEmployee = (i) => {
    let id = "";
    let icon = "";
    let company = "";
    let title = "";
    let description = "";
    let teamname = "";
    let from = "";
    let to = "";
    let created = "";
    let updated = "";
    try {
      id = getBriefingData[i].id;
      icon =
        getBriefingData[i].icon != "null"
          ? getBriefingData[i].icon
          : "assets/images/users/user-7.jpg";
      company = getBriefingData[i].name;
      title = getBriefingData[i].msg_title;
      description = getBriefingData[i].msg_description;
      teamname = getBriefingData[i].team_names;
      from = moment(getBriefingData[i].date_from).format("DD/MM/YYYY");
      to = moment(getBriefingData[i].date_to).format("DD/MM/YYYY");
      created = getBriefingData[i].created_at;
      updated = getBriefingData[i].updated_at;

    } catch (e) {
      icon = "";
      company = "";
      title = "";
      description = "";
      teamname = "";
      from = "";
      to = "";
      created = "";
      updated = "";
    }
    return (
      <tr>
        <td>
          <input
            class="form-check-input"
            type="checkbox"
            value={getBriefingData[i].id}
            id={getBriefingData[i].id}
            checked={isCheck.includes(getBriefingData[i].id)}
            onChange={(event) => handleMultiChecked(event, getBriefingData[i].id)}
          />
        </td>
        <td>{id}</td>
        <td>
          {" "}
          <img
            src={icon}
            alt="image"
            class="img-fluid avatar-sm rounded-circle"
          />{" "}
        </td>
        <td>{company}</td>
        <td> {title} </td>
        <td style={{ width: 200 }}> {description} </td>
        <td> {teamname} </td>
        <td>
          {" "}
          {from} to {to}
        </td>
        <td>{created}</td>
        <td>{updated}</td>
        <td style={{ width: 120 }}>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ borderRadius: 0 }}
            onClick={() => handleViewPage(getBriefingData[i])}
          >
            <i class="mdi mdi-pencil"></i>
          </button>

          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ marginTop: 5, borderRadius: 0, backgroundColor: 'red', borderColor: 'red' }}
            onClick={() => handleDelete(id)}
          >
            <i class="mdi mdi-delete"></i>
          </button>

        </td>

      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < getBriefingData.length
        ? (entNumber + 1) * entriesPerPage
        : getBriefingData.length
    );
    setPage(value);
  };

  const NextFun = () => {
    return <div>Next</div>;
  };
  function BackFun() {
    return <div>Previous</div>;
  }

  const handlePaging = () => {
    let totalPages = getBriefingData.length / entriesPerPage;
    let CheckFloatnumber =
      Number(totalPages) === totalPages && totalPages % 1 !== 0;

    return (
      <Pagination
        color="primary"
        variant="outlined"
        shape="rounded"
        count={parseInt(CheckFloatnumber == true ? totalPages + 1 : totalPages)}
        page={Page}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: BackFun, next: NextFun }}
            {...item}
          />
        )}
        onChange={handlePageNumber}
      />
    );
  };

  return (
    <>
      {getLoading ? (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: "75vh",
          }}
        >
          <img src="/images/loader.gif" width="20%" />
        </div>
      ) : (
        <div class="container-fluid">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <div class="c1ard">
                    <div class="card1-body">
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
                              <h5 class="mt-0">Briefing</h5>
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
                                  <button
                                    type="button"
                                    class="btn btn-sm"
                                    style={{
                                      background: "#4261F7",
                                      color: "#fff",
                                      borderRadius: 5,
                                    }}
                                    onClick={() => handleClickOpen()}
                                  >
                                    {" "}
                                    <i class="mdi mdi-plus"></i>Add Briefing
                                  </button>

                                  {(isCheck.length > 1 && getBriefingData) && <button
                                    onClick={() => handleMultipleDelete()}
                                    // { isCheck.length > 0 && disabled}

                                    type="button"
                                    class="btn btn-info btn-sm"
                                    style={{
                                      borderRadius: 5,
                                      marginLeft: 10,
                                    }}
                                  >
                                    <i class="mdi mdi-delete"></i> Delete
                                  </button>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-2">
                          <div class="col-lg-10  form-label">
                            <div
                              class="row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div class="col-6 col-md-10">
                                <div class="row">
                                  <div
                                    style={{ fontSize: 13, fontWeight: 500 }}
                                  >
                                    Show &nbsp;
                                    <select
                                      style={{
                                        borderColor: "#a2a2a2",
                                        borderBox: "none",
                                        cursor: "pointer",
                                        background: "white",
                                        height: "30px",
                                        width: "70px",
                                        borderRadius: "5px",
                                        paddingLeft: "8px",
                                      }}
                                      onChange={(event) =>
                                        showEntry(parseInt(event.target.value))
                                      }
                                      className="select"
                                    >
                                      show entries
                                      <option value={10}>10</option>
                                      <option value={25}>25</option>
                                      <option value={50}>50</option>
                                      <option value={200}>200</option>
                                    </select>
                                    &nbsp;Entries
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-lg-2">
                            <div
                              class="row"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            >
                              <div class="col-12 col-md-12">
                                <div
                                  class="grid-container"
                                  style={{ padding: "0px 11px" }}
                                >
                                  <div class="row">
                                    <div
                                      style={{
                                        border: "1px solid #dee2e6",
                                        borderRadius: 3,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: 0,
                                        margin: 0,
                                      }}
                                    >
                                      <div
                                        class="input-group input-group-merge"
                                        style={{}}
                                      >
                                        <input
                                          type="text"
                                          class="form-control"
                                          style={{
                                            zIndex: 0,
                                            height: "32px",
                                            border: "0px solid #fff",
                                          }}
                                          placeholder="Search"
                                          onChange={(e) => handleSearch(e)}
                                        />
                                        <div
                                          class="input-group-text"
                                          data-password="false"
                                        >
                                          {/* <span class="fas fa-search"></span> */}
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
                      <div className="table" style={{ fontSize: 11.5 }}>
                        <table id="productTable" className="table table-hover">
                          <thead className="table">
                            <tr>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}

                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Selection</div>
                                  {/* <img src="images/arrow.png" width="10" /> */}
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(1)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>ID</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(2)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Icon</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(3)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Company</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(4)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Title</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(5)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Briefing Description</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(6)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Posted</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(7)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Posting Duration</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(8)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Created At</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(9)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Updated At</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>

                              <th style={{ cursor: "pointer", padding: "0px 15px 15px 15px" }}>Actions</th>
                            </tr>
                          </thead>

                          <tbody style={{ fontSize: 13 }}>
                            {getEmployee().length == 0 ? (
                              <td colspan={7}>
                                <p
                                  style={{
                                    textAlign: "center",
                                  }}
                                >
                                  No briefings yet..!
                                </p>
                              </td>
                            ) : (
                              getEmployee()
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div
                      class="row"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div class="col-12 col-md-6">
                        <div style={{ fontSize: 13, fontWeight: 700 }}>
                          {!getBriefingData.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                            (entryStart + 1) +
                            " to " +
                            entryEnd +
                            " of " +
                            getBriefingData.length +
                            " entries"}
                        </div>
                      </div>
                      <div class="col-12 col-md-6">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          {handlePaging()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showAddDialogBox()}
              {showEditDialogBox()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
