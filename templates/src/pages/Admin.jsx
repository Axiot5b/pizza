import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Admin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", categoria: "", precio: "" });

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/pedidos/");
        setPedidos(res.data);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };

    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/productos/");
        setProductos(res.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    const fetchVentas = async () => {
      try {
        const res = await axios.get("http://localhost:8000/ventas/");
        setVentasDiarias(res.data);
      } catch (error) {
        console.error("Error al obtener ventas:", error);
      }
    };

    fetchPedidos();
    fetchProductos();
    fetchVentas();
  }, []);

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    try {
      const precio = parseFloat(nuevoProducto.precio);
      if (isNaN(precio)) {
        alert("Por favor, ingrese un precio válido.");
        return;
      }
      const res = await axios.post("http://localhost:8000/productos/", { ...nuevoProducto, precio });
      setProductos([...productos, res.data]);
      setNuevoProducto({ nombre: "", categoria: "", precio: "" });
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const handlePagarPedido = async (pedidoId) => {
    try {
      await axios.post("http://localhost:8000/pagar_pedido/", { pedido_id: pedidoId });
      setPedidos(pedidos.map(pedido =>
        pedido.id === pedidoId ? { ...pedido, estado: "pagado" } : pedido
      ));
      alert("Pedido pagado con éxito");
      await fetchVentas(); // Actualizar las ventas diarias
    } catch (error) {
      console.error("Error al pagar el pedido:", error);
      alert("Error al pagar el pedido");
    }
  };

  // Datos de la gráfica de ventas
  const ventasData = {
    labels: ventasDiarias.map((venta) => venta.fecha),
    datasets: [
      {
        label: "Total de Ventas ($)",
        data: ventasDiarias.map((venta) => venta.total),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-5">
        <h1 className="text-3xl font-bold mb-6 text-center">📊 Panel de Administración</h1>

        {/* 📊 Gráfico de Ventas */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-3">📈 Ventas Diarias</h2>
          <Bar data={ventasData} />
        </div>

        {/* 📌 Pedidos y Productos en Tabla */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-3">📦 Pedidos y Productos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">📝 Pedidos</th>
                  <th className="border p-2">🍕 Productos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 align-top">
                    <ul>
                      {pedidos.map((pedido) => (
                        <li key={pedido.id} className="border-b p-2 flex justify-between items-center">
                          <div>
                            <strong>Mesa {pedido.mesa_id}</strong> - {pedido.items} -
                            <span className="text-green-600">${pedido.total}</span>
                          </div>
                          <button
                            disabled={pedido.estado === "pagado"}
                            className={`px-4 py-2 rounded ${
                              pedido.estado === "pagado"
                                ? "bg-red-500 text-white cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                            onClick={() => handlePagarPedido(pedido.id)}
                          >
                            {pedido.estado === "pagado" ? "Pagado" : "Pagar"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border p-2 align-top">
                    <ul>
                      {productos.map((producto) => (
                        <li key={producto.id} className="border-b p-2">
                          <strong>{producto.nombre}</strong> - {producto.categoria} -
                          <span className="text-blue-600">${producto.precio.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ➕ Agregar Producto */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-3">➕ Agregar Producto</h2>
          <form onSubmit={handleAgregarProducto} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Nombre del Producto"
              value={nuevoProducto.nombre}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <select
              value={nuevoProducto.categoria}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
              className="border p-2 rounded"
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="bebida">Bebida</option>
              <option value="calzone">Calzone</option>
              <option value="pizza">Pizza</option>
              <option value="entrada">Entrada</option>
              <option value="postre">Postre</option>
              <option value="pasta">Pasta</option>
              <option value="brochetas">Brochetas</option>
              <option value="batidos">Batidos</option>
              <option value="asados">Asados</option>
              <option value="extra">Extra</option>
            </select>
            <input
              type="text"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Agregar Producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
