import { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Section */}
      <div className="min-h-screen lg:pl-64">
        {/* Fixed Navbar */}
        <Navbar onMenuToggle={() => setMobileMenuOpen((open) => !open)} />

        {/* Page Content */}
        <main className="min-h-screen pt-16">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
