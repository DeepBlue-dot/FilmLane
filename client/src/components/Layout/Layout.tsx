import Footer from "../Footer/Footer";
import NavBar from "../NavBar/NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with background and shadow */}
      <NavBar />

      {/* Main content area expands to fill available space */}
      <main className="flex-grow container ">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
