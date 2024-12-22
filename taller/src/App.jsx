import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import TaskPage from './pages/TaskPage'
import TaskFormPage from './pages/TaskFormPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './ProtectedRoute.jsx'
import { TaskProvider } from './context/TaskContext'
import TaskSearchPage from "./pages/TaskSearchPage";
import Sidebar from "./components/Sidebar";

function AppContent() {
  const location = useLocation();
  const hideSidebar = ["/", "/login", "/register"].includes(location.pathname);
  const { user } = useAuth();

  // Verifica si hay un usuario autenticado (con token o datos del usuario)
  const isAuthenticated = user?.email && user?.nombres;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar siempre presente si no está oculto */}
      {!hideSidebar && <Sidebar />}

      {/* Contenedor principal que ocupa el espacio restante */}
      <div className={`flex-1 ${!hideSidebar} bg-gray-100`}>
        {/* Bienvenida e imagen de perfil: Se muestra solo si el usuario está autenticado */}
        {isAuthenticated && (
          <div className="columns-2 text-gray-700 font-bold mt-6 mr-6 text-lg ml-5">
            <img
              src={
                user?.profileImage
                  ? `http://localhost:3000/uploads/${user.profileImage}` // Construir la URL completa
                  : "/default-profile.png" // Imagen por defecto
              }
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover"
            />




            <div className="ml-0">
              Bienvenido: {user?.nombres} {user?.apellidos} <br />
              {user?.cargo} <br />
              {user?.email}
            </div>
          </div>
        )}

        {/* Contenido de las rutas */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/tasks" element={<TaskPage />} />
              <Route path="/add-task" element={<TaskFormPage />} />
              <Route path="/task/:id" element={<TaskFormPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/search-tasks" element={<TaskSearchPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  )
}

export default App;
