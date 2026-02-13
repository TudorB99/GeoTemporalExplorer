import "./layout.css";
import type { FC, PropsWithChildren } from "react";
import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/sidebar/sidebar";
import TopBar from "../components/top_bar/top_bar";

type LayoutProps = PropsWithChildren<{
  title?: string;
}>;

const Layout: FC<LayoutProps> = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  // Close on ESC (nice for mobile drawer)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSidebar]);

  // Prevent background scroll when drawer is open (mobile)
  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  return (
    <div className="layout">
      {/* Overlay for mobile drawer */}
      <button
        type="button"
        className="overlay"
        data-open={sidebarOpen}
        onClick={closeSidebar}
        aria-label="Close sidebar overlay"
        tabIndex={sidebarOpen ? 0 : -1}
      />

      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="layout__content">
        <TopBar title={title} onMenuClick={toggleSidebar} />

        <main className="main" aria-label="Main content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
