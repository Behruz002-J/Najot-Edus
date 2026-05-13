import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
    return(
        <div className="min-h-screen flex flex-col font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-[#1A2542] tracking-tight">
                            LMS<span className="text-blue-600">.EDU</span>
                        </Link>
                    </div>
                    <div className="flex gap-8 items-center">
                        <Link to={"/"} className="text-gray-600 hover:text-[#1A2542] font-medium transition-colors">Home</Link>
                        <Link to={"/about"} className="text-gray-600 hover:text-[#1A2542] font-medium transition-colors">About</Link>
                        <Link to={"/dashboard"} className="text-gray-600 hover:text-[#1A2542] font-medium transition-colors">Dashboard</Link>
                        <Link to={"/login"} className="bg-[#1A2542] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#121a30] transition-colors shadow-md">Login</Link>
                    </div>
                </nav>
            </header>
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    )
}