import { useState } from "react";
import axios from "axios";

const AgregarPizza = () => {
  const [nombre, setNombre] = useState("");
  const [tamaño, setTamaño] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/pizzas/", {
        nombre,
        tamaño,
        precio: parseFloat(precio),
      });
      alert("Pizza agregada con éxito");
    } catch (error) {
      console.error("Error al agregar la pizza:", error);
      alert("Error al agregar la pizza");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Agregar Pizza</h2>
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
        <label className="block">Tamaño:</label>
        <select
          value={tamaño}
          onChange={(e) => setTamaño(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Selecciona un tamaño</option>
          <option value="8 pulgadas">8 Pulgadas</option>
          <option value="12 pulgadas">12 Pulgadas</option>
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
        Agregar Pizza
      </button>
    </form>
  );
};

export default AgregarPizza;
