import React, { useEffect, useState } from "react";
import {
  postDataAxios,
  ServerURL,
} from "../../../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import { CSVLink } from "react-csv";
import { PaginationItem } from "@mui/material";
import swal from "sweetalert";

export default function AuditorCustomerTable(props) {
  // console.log("Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaauuudddttttooorrrr---->", props);
  const [CustomerTableData, setCustomerTableData] = useState([]);
  const [SearchData, setSearchData] = useState([]);
  const [Page, setPage] = useState(1);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    handleFilter();
    //setCustomerTableData(props.item);
  }, [props]);

  const handleFilter = async () => {
    try {
      let body = { startDate: props.startdate, endDate: props.endDate };
      let result = await postDataAxios(
        `customers/displayfilter/${props.detail.id}/${props.detail.company}`,
        body
      );
      // console.log("AuditorCustomerTable-------->😘😘", result);
      setCustomerTableData(result.data);
      setSearchData(result.data);
      setLoading(false);
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

  const handleSearch = (e) => {
    var searchArr = [];
    SearchData.map((item) => {
      var id = `${item.id}`;
      if (
        (item.call_type &&
          item.call_type
            .toLowerCase()
            .includes(e.target.value.toLowerCase())) ||
        (item.disposition &&
          item.disposition
            .toLowerCase()
            .includes(e.target.value.toLowerCase())) ||
        (id && id.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.call_status &&
          item.call_status.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setCustomerTableData(searchArr);
  };

  document.addEventListener(
    "play",
    function (e) {
      var audios = document.getElementsByTagName("audio");
      for (var i = 0, len = audios.length; i < len; i++) {
        if (audios[i] != e.target) {
          audios[i].pause();
        }
      }
    },
    true
  );

  const showEntry = (value) => {
    setEntryEnd(
      entryStart + value > CustomerTableData.length
        ? CustomerTableData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (CustomerTableData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < CustomerTableData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const showEmployee = (i) => {
    let id = "";
    let calltype = "";
    let username = "";
    let created = "";
    let Duration = "";
    let note = "";
    let Rec = "";
    let callstatus = "";
    let disposition = "";

    try {
      id = CustomerTableData[i].id;
      calltype = CustomerTableData[i].call_type;
      username = CustomerTableData[i].UserName;
      created = moment(CustomerTableData[i].CallsDateTime).format(
        "YYYY-MM-DD hh:mm a"
      );
      Duration = moment
        .utc(CustomerTableData[i].duration * 1000)
        .format("HH:mm:ss");
      note = CustomerTableData[i].user_note;
      Rec = CustomerTableData[i].recording_url;
      callstatus = CustomerTableData[i].call_status;
      disposition = CustomerTableData[i].disposition;
    } catch (e) {
      id = "";
      calltype = "";
      username = "";
      created = "";
      Duration = "";
      note = "";
      Rec = "";
      callstatus = "";
      disposition = "";
    }

    return (
      <tr style={{ alignItems: "center" }}>
        <td> {id} </td>
        <td>{calltype}</td>
        <td> {username} </td>
        <td> {created}</td>
        <td>{Duration}</td>
        <td> {note} </td>
        <td>
          {
            // Aud.play()
            <audio
              // autoPlay
              key={id}
              src={`${ServerURL}/MP_3/${Rec}`}
              controls={true}
              style={{ height: "20px", width: "220px" }}
            />
          }
        </td>

        <td>
          {callstatus === "Connected" ? (
            <div style={{ color: "#E33899", fontWeight: 600 }}>
              {callstatus}{" "}
            </div>
          ) : callstatus === "Not Connected" ? (
            <div style={{ color: "#EF7829", fontWeight: 600 }}>
              {callstatus}
            </div>
          ) : callstatus === "Missed" ? (
            <div style={{ color: "#E80505", fontWeight: 600 }}>
              {callstatus}
            </div>
          ) : callstatus === "Answered" ? (
            <div style={{ color: "#447CEC", fontWeight: 600 }}>
              {callstatus}
            </div>
          ) : callstatus === "whatsapp" ? (
            <div style={{ color: "#10C469", fontWeight: 600 }}>
              {callstatus}
            </div>
          ) : (
            <div style={{ color: "#FFB523", fontWeight: 600 }}>
              {callstatus}{" "}
            </div>
          )}
        </td>
        <td style={{ color: "#38ada9", fontWeight: 600 }}>{disposition}</td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < CustomerTableData.length
        ? (entNumber + 1) * entriesPerPage
        : CustomerTableData.length
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
    let totalPages = CustomerTableData.length / entriesPerPage;
    let pageNumber = [];

    return (
      <Pagination
        color="primary"
        variant="outlined"
        shape="rounded"
        count={parseInt(totalPages + 1)}
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
      {Loading ? (
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
        <div class="container-fluid mt-4">
          <div class="card border border-default">
            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <div class="grid-structure">
                    <div
                      class="row"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div class="col-12 col-md-6 form-label">
                        <div
                          class="row"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div class="col-6 col-md-10">
                            <div class="row">
                              <div style={{ fontSize: 13, fontWeight: 500 }}>
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
                      <div
                        class="col-12 col-md-6 form-label"
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginLeft: "inherit",
                        }}
                      >
                        <div
                          class="ro1w"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <div class="col-6 col-md-5">
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
                          <div
                            class="col-6 col-md-4"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              paddingRight: 0,
                            }}
                          >
                            <CSVLink
                              data={CustomerTableData}
                              filename={"Customer_Calls.csv"}
                            >
                              <button
                                type="button"
                                style={{
                                  width: 100,
                                  borderRadius: 5,
                                  height: 34,
                                }}
                                class="btn btn-info btn-sm"
                              >
                                <i class="mdi mdi-download"></i> Export
                              </button>
                            </CSVLink>
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
                              <div>Call Type</div>
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
                              <div>Executive</div>
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
                                width: "140px",
                              }}
                            >
                              <div>Call Date & time</div>
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
                              <div>Duration</div>
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
                              <div>Note</div>
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
                              <div>Play Audio</div>
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
                              <div>Status</div>
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
                              <div>Disposition</div>
                              <img src="images/arrow.png" width="10" />
                            </div>
                          </th>
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
                              No customer's calls yet..!
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
                      {!CustomerTableData.length
                        ? "[Nothing to show]"
                        : "Showing  " +
                          (entryStart + 1) +
                          " to " +
                          entryEnd +
                          " of " +
                          CustomerTableData.length +
                          " entries"}
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {handlePaging()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
