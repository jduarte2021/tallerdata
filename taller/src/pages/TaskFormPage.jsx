import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTask } from "../context/TaskContext";
import { carBrands } from "../components/carBrands.jsx"
import axios from "axios";
import Swal from "sweetalert2";

function TaskFormPage() {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const { getTasks, updateTask, tasks, createTask } = useTask();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [customBrand, setCustomBrand] = useState("");
    const selectedBrand = watch("carBrand"); // Observar el valor de carBrand
    const [users, setUsers] = useState([]);


// Lógica para obtener usuarios al cargar el componente
useEffect(() => {
    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/users"); // Endpoint del backend
            setUsers(res.data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    fetchUsers(); // Llama a la función al montar el componente
}, []);


useEffect(() => {
    if (id) {
        if (tasks.length === 0) {
            getTasks();
        } else {
            const task = tasks.find((t) => t._id === id);
            if (task) {
                setValue("clientName", task.clientName);
                setValue("clientRUT", task.clientRUT);
                setValue("clientPhone", task.clientPhone);
                setValue("clientEmail", task.clientEmail);
                setValue("carPlate", task.carPlate);
                setValue("carBrand", task.carBrand || "");
                setValue("carModel", task.carModel);
                setValue("carColor", task.carColor);
                setValue("carDetails", task.carDetails);
                setValue("repairDescription", task.repairDescription);
                setValue("description", task.description);
                setValue("servicePrice", task.servicePrice);
                setValue("orderNumber", task.orderNumber || "");
            }
            setLoading(false);
        }
    } else {
        setLoading(false);
    }
}, [id, tasks, getTasks, setValue]);

const onSubmit = async (data) => {
    if (id) {
        await updateTask(id, data);
    } else {
        await createTask(data);
    }

    // Verifica si hay una ruta de retorno en el estado de navegación
    if (location.state?.returnTo) {
        navigate(location.state.returnTo); // Regresa a la ruta de búsqueda
    } else {
        navigate("/tasks"); // Si no hay ruta, redirige a /tasks
    }
};


if (loading) {
    return <p className="text-center mt-10">Cargando...</p>;
}

return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                {id ? "Editar Tarea" : "Crear Tarea"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Cliente
                    </label>
                    <input
                        type="text"
                        {...register("clientName", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Nombre del cliente"
                        onBlur={() => {
                            if (!watch("clientName")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete el nombre del cliente", "warning");
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        RUT del Cliente
                    </label>
                    <input
                        type="text"
                        {...register("clientRUT", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="RUT del cliente"
                        onBlur={() => {
                            if (!watch("clientRUT")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete el RUT del cliente", "warning");
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono del Cliente
                    </label>
                    <input
                        type="tel"
                        {...register("clientPhone", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Teléfono del cliente"
                        onBlur={() => {
                            if (!watch("clientPhone")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete el teléfono del cliente", "warning");
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo del Cliente
                    </label>
                    <input
                        type="email"
                        {...register("clientEmail", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Correo del cliente"
                        onBlur={() => {
                            if (!watch("clientEmail")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete el correo del cliente", "warning");
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Patente del Auto
                    </label>
                    <input
                        type="text"
                        {...register("carPlate", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Patente del auto"
                        onBlur={() => {
                            if (!watch("carPlate")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete la patente del auto", "warning");
                            }
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-2 text-gray-700">Marca del Auto</label>
                    <select
                        {...register("carBrand", { required: true })}
                        className="w-full p-2 border rounded text-gray-700"
                        onBlur={() => {
                            if (!watch("carBrand")) {
                                Swal.fire("Campo obligatorio", "Por favor, seleccione una marca del auto", "warning");
                            }
                        }}
                    >
                        <option value="">Selecciona una marca</option>
                        {carBrands.map((brand, index) => (
                            <option key={index} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedBrand === "Otro" && (
                    <div className="mb-4">
                        <label className="block mb-2 text-gray-700">Otra Marca</label>
                        <input
                            type="text"
                            placeholder="Escribe la marca"
                            value={customBrand}
                            onChange={(e) => setCustomBrand(e.target.value)}
                            className="w-full p-2 border rounded text-gray-700"
                            required
                            onBlur={() => {
                                if (!customBrand) {
                                    Swal.fire("Campo obligatorio", "Por favor, complete el nombre de la marca", "warning");
                                }
                            }}
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modelo del Auto
                    </label>
                    <input
                        type="text"
                        {...register("carModel", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Modelo del auto"
                        onBlur={() => {
                            if (!watch("carModel")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete el modelo del auto", "warning");
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color del Auto
                    </label>
                    <input
                        type="text"
                        {...register("carColor", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Color del auto"
                        onBlur={() => {
                            if (!watch("carColor")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete el color del auto", "warning");
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Detalles del Auto
                    </label>
                    <textarea
                        {...register("carDetails", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        rows="3"
                        placeholder="Detalles del auto"
                        onBlur={() => {
                            if (!watch("carDetails")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete los detalles del auto", "warning");
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción de Reparación
                    </label>
                    <textarea
                        {...register("repairDescription", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        rows="3"
                        placeholder="Descripción de la reparación"
                        onBlur={() => {
                            if (!watch("repairDescription")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete la descripción de la reparación", "warning");
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción General de la Tarea
                    </label>
                    <textarea
                        {...register("description", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        rows="4"
                        placeholder="Descripción de la tarea"
                        onBlur={() => {
                            if (!watch("description")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete la descripción general de la tarea", "warning");
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio del servicio (CLP)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Precio del servicio (CLP)"
                        {...register("servicePrice", {
                            required: "El precio del servicio es obligatorio",
                            min: { value: 0, message: "El precio no puede ser negativo" }
                        })}
                        className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onBlur={() => {
                            if (!watch("servicePrice")) {
                                Swal.fire("Campo obligatorio", "Por favor, complete el precio del servicio", "warning");
                            }
                        }}
                    />
                    {errors.servicePrice && (
                        <p className="text-red-500 mt-1">{errors.servicePrice.message}</p>
                    )}
                </div>


                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md transition duration-300"
                    >
                        {id ? "Actualizar Tarea" : "Crear Tarea"}
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asignar a Usuario
                    </label>
                    <select
                        {...register("assignedTo", { required: true })} // Registrar en react-hook-form
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        onBlur={() => {
                            if (!watch("assignedTo")) {
                                Swal.fire("Campo obligatorio", "Por favor, asigne un usuario", "warning");
                            }
                        }}
                    >
                        <option value="">Selecciona un usuario</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.username || user.email} {/* Mostrar username o email */}
                            </option>
                        ))}
                    </select>
                    {errors.assignedTo && (
                        <p className="text-red-500 mt-1">El usuario asignado es obligatorio</p>
                    )}
                </div>

            </form>
        </div>
    </div>
);

}

export default TaskFormPage;