import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { handleCompleteTask, generatePDF, handleDelete } from "../utils/taskUtils.jsx";


function TaskSearchPage() {
    const [carPlate, setCarPlate] = useState("");
    const [nombres, setNombres] = useState("");
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Cargar búsqueda previa de sessionStorage
    useEffect(() => {
        const searchParams = JSON.parse(sessionStorage.getItem("taskSearchParams"));
        if (searchParams) {
            if (searchParams.type === "plate") {
                setCarPlate(searchParams.value);
                handleSearchByPlate(searchParams.value);
            } else if (searchParams.type === "name") {
                setNombres(searchParams.value);
                handleSearchByName(searchParams.value);
            }
        }
    }, []);

    // Función para obtener tareas desde el servidor
    const getTasks = async () => {
        try {
            const response = await axios.get(`/api/tasks/search?carPlate=${carPlate.trim().toUpperCase()}`);
            setTasks(response.data);
        } catch (error) {
            console.error("Error al obtener las tareas:", error);
        }
    };

    // Función para eliminar una tarea del servidor
    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`/api/tasks/${taskId}`);
            Swal.fire("Eliminado", "La tarea ha sido eliminada con éxito.", "success");
        } catch (error) {
            Swal.fire("Error", "No se pudo eliminar la tarea.", "error");
            console.error("Error al eliminar la tarea:", error);
        }
    };



    // Búsqueda por patente
    const handleSearchByPlate = async (plate = carPlate.trim().toUpperCase()) => {
        try {
            const response = await axios.get(`/api/tasks/search?carPlate=${plate}`);
            setTasks(response.data);
            setError("");
            sessionStorage.setItem("taskSearchParams", JSON.stringify({ type: "plate", value: plate }));
        } catch {
            setError("No se encontraron tareas por patente.");
            setTasks([]);
        }
    };

    // Búsqueda por nombre
    const handleSearchByName = async (name = nombres.trim()) => {
        try {
            const encodedName = encodeURIComponent(name);
            const response = await axios.get(`/api/tasks/search/name?clientName=${encodedName}`);
            setTasks(response.data);
            setError("");
            sessionStorage.setItem("taskSearchParams", JSON.stringify({ type: "name", value: name }));
        } catch {
            setError("No se encontraron tareas por nombre.");
            setTasks([]);
        }
    };



    // Editar tarea
    const handleEdit = (taskId) => {
        navigate(`/task/${taskId}`, {
            state: { returnTo: "/search-tasks" } // Guarda la ruta de retorno
        });
    };


    // Limpiar búsqueda con confirmación
    const handleClearSearch = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Se borrarán los resultados de búsqueda.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, limpiar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Limpiar estados y sessionStorage
                setCarPlate("");
                setNombres("");
                setTasks([]);
                setError("");
                sessionStorage.removeItem("taskSearchParams");

                // Mostrar mensaje de éxito
                Swal.fire({
                    title: "¡Búsqueda limpia!",
                    text: "Se han eliminado los resultados de búsqueda.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                });
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Buscar Tareas</h1>

            {/* Búsqueda por Patente */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    value={carPlate}
                    onChange={(e) => setCarPlate(e.target.value)}
                    placeholder="Buscar por patente"
                    className="text-gray-800 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => handleSearchByPlate()}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Buscar
                </button>
            </div>

            {/* Búsqueda por Nombre */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    placeholder="Buscar por nombre"
                    className="text-gray-800 px-4 py-2 border rounded focus:ring-2 focus:ring-green-500"
                />
                <button
                    onClick={() => handleSearchByName()}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Buscar
                </button>
            </div>

            {/* Botón para limpiar búsqueda */}
            <button
                onClick={handleClearSearch}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-6"
            >
                Limpiar Búsqueda
            </button>

            {/* Mostrar Tareas */}
            {tasks.length > 0 && (
                <div className="w-full max-w-5xl">
                    {tasks.map((task) => (
                        <div
                            id={`task-${task._id}`}
                            key={task._id}
                            className={`p-6 rounded-lg shadow-lg border mb-8 ${task.status === "completada" ? "bg-green-100 border-green-500" : "bg-white border-gray-300"
                                }`}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                Orden de trabajo: <span className="font-normal">{task.orderNumber}</span>
                                {task.status === 'completada' && (
                                    <span className="ml-4 text-green-600 font-medium">✔ Completada</span>
                                )}
                                {task.status === 'en curso' && (
                                    <span className="ml-4 text-yellow-600 font-medium">⏳ En curso</span>
                                )}
                            </h2>

                            {/* Detalles */}
                            <div className="grid grid-cols-2 gap-x-4 divide-y divide-gray-300">
                                <div className="py-2 text-gray-800"><strong>Cliente:</strong> {task.clientName}</div>
                                <div className="py-2 text-gray-800"><strong>Patente:</strong> {task.carPlate}</div>
                                <div className="py-2 text-gray-800"><strong>Modelo:</strong> {task.carModel}</div>
                                <div className="py-2 text-gray-800"><strong>Marca:</strong> {task.carBrand}</div>
                                <div className="py-2 text-gray-800"><strong>Color:</strong> {task.carColor}</div>
                                <div className="py-2 text-gray-800"><strong>Teléfono:</strong> {task.clientPhone}</div>
                                <div className="py-2 text-gray-800"><strong>Correo:</strong> {task.clientEmail}</div>
                                <div className="py-2 text-gray-800"><strong>Descripción:</strong> {task.description}</div>
                            </div>

                            {/* Botones */}
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => handleEdit(task._id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(task._id, deleteTask, setTasks, tasks)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Borrar
                                </button>
                                <button
                                    onClick={() => generatePDF(task._id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Descargar PDF
                                </button>
                                {task.status !== 'completada' && (
                                    <button
                                        onClick={() => handleCompleteTask(task._id, getTasks)}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 no-print"
                                    >
                                        Marcar como Completada
                                    </button>

                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}

export default TaskSearchPage;
