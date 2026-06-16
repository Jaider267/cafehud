import { Outlet } from "react-router";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-20">
        <Outlet />
      </main>
      <footer className="py-20 border-t border-brand-light/20 text-center bg-brand-beige/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-16 h-1 bg-brand-medium mx-auto mb-8 rounded-full opacity-20"></div>
          <p className="text-brand-medium font-black text-[10px] uppercase tracking-[0.5em] mb-4">CaféHub Premium Experience</p>
          <p className="text-brand-medium text-xs font-bold opacity-80">© 2026 Todos los derechos reservados. El arte de tostar café.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
