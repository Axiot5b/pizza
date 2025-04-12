import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Mesas = () => {
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [pedido, setPedido] = useState({
    mesa_id: null,
    items: {} // Usamos un objeto para almacenar la cantidad de cada producto
  });
  const [productos, setProductos] = useState([]);

  const mesas = [1, 2, 3, 4, 5]; // Números de las mesas

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/productos/");
        setProductos(res.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleSeleccionarMesa = (mesa) => {
    setSelectedMesa(mesa);
    setPedido({ ...pedido, mesa_id: mesa });
  };

  const agregarItem = (item) => {
    setPedido((prevPedido) => {
      const newItems = { ...prevPedido.items };
      newItems[item.id] = (newItems[item.id] || 0) + 1; // Incrementar el contador del producto
      return { ...prevPedido, items: newItems };
    });
  };

  const handleSubmitPedido = async (e) => {
    e.preventDefault();
    try {
      const itemsArray = Object.keys(pedido.items).map((itemId) => {
        const item = productos.find((p) => p.id === parseInt(itemId));
        return `${item.categoria}: ${item.nombre} x${pedido.items[itemId]}`;
      });

      const total = Object.keys(pedido.items).reduce((acc, itemId) => {
        const item = productos.find((p) => p.id === parseInt(itemId));
        return acc + item.precio * pedido.items[itemId];
      }, 0);

      const response = await axios.post("http://localhost:8000/pedidos/", {
        mesa_id: pedido.mesa_id,
        items: itemsArray,
        total: total
      });
      alert("Pedido realizado con éxito");
      setPedido({ mesa_id: null, items: {} });
      setSelectedMesa(null);
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
      alert("Error al realizar el pedido");
    }
  };

  const categorias = [...new Set(productos.map(producto => producto.categoria))];

  return (
    <div>
      <Navbar />
      <div className="p-5">
        <h1 className="text-3xl font-bold mb-4">Mesas Disponibles</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mesas.map((mesa) => (
            <div
              key={mesa}
              className="border p-4 rounded shadow flex flex-col items-center bg-white"
            >
              <h2 className="text-xl font-semibold">Mesa {mesa}</h2>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleSeleccionarMesa(mesa)}
              >
                Seleccionar Mesa
              </button>
            </div>
          ))}
        </div>

        {selectedMesa && (
          <div className="mt-8 p-4 border rounded shadow bg-white">
            <h2 className="text-xl font-semibold mb-4">Agregar Pedido para Mesa {selectedMesa}</h2>
            <form onSubmit={handleSubmitPedido}>
              {categorias.map((categoria) => (
                <div key={categoria} className="mb-4">
                  <label className="block mb-2 font-semibold">{categoria}:</label>
                  <div className="flex flex-wrap gap-2">
                    {productos
                      .filter(producto => producto.categoria === categoria)
                      .map((producto) => (
                        <button
                          key={producto.id}
                          type="button"
                          className="border p-2 rounded bg-gray-200 hover:bg-gray-300"
                          onClick={() => agregarItem(producto)}
                        >
                          {producto.nombre} - ${producto.precio.toFixed(2)}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Pedido Actual:</h3>
                <ul>
                  {Object.keys(pedido.items).map((itemId) => {
                    const item = productos.find((p) => p.id === parseInt(itemId));
                    return (
                      <li key={itemId} className="border p-2 my-2">
                        {item.nombre} x{pedido.items[itemId]} - ${(item.precio * pedido.items[itemId]).toFixed(2)}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Agregar Pedido
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mesas;
