import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Llamar a la función de logout
        navigate("/login"); // Redirigir al login después de cerrar sesión
    };

    return (
        <>
            <aside
                className={`${isCollapsed ? "w-16" : "w-60"
                    } h-screen bg-gray-800 text-white fixed top-0 left-0 shadow-lg transition-all duration-300`}
            >
                <div className="flex justify-end p-2">
                    <button onClick={toggleSidebar}>
                        <span className="material-icons">menu</span>
                    </button>
                </div>

                <div className="p-6 text-2xl font-bold border-b border-gray-600">
                    {!isCollapsed && "TallerData"}
                </div>

                <nav className="mt-4">
                    <ul>
                        <li className="px-4 py-2 hover:bg-gray-700 transition duration-300 flex items-center">
                            <Link to="/tasks" className="flex items-center w-full">
                                <span className="material-icons">list</span>
                                {!isCollapsed && <span className="ml-4">Tareas</span>}
                            </Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-700 transition duration-300 flex items-center">
                            <Link to="/add-task" className="flex items-center w-full">
                                <span className="material-icons">add_task</span>
                                {!isCollapsed && <span className="ml-4">Agregar Tarea</span>}
                            </Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-700 transition duration-300 flex items-center">
                            <Link to="/search-tasks" className="flex items-center w-full">
                                <span className="material-icons">search</span>
                                {!isCollapsed && <span className="ml-4">Buscar Tareas</span>}
                            </Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-700 transition duration-300 flex items-center">
                            <Link to="/profile" className="flex items-center w-full">
                                <span className="material-icons">person</span>
                                {!isCollapsed && <span className="ml-4">Perfil</span>}
                            </Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-red-600 transition duration-300 flex items-center">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full text-left focus:outline-none"
                            >
                                <span className="material-icons">logout</span>
                                {!isCollapsed && <span className="ml-4">Cerrar sesión</span>}
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Contenido principal con margen dinámico */}
            <div
                className={`transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-60"
                    }`}
            >
                {/* Aquí irá el contenido de la página */}
            </div>
        </>
    );
};

export default Sidebar;
