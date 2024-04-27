import "./purchase.scss";

import PurchaseContext from "../../context/PurchaseContext";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import React from "react";
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
    field: "suppName",
    headerName: "Name",
    width: 180,
  },

  {
    field: "suppPhone",
    headerName: "Phone",
    width: 100,
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
    field: "perchaseDate",
    headerName: "Date",
    width: 110,
  },
];

const Purchase = () => {
  const navigate = useNavigate();

  return (
    <div className="purchase">
      <div className="datatable">
        <div className="datatableTitle ">
          Purchase
          <div
            className="link"
            onClick={() => {
              navigate("/purchase/new-purchase");
            }}
          >
            Add New
          </div>
        </div>
      </div>
      <div className="h-screen mx-[1rem]">
        <PurchaseData buttons={true} />
      </div>
    </div>
  );
};

export const PurchaseData = ({ buttons }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [purchaseStatus, setPurchaseStatus] = useState([]);
  const { purchaseId, SetPurchaseId } = useContext(PurchaseContext);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "purchase"),
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
      collection(db, "purchase"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push(doc.data().status);
        });
        setPurchaseStatus(list);
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
    localStorage.setItem("purchaseID", JSON.stringify(id));
  };

  const editUserBtn = (id) => {
    localStorage.setItem("purchaseID", JSON.stringify(id));
    SetPurchaseId(id);
  };

  const handleDelete = async (id) => {
    const confirmed = confirm(
      "Are you sure you want to delete this transection?"
    );
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "purchase", id));
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
            <Link to="/purchase/edit-purchase">
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
        const status = purchaseStatus[index];

        useEffect(() => {
          const timeoutId = setTimeout(() => {
            const nextIndex = index + 1;
            if (nextIndex < data.length) {
              setData((prevData) => {
                const newData = [...prevData];
                newData[nextIndex].status = purchaseStatus[nextIndex];
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

export default Purchase;
