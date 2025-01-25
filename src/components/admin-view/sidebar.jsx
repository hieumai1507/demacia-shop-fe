import { Fragment } from "react";
import {
  ChartNoAxesCombined,
  ShoppingBasket,
  BadgeCheck,
  CircleGauge,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

const adminSideBarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icons: <CircleGauge />,
  },

  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icons: <ShoppingBasket />,
  },

  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icons: <BadgeCheck />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  return (
    <nav className="mt-8 flex-col flex ga-2">
      {adminSideBarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icons}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}
function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b mt-5 mb-5">
              <SheetTitle className="flex gap-2 ">
                <ChartNoAxesCombined size={30} />
                <span className="text-xl font-extrabold">Admin Panel</span>
              </SheetTitle>
              <SheetDescription className="text-xs font-thin italic">
                Navigate through the site and manage your account
              </SheetDescription>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems setOpen={setOpen} />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
