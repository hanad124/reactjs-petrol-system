import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row ">
      {" "}
      {/* sidebar */}
      <Sidebar />
      <div className="flex-1">
        <div className="hidden w-full md:flex justify-between items-center bg-white  border-b borderstyle py-3 ">
          {/* <Search /> */}
          <Navbar />
        </div>
        {/* <SheetComponent /> */}
        <div className="min-h-screen py-4 w-full bg-white/50 px-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
