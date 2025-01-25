import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import ChatBot from "../common/ChatBot";

function ShoppingLayout() {
  return (
    <div className="bg-white overflow-hidden">
      <main className="flex flex-col w-full">
        {/* common header */}
        <ShoppingHeader />
        <Outlet />
        <div className="ml-4">
          {" "}
          {/*Added div for spacing */}
          <ChatBot />
        </div>
      </main>
    </div>
  );
}

export default ShoppingLayout;
