export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-800 text-white p-4">
            <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
            <nav>
                <ul className="space-y-2">
                    <li>
                        <a href="/admin/directions" className="block p-2 hover:bg-gray-700 rounded">
                            Directions
                        </a>
                    </li>
                    <li>
                        <a href="/admin/students" className="block p-2 hover:bg-gray-700 rounded">
                            Students
                        </a>
                    </li>
                    {/* Add more links for semesters, courses, etc. */}
                    <li>
                        <button
                            onClick={() => {
                                localStorage.removeItem('access_token');
                                localStorage.removeItem('refresh_token');
                                window.location.href = '/login';
                            }}
                            className="block w-full text-left p-2 hover:bg-gray-700 rounded"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}