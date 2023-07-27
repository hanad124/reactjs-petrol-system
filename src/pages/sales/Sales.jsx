import "./sales.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import SalesContext from "../../context/SalesContext";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

const userColumns = [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "customerName",
    headerName: "Name",
    width: 210,
  },

  {
    field: "customerPhone",
    headerName: "Phone",
    width: 140,
  },

  {
    field: "fuelType",
    headerName: "Fuel",
    width: 80,
  },
  {
    field: "fuelTank",
    headerName: "Tank No.",
    width: 70,
  },
  {
    field: "litter",
    headerName: "Litters",
    width: 60,
  },
  {
    field: "pricePerLitter",
    headerName: "Price/Litter",
    width: 80,
  },
  {
    field: "totalPrice",
    headerName: "Total",
    width: 80,
  },
  {
    field: "salesDate",
    headerName: "Date",
    width: 120,
  },
];

const Sales = () => {
  const navigate = useNavigate();

  return (
    <div className="sales">
      <Sidebar />
      <div className="salesContainer">
        <Navbar />
        <div className="datatable">
          <div className="datatableTitle ">
            Sales
            <div
              className="link"
              onClick={() => {
                navigate("/sales/new-sales");
              }}
            >
              Add New
            </div>
          </div>
        </div>
        <div className="h-screen mx-[1rem]">
          <SalesData buttons={true} />
        </div>
      </div>
    </div>
  );
};

export const SalesData = ({ buttons }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [salesStatus, setSalesStatus] = useState([]);
  const { salesId, SetSalesId } = useContext(SalesContext);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "sales"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  //FETCH SELLS STATUS
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "sales"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push(doc.data().status);
        });
        setSalesStatus(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  const clickUser = (id) => {
    localStorage.setItem("salesID", JSON.stringify(id));
  };

  const editUserBtn = (id) => {
    localStorage.setItem("salesID", JSON.stringify(id));
    SetSalesId(id);
  };

  const handleDelete = async (id) => {
    const confirmed = confirm(
      "Are you sure you want to delete this transection?"
    );
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "sales", id));
        setData(data.filter((item) => item.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="cellAction flex gap-2">
            {/* <Link to="" style={{ textDecoration: "none" }}>
              <div className="viewButton" onClick={() => ""}>
                View
              </div>
            </Link> */}
            <Link to="/sales/edit-sales">
              <div
                className="py-[2px] px-3 rounded-md text-green-600 border-[1px] border-solid border-green-600"
                onClick={() => editUserBtn(params.row.id)}
              >
                Edit
              </div>
            </Link>
            <div
              className="py-[2px] px-3 rounded-md text-red-600 border-[1px] border-solid border-red-600 cursor-pointer"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const statusColumn = [
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        const index = data.findIndex((item) => item.id === params.row.id);
        const status = salesStatus[index];

        useEffect(() => {
          const timeoutId = setTimeout(() => {
            const nextIndex = index + 1;
            if (nextIndex < data.length) {
              setData((prevData) => {
                const newData = [...prevData];
                newData[nextIndex].status = salesStatus[nextIndex];
                return newData;
              });
            }
          }, (index + 1) * 1000);

          return () => {
            clearTimeout(timeoutId);
          };
        }, [index]);

        return (
          <div className="cellAction">
            <div
              className={`status ${status} ${
                status === "Pending"
                  ? "bg-yellow-500/20 text-yellow-600 py-[.2rem] px-[.5rem] rounded-md"
                  : "text-green-600 bg-green-500/20 py-[.2rem] px-[.5rem] rounded-md"
              } `}
            >
              {status}
            </div>
          </div>
        );
      },
    },
  ];
  let columns = userColumns.concat(statusColumn);
  if (buttons) {
    columns = columns.concat(actionColumn);
  }

  return (
    <DataGrid
      className="datagrid h-full overflow-x-hidden"
      rows={data}
      columns={columns}
      pageSize={9}
      rowsPerPageOptions={[9]}
    />
  );
};

export default Sales;
