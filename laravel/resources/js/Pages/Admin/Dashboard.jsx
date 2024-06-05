import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Dashboard({ auth }) {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fecha, setFecha] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    cargarFormularios();
  }, []);

  const cargarFormularios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/formulario/list');
      setFormularios(response.data);
    } catch (error) {
      setError('Error al cargar los formularios');
      console.error('Error al cargar los formularios:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarFormularios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/formulario/search', {
        params: {
          fecha: fecha,
          user_id: userId,
        },
      });
      setFormularios(response.data);
    } catch (error) {
      setError('Error al buscar los formularios');
      console.error('Error al buscar los formularios:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Administrador</h2>}
    >
      <Head title="Dashboard" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="py-4">
                <h3 className="text-2xl font-bold text-gray-900 pb-8">Lista de Formularios</h3>

                {/* Filtros de búsqueda */}
              <div className="mb-4">
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                  Fecha
                </label>
                <input
                  type="date"
                  id="fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mt-4">
                  Usuario
                </label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="ID del Usuario"
                />
                <button
                  type="button"
                  onClick={buscarFormularios}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Buscar
                </button>
              </div> 
                <div className="max-h-lvh overflow-auto focus:overscroll-contain">
                <ul className='grid grid-cols-4 gap-4 min-[320px]:text-center max-[768px]:grid-cols-1'>
                    {formularios.map((formulario, index) => (
                      <li className='group block rounded-lg p-6 bg-blue-50 ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-blue-400 hover:ring-sky-500' key={index}>
                        <h2 className="h-6 w-6 stroke-sky-500 group-hover:text-white font-semibold">Formulario {formulario.id}</h2>
                        <div className='text-center py-2'>
                          <p className='text-blue-950 texto-lg text-slate-500  group-hover:text-white'>Fecha de creación:</p>{formulario.fecha}<br></br>
                          <p className='text-blue-950 texto-lg text-slate-500 group-hover:text-white'>Contenido</p>
                          {formulario.actividades ? (
                            JSON.parse(formulario.actividades).map((actividad, index) => (
                              <p key={index}>
                                <strong>{actividad.label}:</strong> {actividad.value}
                              </p>
                            ))
                          ) : (
                            <p>No hay actividades</p>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
