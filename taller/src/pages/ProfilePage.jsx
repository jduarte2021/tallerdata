import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user, updateUserProfile } = useAuth(); // Desde el contexto
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    nombre: user?.nombres || "",
    apellido: user?.apellidos || "",
    email: user?.email || "",
    cargo: user?.cargo || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(); // FormData para manejar archivos
    data.append("nombre", formData.nombre);
    data.append("apellido", formData.apellido);
    data.append("email", formData.email);
    data.append("cargo", formData.cargo);

    if (profileImage) {
      data.append("profileImage", profileImage); // Agregar la imagen si existe
    }

    try {
      const res = await axios.put("/api/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      updateUserProfile(res.data); // Actualiza el contexto con los nuevos datos
      console.log("Perfil actualizado:", res.data);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };
  console.log("Profile image URL:", user?.profileImage);

  return (
    <div className="p-6">
      <h1 className="text-gray-700 font-bold mb-4 text-3xl">Perfil del Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-gray-600 font-bold text-pretty mb-0">Nombres</p>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full shadow-xl p-2 border rounded text-gray-700"
        />
        <p className="text-gray-600 font-bold text-pretty mb-0">Apellidos</p>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          className="w-full shadow-xl p-2 border rounded text-gray-700"
        />
        <p className="text-gray-600 font-bold text-pretty mb-0">Email</p>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled // El email no se puede editar
          className="w-full shadow-xl p-2 border rounded bg-gray-500"
        />
        <p className="text-gray-600 font-bold text-pretty mb-0">Cargo</p>
        <input
          type="text"
          name="cargo"
          value={formData.cargo}
          disabled
          className="w-full shadow-xl p-2 border rounded bg-gray-500"
        />
        <p className="text-gray-600 font-bold text-pretty mb-0">Foto de Perfil</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded text-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </form>
      {profileImage && (
        <div className="mt-4">
          <p className="text-gray-600 font-bold">Previsualización:</p>
          <img
            src={URL.createObjectURL(profileImage)}
            alt="Previsualización"
            className="w-32 h-32 object-cover rounded-full shadow-md"
          />
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
