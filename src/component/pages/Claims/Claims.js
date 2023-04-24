import React, { useEffect, useState } from "react";
import { getDataAxios,postDataAxios} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import AddClaims from "../AddClaims/AddClaims";
import EditRole from "../EditRole/EditRole";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import Swal from "sweetalert2";
import { PaginationItem } from "@mui/material";
import EditClaims from "../EditClaims/EditClaims";
import swal from "sweetalert";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Claims(props) {
  var userData = JSON.parse(localStorage.getItem("user"));
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getClaimsData, setClaimsData] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [CompanyId, setCompanyId] = useState(userData.company_id);
  const [getOpen, setOpen] = useState(false);
  const [Page, setPage] = useState(1);
  const [isCheck, setIsCheck] = useState([]);
  const legth = 30;
 
  

  useEffect(() => {
    fetchClaimsData();
  }, []);


  const handleMultiChecked = (event, cid) => {
    const { checked } = event.target;
    let id = cid;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
    
  };

  // const handleMultipleDelete=async()=>{
   
  //   var body = { id: isCheck };
  //   var response = await postDataAxios("claims/delete_all_claims", body);

  //   if (response.status) {
  //     swal({
  //       title: "All Data of Claims Delete Sucessfully",
  //       icon: "success",
  //       button: "ok",
  //     });
  //     // window.location.reload();
  //     fetchClaimsData();
  //     handleBack(80.1)
  //   } else {
  //     swal({
  //       title: `Something went wrong.`,
  //       icon: "error",
  //       button: "ok",
  //     });
  //   }

  //  }

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Do you want to delete this Role Details?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {
        var body = { id: id }
        var result = await postDataAxios(`claims/delete_claims`, body)

        if (result.status) {
          Swal.fire("Deleted!", "", "success");
          fetchClaimsData();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };


  const handleMultipleDelete = async () => {
    Swal.fire({
      title: "Do you want to delete this Multiple Claims Details?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {
        var body = { id: isCheck };
    var response = await postDataAxios("claims/delete_all_claims", body);

        if (response.status) {
          Swal.fire("Deleted!", "", "success");
          fetchClaimsData();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
    
  };
   const handleBack = (option) => {
    props.handleDashComponent(option);
  };


  const fetchClaimsData = async () => {
  
      let response = await getDataAxios(
        `claims/display_all_claims_data`
      );
      //alert(JSON.stringify(response))
    
        setClaimsData(response.data);
        setTempTableData(response.data);
   
    }

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      if (
        (item.name &&
          item.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.perm &&
          item.perm.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setClaimsData(searchArr);
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
      entryStart + value > getClaimsData.length
        ? getClaimsData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getClaimsData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getClaimsData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleEditPage = (item) => {
    props.handleDashComponent(
      "",
      <EditClaims item={item} handleDashComponent={props.handleDashComponent} />
    );
  };

  const handleAddRole = () => {
    props.handleDashComponent(
      "",
      <AddClaims handleDashComponent={props.handleDashComponent} />
    );
  };

  // const handleDelete = async (id) => {
  //   var body = { id: id }
  //   // alert(JSON.stringify(id))
  //   var result = await postDataAxios(`claims/delete_claims`, body)
  //   if (result.status) {

  //     swal({
  //       title: `Claims Delete Successfully`,
  //       icon: "success",
  //       button: "ok",
  //     })
  //     fetchClaimsData();
  //   }
  //   else {
  //     swal({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: 'Something went wrong!',
  //     })
  //   }
  // };
  

  // const handleDelete = async (id) => {
  //   Swal.fire({
  //     title: "Do you want to delete this Role Details?",
  //     showDenyButton: true,
  //     confirmButtonText: "Delete",
  //     denyButtonText: `Don't Delete`,
  //   }).then(async (res) => {
  //     /* Read more about isConfirmed, isDenied below */
  //     if (res.isConfirmed) {
  //       var body = { id: id }
  //       var result = await postDataAxios(`claims/delete_claims`, body)

  //       if (result.status) {
  //         Swal.fire("Deleted!", "", "success");
  //         fetchClaimsData();
  //       } else {
  //         Swal.fire("Server Error", "", "error");
  //       }
  //     } else if (res.isDenied) {
  //       Swal.fire("Changes are not saved", "", "info");
  //     }
  //   });
  // };

  const showEmployee = (i) => {
    return (
      <tr>
        <td>
          <input
            class="form-check-input"
            type="checkbox"
            value={getClaimsData[i].id}
            id={getClaimsData[i].id}
            checked={isCheck.includes(getClaimsData[i].id)}
            onChange={(event) => handleMultiChecked(event, getClaimsData[i].id)}
          />
        </td>
        <td> {getClaimsData[i].id} </td>
        <td> {getClaimsData[i].name} </td>
        <td>{getClaimsData[i].slug}</td>
        <td>{getClaimsData[i].parent_id}</td>
        <td> {getClaimsData[i].created_at} </td>
        <td> {getClaimsData[i].updated_at} </td>
        <td> {getClaimsData[i].company_name} </td>
        <td style={{width:120}}>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ marginLeft: 5, borderRadius: 0 }}
            onClick={() => handleEditPage(getClaimsData[i])}
          >
            <i class="mdi mdi-pencil"></i>
          </button>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ marginLeft:5, borderRadius: 0,backgroundColor:'red' }}
            onClick={() => handleDelete(getClaimsData[i].id)}
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
      (entNumber + 1) * entriesPerPage < getClaimsData.length
        ? (entNumber + 1) * entriesPerPage
        : getClaimsData.length
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
    let totalPages = getClaimsData.length / entriesPerPage;
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
                            <h5 class="mt-0">Claims Management</h5>
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
                                    border: "1px solid #4261F7",
                                    color: "#fff",
                                    borderRadius: 5,
                                  }}
                                  onClick={() => handleAddRole()}
                                >
                                  {" "}
                                  <i class="mdi mdi-plus"></i>
                                  Add Claims
                                </button>

                                { (isCheck.length > 1 && getClaimsData ) && <button
                                    onClick={() => handleMultipleDelete()}
                                    // { isCheck.length > 0 && disabled}
                                    
                                    type="button"
                                    class="btn btn-info btn-sm"
                                    style={{
                                      borderRadius: 5,
                                      height: 34,
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
                        <div class="col-lg-2">
                          <div
                            class="row"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
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
                                  <div>selection</div>
                                  {/* <img src="images/arrow.png" width="10" /> */}
                                </div>
                              </th>
                            <th
                              style={{ cursor: "pointer", padding: "0px 15px 0px 0px", }}
                              onClick={() => sortTable(0)}
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
                              style={{ cursor: "pointer", padding: "0px 15px 0px 0px", }}
                              onClick={() => sortTable(1)}
                            >
                              <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                                <div>Name</div>
                                <img src="images/arrow.png" width="10" />
                              </div>

                            </th>
                            <th
                              style={{ cursor: "pointer",padding: "0px 15px 0px 0px", }}
                              onClick={() => sortTable(2)}
                            >
                               <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Slug</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                            </th>
                            <th style={{ cursor: "pointer",padding: "0px 15px 0px 0px", }}
                              onClick={() => sortTable(4)}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                               <div>Parent ID</div>
                               <img src="images/arrow.png" width="10" />
                               </div>
                               </th>

                               <th style={{ cursor: "pointer",padding: "0px 15px 0px 0px", }}
                              onClick={() => sortTable(5)}>
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

                               <th style={{ cursor: "pointer",padding: "0px 15px 0px 0px", }}
                              onClick={() => sortTable(6)}>
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
                               <th style={{ cursor: "pointer",padding: "0px 15px 0px 0px", }}
                              onClick={() => sortTable(7)}>
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
                               <th  style={{ cursor: "pointer",padding: "0px 15px 0px 0px"}}>
                               <div>Actions</div>
                               </th>
                          </tr>
                        </thead>
                        <tbody style={{ fontSize: 13 }}>{getEmployee()}</tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    class="row"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div class="col-12 col-md-6">
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        {!getClaimsData.length
                          ? "[Nothing to show]"
                          : "Showing  " +
                          (entryStart + 1) +
                          " to " +
                          entryEnd +
                          " of " +
                          getClaimsData.length +
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
        </div>
      </div>
    </>
  );
}
