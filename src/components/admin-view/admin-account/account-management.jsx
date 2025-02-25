import { useSelector } from "react-redux";
import AdminUserAccountList from "./user-account-list";

function AdminAccountManagement() {
  const { user } = useSelector((state) => state.auth);
  const isStaff = user?.typeAdmin === "staff";
  const isManager = user?.typeAdmin === "manager";
  const isDirector = user?.typeAdmin === "director";

  return (
    <div className="container mx-auto ">
      <h1 className="text-2xl font-bold mb-4">Account Management</h1>

      {isStaff && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Staff</h2>
          <AdminUserAccountList view="staff" />
        </div>
      )}

      {(isManager || isDirector) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            {isManager ? "Manager" : "Director"}
          </h2>
          <AdminUserAccountList view={isManager ? "manager" : "director"} />
        </div>
      )}
    </div>
  );
}

export default AdminAccountManagement;
