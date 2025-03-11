import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  deleteUserAccount,
  getAllUsersAccount,
  updateUserAccount,
  clearUserDetails,
} from "@/store/admin/account-slice";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/common/Pagination";
import AdminUserAccountDetail from "./user-account-detail";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Import Input

function AdminUserAccountList({ view }) {
  const dispatch = useDispatch();
  const { userList, isLoading, error, userDetails } = useSelector(
    (state) => state.adminAccounts
  );
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [editUserId, setEditUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ role: "", typeAdmin: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // 1. Filtered User List
  const filteredUserList = useMemo(() => {
    if (!userList) return [];
    let list = userList;

    if (view === "staff") {
      list = list.filter((userItem) => userItem.role === "user");
    }
    if (view === "manager") {
      list = list.filter(
        (userItem) =>
          userItem.role === "user" ||
          (userItem.role === "admin" && userItem.typeAdmin === "staff")
      );
    }
    // Apply search filter
    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      list = list.filter(
        (userItem) =>
          userItem.userName.toLowerCase().includes(lowerCaseSearchQuery) ||
          userItem.email.toLowerCase().includes(lowerCaseSearchQuery) ||
          userItem.role.toLowerCase().includes(lowerCaseSearchQuery) ||
          userItem.typeAdmin.toLowerCase().includes(lowerCaseSearchQuery)
      );
    }
    return list;
  }, [userList, view, searchQuery]);

  // 2. Sorted User List
  const sortedUserList = useMemo(() => {
    const sorted = [...filteredUserList].sort((a, b) => {
      if (a.role === b.role) {
        return a.typeAdmin < b.typeAdmin ? 1 : -1;
      }
      return a.role < b.role ? 1 : -1;
    });
    return sorted;
  }, [filteredUserList]);
  // pagination code
  const paginatedUserList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedUserList.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedUserList, currentPage, itemsPerPage]);

  const isSelf = (userItem) => userItem._id === user._id;
  // condition to edit
  const canEdit = (userItem) => {
    if (userItem.role === "admin" && userItem.typeAdmin === "director")
      return false;
    if (isSelf(userItem)) return false;
    return view === "director" || view === "manager";
  };

  const canEditRole = (userItem) => {
    if (userItem.role === "admin" && userItem.typeAdmin === "director")
      return false;
    if (isSelf(userItem)) return false;
    return view === "director" || view === "manager";
  };

  const canEditTypeAdmin = (userItem) => {
    if (userItem.role === "admin" && userItem.typeAdmin === "director")
      return false;
    if (isSelf(userItem)) return false;
    return (
      view === "director" ||
      (view === "manager" && editFormData.role === "admin")
    );
  };
  // user will be promoted to staff and manager
  const getAvailableTypeAdminOptions = (userItem) => {
    const options = ["none"];
    if (view === "director") {
      if (editFormData.role === "admin") {
        options.push("staff", "manager");
      }
    } else if (view === "manager" && editFormData.role === "admin") {
      options.push("staff");
    }
    return options;
  };

  const getAvailableRoleOptions = (userItem) => {
    const options = ["user"];
    if (
      view === "director" ||
      (view === "manager" && editFormData.typeAdmin !== "manager")
    ) {
      options.push("admin");
    }
    return options;
  };
  // dispatch all user account
  useEffect(() => {
    dispatch(getAllUsersAccount());
  }, [dispatch]);

  const handleEdit = (userItem) => {
    setEditUserId(userItem._id);
    setEditFormData({
      role: userItem.role,
      typeAdmin: userItem.typeAdmin,
    });
  };
  // handle edit submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsUpdating(true);

    dispatch(
      updateUserAccount({
        id: editUserId,
        userData: editFormData,
      })
    )
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getAllUsersAccount());
          toast({ title: "User updated successfully" });
          setEditUserId(null);
        } else {
          toast({
            title: data?.payload?.message || "Failed to update user.",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        toast({
          title: error.message || "Failed to update user.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };
  // open detailDialog
  const handleOpenDetailDialog = (userId) => {
    const id = String(userId);
    setSelectedUserId(id);
    setOpenDetailDialog(true);
  };
  // close detail dialog
  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedUserId(null);
    dispatch(clearUserDetails());
  };

  if (isLoading && !openDetailDialog) {
    return (
      <div className="flex justify-center items-center h-64">
        <Skeleton className="w-full max-w-md bg-[#8e9aaa] h-32 rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }
  return (
    <>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="overflow-x-auto">
        <Table className="max-w-[1000px] items-center">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] md:w-[100px]">
                User Name
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[120px] md:w-auto">Role</TableHead>
              <TableHead className="w-[140px] md:w-auto">Type Admin</TableHead>
              <TableHead className="w-[140px] md:w-auto">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUserList.map((userItem) => (
              <TableRow key={userItem._id}>
                <TableCell
                  className="cursor-pointer hover:underline"
                  onClick={() => handleOpenDetailDialog(userItem._id)}
                >
                  {userItem.userName}
                </TableCell>
                <TableCell>{userItem.email}</TableCell>
                <TableCell>
                  {editUserId === userItem._id ? (
                    <Select
                      value={editFormData.role}
                      onValueChange={(value) =>
                        setEditFormData({ ...editFormData, role: value })
                      }
                      disabled={!canEditRole(userItem) || isUpdating}
                    >
                      <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableRoleOptions(userItem).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    userItem.role
                  )}
                </TableCell>
                <TableCell>
                  {editUserId === userItem._id ? (
                    <Select
                      value={editFormData.typeAdmin}
                      onValueChange={(value) =>
                        setEditFormData({ ...editFormData, typeAdmin: value })
                      }
                      disabled={!canEditTypeAdmin(userItem) || isUpdating}
                    >
                      <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Select type admin" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableTypeAdminOptions(userItem).map(
                          (typeAdmin) => (
                            <SelectItem key={typeAdmin} value={typeAdmin}>
                              {typeAdmin.charAt(0).toUpperCase() +
                                typeAdmin.slice(1)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    userItem.typeAdmin
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {editUserId === userItem._id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleEditSubmit}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Updating..." : "Update"}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditUserId(null)}
                          disabled={isUpdating}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        {canEdit(userItem) && (
                          <Button
                            onClick={() => handleEdit(userItem)}
                            variant={"default"}
                            size="sm"
                          >
                            Edit
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center mt-4">
        <Pagination
          totalPages={Math.ceil(sortedUserList.length / itemsPerPage)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
      <Dialog open={openDetailDialog} onOpenChange={handleCloseDetailDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Detail</DialogTitle>
            <DialogDescription>
              {"Here's the detail information of user."}
            </DialogDescription>
          </DialogHeader>
          <AdminUserAccountDetail
            userId={selectedUserId} // Pass userId
            onClose={handleCloseDetailDialog}
            view={view}
          />
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDetailDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminUserAccountList;
