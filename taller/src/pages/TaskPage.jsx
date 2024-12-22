import { useTask } from "../context/TaskContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import html2pdf from "html2pdf.js";
import '../components/css/TaskPage.css';
import axios from 'axios';

function TaskPage() {
    const { getTasks, tasks, deleteTask } = useTask();
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");

    // Cargar tareas al montar el componente
    useEffect(() => {
        getTasks();
    }, []);

    // Manejar mensaje si no hay tareas disponibles
    if (!tasks.length) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-gray-500 text-xl">No hay tareas disponibles.</p>
            </div>
        );
    }

    // Filtrar y ordenar las tareas por fecha (más reciente a más antigua)
    const filteredTasks = tasks
        .filter((task) => {
            if (filter === "all") return true;
            return task.status === filter;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar por fecha descendente

    // Confirmar eliminación de tarea
    const handleDelete = (taskId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTask(taskId);
                Swal.fire(
                    'Eliminado',
                    'La tarea ha sido eliminada con éxito.',
                    'success'
                );
            }
        });
    };

    // Generar PDF de la tarea
    const generatePDF = (taskId) => {
        const element = document.getElementById(`task-${taskId}`);
        const buttons = element.querySelectorAll(".no-print");
        buttons.forEach((button) => (button.style.display = "none"));

        const options = {
            margin: 10,
            filename: `tarea_${taskId}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        html2pdf()
            .set(options)
            .from(element)
            .save()
            .then(() => {
                buttons.forEach((button) => (button.style.display = ""));
            });
    };

    // Marcar tarea como completada
    const handleCompleteTask = async (taskId) => {
        try {
            await axios.put(`/api/tasks/${taskId}/complete`);
            Swal.fire({
                title: "¡Completado!",
                text: "La tarea se marcó como completada.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            getTasks();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo marcar la tarea como completada.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
            console.error("Error al completar la tarea:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-5xl">
                {/* Filtro de tareas */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-l-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilter("en curso")}
                        className={`px-4 py-2 ${filter === "en curso" ? "bg-yellow-500 text-white" : "bg-gray-300"}`}
                    >
                        En curso
                    </button>
                    <button
                        onClick={() => setFilter("completada")}
                        className={`px-4 py-2 rounded-r-lg ${filter === "completada" ? "bg-green-500 text-white" : "bg-gray-300"}`}
                    >
                        Completadas
                    </button>
                </div>

                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Lista de Tareas</h1>

                {/* Contador de tareas */}
                <div className="text-center mb-4">
                    <p className="text-gray-600">
                        Total de tareas: <span className="font-bold">{tasks.length}</span> | Completadas:{" "}
                        <span className="font-bold text-green-600">
                            {tasks.filter((task) => task.status === "completada").length}
                        </span>
                    </p>
                </div>

                {/* Lista de tareas */}
                {filteredTasks.map((task) => (
                    <div
                        id={`task-${task._id}`}
                        key={task._id}
                        className={`p-6 rounded-lg shadow-lg border mb-8 
                        ${task.status === 'completada' ? 'bg-green-100 border-green-500' : 'bg-white border-gray-500'}`}
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

                        <div className="grid grid-cols-2 gap-x-4 divide-y divide-gray-300">
                            <div className="py-2 first:border-t-0">
                                <span className="font-medium text-gray-600">Nombre del cliente:</span>
                            </div>
                            <div className="py-2 first:border-t-0 text-left">
                                <span className="text-gray-800">{task.clientName}</span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">RUT del cliente:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">{task.clientRUT}</span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">Teléfono del cliente:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">{task.clientPhone}</span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">Correo del cliente:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">{task.clientEmail}</span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">Patente del auto:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">{task.carPlate}</span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">Marca del auto:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">{task.carBrand}</span>
                            </div>


                            <div className="py-2">
                                <span className="font-medium text-gray-600">Modelo del auto:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">{task.carModel}</span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">Color del auto:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">{task.carColor}</span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">Detalles del auto:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">{task.carDetails}</span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">Descripción de reparación:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">{task.repairDescription}</span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">Descripción general de la tarea:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">{task.description}</span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">Precio del servicio:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">
                                    {task.servicePrice !== undefined && !isNaN(task.servicePrice)
                                        ? `$${new Intl.NumberFormat("es-CL").format(task.servicePrice)} CLP`
                                        : "No disponible"}
                                </span>
                            </div>


                            <div className="py-2">
                                <span className="font-medium text-gray-600">Mecánico / Personal asignado:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">
                                    {task.assignedTo
                                        ? `${task.assignedTo.nombres} ${task.assignedTo.apellidos}`
                                        : "No asignado"}
                                </span>
                            </div>





                            <div className="py-2">
                                <span className="font-medium text-gray-600">Fecha de creación:</span>
                            </div>
                            <div className="py-2 text-left">
                                <span className="text-gray-800">
                                    {new Date(task.date).toLocaleString()}
                                </span>
                            </div>

                            <div className="py-2">
                                <span className="font-medium text-gray-600">Creado por: </span>
                            </div>
                            <div className="py-2 text-left text-gray-800">
                                {task.createdBy?.username || "Desconocido"}
                            </div>


                            {task.editedBy && (
                                <>
                                    <div className="py-2">
                                        <span className="font-medium text-gray-600">Editado por:</span>
                                    </div>
                                    <div className="py-2 text-left">
                                        <span className="text-gray-800">{task.editedBy.username}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => navigate(`/task/${task._id}`)}
                                className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 no-print"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(task._id)}
                                className="bg-red-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-600 no-print"
                            >
                                Borrar
                            </button>
                            <button
                                onClick={() => generatePDF(task._id)}
                                className="bg-green-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-green-600 no-print"
                            >
                                Descargar PDF
                            </button>
                            {task.status !== 'completada' && (
                                <button
                                    onClick={() => handleCompleteTask(task._id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 no-print"
                                >
                                    Marcar como Completada
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaskPage;
