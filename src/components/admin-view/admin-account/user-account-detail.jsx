// user-account-detail.jsx
import { getUsersDetails } from "@/store/admin/account-slice";
import React, { useEffect } from "react"; // Import useEffect
import { useSelector, useDispatch } from "react-redux";

function AdminUserAccountDetail({ onClose, view, userId }) {
  // Receive userId
  const { userDetails, isLoading, error } = useSelector(
    (state) => state.adminAccounts
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (userId) {
      dispatch(getUsersDetails(userId));
    }
  }, [dispatch, userId]);
  if (isLoading) {
    return <div>Loading user details...</div>;
  }

  if (error) {
    return <div>Error loading user details: {error}</div>;
  }

  if (!userDetails) {
    return <div>No user details found.</div>;
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <span id="name" className="col-span-3 text-sm">
          {userDetails.user.userName}
        </span>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <span id="email" className="col-span-3 text-sm">
          {userDetails.user.email}
        </span>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="role" className="text-sm font-medium">
          Role
        </label>
        <span id="role" className="col-span-3 text-sm">
          {userDetails.user.role}
        </span>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="typeAdmin" className="text-sm font-medium">
          Type Admin
        </label>
        <span id="typeAdmin" className="col-span-3 text-sm">
          {userDetails.user.typeAdmin}
        </span>
      </div>
      {userDetails &&
      userDetails.addresses &&
      userDetails.addresses.length > 0 ? (
        userDetails.addresses.map((address) => (
          <React.Fragment key={address._id}>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor={`address-${address._id}`}
                className="text-sm font-medium"
              >
                Address
              </label>
              <span
                id={`address-${address._id}`}
                className="col-span-3 text-sm"
              >
                {address.address}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor={`city-${address._id}`}
                className="text-sm font-medium"
              >
                City
              </label>
              <span id={`city-${address._id}`} className="col-span-3 text-sm">
                {address.city}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor={`phone-${address._id}`}
                className="text-sm font-medium"
              >
                Phone
              </label>
              <span id={`phone-${address._id}`} className="col-span-3 text-sm">
                {address.phone}
              </span>
            </div>
          </React.Fragment>
        ))
      ) : (
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="col-span-4 text-sm">
            No address information available.
          </span>
        </div>
      )}
    </div>
  );
}

export default AdminUserAccountDetail;
