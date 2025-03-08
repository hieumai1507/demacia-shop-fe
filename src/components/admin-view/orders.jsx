import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { useEffect, useState } from "react";
import AdminOrdersDetailsView from "./order-details";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

function AdminOrdersView() {
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [sortCriteria, setSortCriteria] = useState("newest"); // State lưu tiêu chí sắp xếp
  const { orderList, orderDetails } = useSelector((state) => state.adminOrders);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
    setIsFirstLoad(false);
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!isFirstLoad && orderDetails !== null) {
      setOpenDetailDialog(true);
    }
  }, [orderDetails, isFirstLoad]);

  // Sắp xếp danh sách đơn hàng
  const sortedOrders = [...(orderList || [])].sort((a, b) => {
    if (sortCriteria === "newest") {
      return new Date(b.orderDate) - new Date(a.orderDate);
    } else if (sortCriteria === "oldest") {
      return new Date(a.orderDate) - new Date(b.orderDate);
    } else if (sortCriteria === "status") {
      return a.orderStatus.localeCompare(b.orderStatus);
    }
    return 0;
  });

  return (
    <Card>
      {/* Header với tiêu chí sắp xếp */}
      <CardHeader className="flex justify-between items-center">
        <CardTitle>All Orders</CardTitle>

        <Select onValueChange={setSortCriteria} defaultValue={sortCriteria}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="status">Order Status</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedOrders.map((orderItem) => (
              <TableRow key={orderItem?._id}>
                <TableCell>{orderItem?._id}</TableCell>
                <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                <TableCell>
                  <Badge
                    className={`py-1 px-3 ${
                      orderItem?.orderStatus === "confirmed"
                        ? "bg-green-500"
                        : orderItem?.orderStatus === "rejected"
                        ? "bg-red-600"
                        : "bg-black"
                    }`}
                  >
                    {orderItem?.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>${orderItem?.totalAmount}</TableCell>
                <TableCell>
                  <Dialog
                    open={openDetailDialog}
                    onOpenChange={setOpenDetailDialog}
                  >
                    <Button
                      onClick={() => handleFetchOrderDetails(orderItem?._id)}
                    >
                      View Detail
                    </Button>
                    <AdminOrdersDetailsView orderDetails={orderDetails} />
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
