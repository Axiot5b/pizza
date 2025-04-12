import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/login/", { nombre, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/mesas");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales incorrectas");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Iniciar Sesión</h1>
      <input
        className="border p-2 my-2 w-64"
        placeholder="Usuario"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        className="border p-2 my-2 w-64"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 w-64 my-2"
        onClick={handleLogin}
      >
        Entrar
      </button>

      {/* Enlace para registrarse */}
      <p className="mt-4 text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Registrarse
        </Link>
      </p>
    </div>
  );
};

export default Login;
