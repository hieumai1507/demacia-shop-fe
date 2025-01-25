import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StartRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  //declare state and selector object
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const dispatch = useDispatch();

  const { toast } = useToast();
  //function handle rating change
  function handleRatingChange(getRating) {
    setRating(getRating);
  }
  //handle add to cart
  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        //fetchCartItems after update
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }
  //handle DialogClose
  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }
  //function handle add review
  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    )
      .then((data) => {
        if (data.payload.data) {
          setRating(0);
          setReviewMsg("");
          dispatch(getReviews(productDetails?._id));
          toast({
            title: "Review added successfully!",
          });
        } else if (data.payload && data.payload.message) {
          toast({
            title: data.payload.message,
            variant: "destructive",
          });
          console.error("Error", data.payload.message);
        } else {
          console.error("Unexpected response: ", data);
          toast({
            title: "An unexpected error occurred",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        //Network error or other problem
        console.error("Error adding review: ", error);
        toast({
          title:
            "You need to purchase product to review it or you have reviewed already",
          variant: "destructive",
        });
      });
  }
  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails, dispatch]);
  const averageReview =
    reviews && reviews?.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <DialogTitle className="sr-only">{productDetails?.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {productDetails?.description || "Details about the selected product."}
        </DialogDescription>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-2xl text-muted-foreground mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="font-bold text-2xl to-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StartRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          {/* button add to cart / out of stock */}
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          {/* Display review */}
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4" key={reviewItem?._id}>
                    <Avatar className="w-10 h-10 border ">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 ">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StartRatingComponent
                          rating={reviewItem?.reviewValue}
                        />
                      </div>
                      <p className="text-muted-foreground ">
                        {reviewItem?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1> No Reviews</h1>
              )}
            </div>
            {/* submit button */}
            <div className="mt-8 flex flex-col gap-2 m-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StartRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
