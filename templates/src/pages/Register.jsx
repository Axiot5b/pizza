import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("mesero");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:8000/register/", {
        nombre,
        password,
        rol
      }, {
        headers: { "Content-Type": "application/json" }  // 🔹 Asegurar que enviamos JSON
      });
  
      alert("Usuario registrado, inicia sesión.");
      navigate("/login");
    } catch (error) {
      console.error("Error detallado:", error);
      alert("Error al registrar. Verifica los datos.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl">Registro</h1>
      <input className="border p-2 my-2" placeholder="Usuario" onChange={(e) => setNombre(e.target.value)} />
      <input className="border p-2 my-2" type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
      <select className="border p-2 my-2" onChange={(e) => setRol(e.target.value)}>
        <option value="mesero">Mesero</option>
        <option value="admin">Admin</option>
      </select>
      <button className="bg-green-500 text-white px-4 py-2" onClick={handleRegister}>Registrar</button>
    </div>
  );
};

export default Register;
