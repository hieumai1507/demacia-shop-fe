import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "Demacia Shop is best website to buy some clothing",
      "/auth/login": "Login -  Demacia Shop LLC",
      "/auth/register": "Register your new account -  Demacia Shop LLC",
      "/admin": "Admin Demacia Shop LLC",
      "/admin/dashboard": "Dashboard -  Admin Demacia Shop LLC",
      "/admin/products": "Products -  Admin Demacia Shop LLC",
      "/admin/orders": "Orders -  Admin Demacia Shop LLC",
      "/admin/features": "Features -  Admin Demacia Shop LLC",
      "/shop": "Demacia Shop LLC",
      "/shop/home": "Demacia Shop is best website to buy some clothing",
      "/shop/listing": "Listing - Demacia Shop LLC",
      "/shop/checkout": "Checkout - Demacia Shop LLC",
      "/shop/account": "Account - Demacia Shop LLC",
      "/shop/payment-return": "Payment Return - Demacia Shop LLC",
      "/shop/payment-success": "Payment Success - Demacia Shop LLC",
      "/shop/search": "Search - Demacia Shop LLC",
      "/unauth-page": "Unauthorized - Demacia Shop LLC",
    };

    document.title =
      (titles as Record<string, string>)[location.pathname] ||
      " Demacia Shop LLC";
  }, [location.pathname]);

  return null;
};

export default PageTitle;
