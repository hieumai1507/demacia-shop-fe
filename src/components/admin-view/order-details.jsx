import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrdersDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();
  const dispatch = useDispatch();
  function handleUpdateStatus(event) {
    event.preventDefault();
    console.log("formData", formData);
    const { status } = formData;
    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      console.log(data, " 123data");
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent
      className="sm:max-w-[600px] sm:max-h-[600px] overflow-y-scroll"
      aria-describedby={undefined}
    >
      <DialogHeader>
        <DialogTitle className="sr-only">Order Details</DialogTitle>
      </DialogHeader>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-medium">Order ID</td>
                <td className="border px-4 py-2 text-center">
                  {orderDetails?._id}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Order Date</td>
                <td className="border px-4 py-2 text-center">
                  {orderDetails?.orderDate.split("T")[0]}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Order Price</td>
                <td className="border px-4 py-2 text-center">
                  ${orderDetails?.totalAmount}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Payment Method</td>
                <td className="border px-4 py-2 text-center">
                  {orderDetails?.paymentMethod}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Payment Status</td>
                <td className="border px-4 py-2 text-center">
                  {orderDetails?.paymentStatus}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Order Status</td>
                <td className="border px-4 py-2 text-center">
                  <Badge
                    className={`py-1 px-3 ${
                      orderDetails?.orderStatus === "confirmed"
                        ? "bg-green-500"
                        : orderDetails?.orderStatus === "rejected"
                        ? "bg-red-600"
                        : "bg-black"
                    }`}
                  >
                    {orderDetails?.orderStatus}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details Of All Items</div>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-center">Title</th>
                  <th className="border px-4 py-2 text-center">Quantity</th>
                  <th className="border px-4 py-2 text-center">Price</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                  ? orderDetails?.cartItems.map((item) => (
                      <tr key={item?._id}>
                        <td className="border px-4 py-2 text-center">
                          {item?.title}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {item?.quantity}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          ${item?.price}
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="font-medium">Shipping Info</div>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-medium">Address</td>
                <td className="border px-4 py-2">
                  {orderDetails?.addressInfo?.address}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">City</td>
                <td className="border px-4 py-2">
                  {orderDetails?.addressInfo?.city}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Phone</td>
                <td className="border px-4 py-2">
                  {orderDetails?.addressInfo?.phone}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Notes</td>
                <td className="border px-4 py-2">
                  {orderDetails?.addressInfo?.notes}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrdersDetailsView;
