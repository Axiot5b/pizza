import { useState } from "react";
import axios from "axios";

const AgregarBebida = () => {
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [tamaño, setTamaño] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/bebidas/", {
        nombre,
        marca,
        tamaño,
        precio: parseFloat(precio),
      });
      alert("Bebida agregada con éxito");
    } catch (error) {
      console.error("Error al agregar la bebida:", error);
      alert("Error al agregar la bebida");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Agregar Bebida</h2>
      <div className="mb-2">
        <label className="block">Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Marca:</label>
        <input
          type="text"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Tamaño:</label>
        <select
          value={tamaño}
          onChange={(e) => setTamaño(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Selecciona un tamaño</option>
          <option value="lata">Lata</option>
          <option value="litro">Litro</option>
          <option value="medio litro">Medio Litro</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block">Precio:</label>
        <input
          type="number"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Agregar Bebida
      </button>
    </form>
  );
};

export default AgregarBebida;
