import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from '../components/logo.jsx'

function LoginPage() {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { signin, errors: signinErrors } = useAuth();
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signin(data); // Intenta hacer login
            navigate("/tasks"); // Redirige a /tasks si el login es exitoso
        } catch (error) {
            console.error("Error al iniciar sesión:", error.message);
        }
    });

    return (
        <div className="items-center justify-center">
            <span><Logo /></span>
            <div className="flex h-[calc(100vh-200px)] items-center justify-center bg-white">
                <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
                    {
                        signinErrors.map((error, i) => (
                            <div className="bg-red-500 p-2 text-white text-center my-2" key={i}>
                                {error}
                            </div>
                        ))
                    }

                    <h1 className="text-2xl font bold">Inicio de Sesión</h1>

                    {/* formulario  de login */}

                    <form onSubmit={onSubmit}>

                        <input type="email" {...register("email", { required: true })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                            placeholder='Email'
                        />
                        {errors.email && <p className='text-red-500'> Email es requerido</p>}



                        <input type="password" {...register("password", { required: true })}
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                            placeholder='Password'
                        />
                        {errors.password && <p className='text-red-500'> Password es requerido</p>}


                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="submit">Iniciar Sesión</button>
                    </form>
                    <p className="flex gap-x-2 justify-between">¿No tienes una cuenta? <Link to="/register" className="text-sky-500">Registro</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;