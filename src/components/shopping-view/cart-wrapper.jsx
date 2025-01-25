import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
  return (
    <SheetContent className="sm:max-w-md overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
        <SheetDescription className="sr-only">Description</SheetDescription>
      </SheetHeader>
      <div className="mt-8 space-y-4 max-h-[400px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => (
              <UserCartItemsContent key={item?.productId} cartItem={item} />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>
      <Button
        className="w-full mt-6"
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
