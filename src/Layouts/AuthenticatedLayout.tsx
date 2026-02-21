import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold hover:text-blue-100 transition">
              SEAMS
            </Link>
            <nav>
              <Link 
                to="/" 
                className="px-4 py-2 hover:bg-blue-700 rounded transition"
              >
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-12">
        <p className="text-sm">SEAMS © 2025 - Den Enoy</p>
      </footer>
    </div>
  );
};

export default Layout;