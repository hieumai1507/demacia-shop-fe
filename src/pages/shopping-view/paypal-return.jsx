import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { HousePlug } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, payerId, dispatch]);
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full">
        {" "}
        {/* Added a container to limit card width */}
        <Card className="pt-[15px] shadow-lg rounded-lg border border-gray-200">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <CardTitle className="text-xl font-semibold text-gray-800 ml-16">
              Processing Payment..Please wait!
            </CardTitle>
          </CardHeader>
          <div className="text-center p-8">
            {/* Loading Animation */}
            <div className="relative ml-[100px] mb-6 w-20 h-12">
              <span className="absolute top-0 text-xs text-gray-500 animate-text_713 font-bold">
                loading
              </span>
              <span className="absolute bottom-0 w-4 h-4 bg-[#020817] rounded-full animate-loading_713">
                <span className="absolute w-full h-full bg-gray-200 rounded-full animate-loading2_713"></span>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PaypalReturnPage;
