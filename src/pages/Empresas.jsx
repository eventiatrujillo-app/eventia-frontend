import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import EmpresaCard from '../components/EmpresaCard';
import api from '../services/api';

function Empresas() {

  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    try {

      const response = await api.get('/empresas');

      setEmpresas(response.data.empresas);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto p-8">

        <h2 className="text-3xl font-bold mb-6">
          Proveedores
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {empresas.map((empresa) => (
            <EmpresaCard
              key={empresa.id}
              empresa={empresa}
            />
          ))}

        </div>

      </div>
    </>
  );
}

export default Empresas;