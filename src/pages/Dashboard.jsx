import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

  const [form, setForm] = useState({
    nombre_empresa: '',
    descripcion: '',
    telefono: '',
    whatsapp: '',
    direccion: '',
    distrito: '',
    categoria: ''
  });

  useEffect(() => {
    cargarEmpresa();
  }, []);

  const cargarEmpresa = async () => {

    const response =
      await api.get('/empresas/mi-empresa');

    setForm(response.data.empresa);
  };

  const guardar = async (e) => {

    e.preventDefault();

    try {

      await api.put(
        '/empresas/mi-empresa',
        form
      );

      alert('Empresa actualizada');

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <div className="container mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Mi Empresa
      </h1>

      <form
        onSubmit={guardar}
        className="space-y-4"
      >

        <input
          className="border p-3 w-full"
          placeholder="Nombre empresa"
          value={form.nombre_empresa || ''}
          onChange={(e) =>
            setForm({
              ...form,
              nombre_empresa: e.target.value
            })
          }
        />

        <textarea
          className="border p-3 w-full"
          placeholder="Descripción"
          value={form.descripcion || ''}
          onChange={(e) =>
            setForm({
              ...form,
              descripcion: e.target.value
            })
          }
        />

        <input
          className="border p-3 w-full"
          placeholder="Teléfono"
          value={form.telefono || ''}
          onChange={(e) =>
            setForm({
              ...form,
              telefono: e.target.value
            })
          }
        />

        <button
          className="bg-red-600 text-white px-6 py-3 rounded"
        >
          Guardar cambios
        </button>

      </form>

    </div>
  );
}

export default Dashboard;