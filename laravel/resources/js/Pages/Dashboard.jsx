import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

export default function Dashboard({ auth }) {
  const [fields, setFields] = useState([{ id: Date.now(), label: '', value: '', type: 'text' }]);
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    cargarFormularios();
  }, []);

  const cargarFormularios = async () => {
    try {
      const response = await axios.get('/formulario');
      setFormularios(response.data);
    } catch (error) {
      setError('Error al cargar los formularios');
      console.error('Error al cargar los formularios:', error);
    } finally {
      setLoading(false);
    }
  };

  const addField = (type) => setFields([...fields, { id: Date.now(), label: '', value: '', type }]);

  const removeField = (id) => setFields(fields.filter(field => field.id !== id));

  const handleFieldChange = (id, fieldName, value) => setFields(fields.map(field => field.id === id ? { ...field, [fieldName]: value } : field));

  const handleSubmit = async () => {
    const actividades = fields.map(field => ({ label: field.label, value: field.value }));
    const data = { actividades };

    try {
      const response = await axios.post('/formulario', data); // Asegúrate de que la URL coincida con tu ruta
      setFields([{ id: Date.now(), label: '', value: '', type: 'text' }]);

      
      // Agregar el nuevo formulario a la lista
      setFormularios([...formularios, response.data]);
      cargarFormularios();
    } catch (error) {
      setError('Error al enviar el formulario');
      console.error('Error al enviar el formulario:', error);
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
      header={<h2 className="font-semibold text-3xl text-gray-800 leading-tight">Formularios</h2>}
    >
      <Head title="Inicio" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h3 className="text-2xl font-medium text-gray-900 p-4">Crear Formulario</h3>
              <div>
                <div className='flex flex-wrap'>
                  <div id="field" className="mb-2 border-4 rounded-md p-6 border-sky-500 w-full max-w-lg shadow-lg shadow-cyan-500/50">
                    {fields.map(field => (
                      <div key={field.id} className="">
                        <div className='flex flex-wrap p-2'>
                          <label htmlFor={`name-${field.id}`}>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                              className="mr-2 p-1 border rounded"
                              placeholder="Nombre de la etiqueta"
                            />
                          </label>
                          {field.type === 'text' ? (
                            <input
                              type="text"
                              value={field.value}
                              onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                              className="mr-2 p-1 border rounded"
                              placeholder="Valor"
                            />
                          ) : (
                            <input
                              type="file"
                              onChange={(e) => handleFieldChange(field.id, 'value', e.target.files[0])}
                              className="mr-2 p-1 border rounded"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeField(field.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded"
                          >
                            Borrar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className='p-4'>
                      <button
                        type="button"
                        onClick={() => addField('text')}
                        className="px-2 py-2 bg-blue-500 text-white rounded"
                      >
                        Añadir texto
                      </button>
                      {/* <button
                        type="button"
                        onClick={() => addField('file')}
                        className="ml-4 px-2 py-2 bg-blue-500 text-white rounded"
                      >
                        Añadir campo de archivo
                      </button> */}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                  Agregar Formulario
                </button>
              </div>

              {/* Mostrar la lista de formularios */}
              <div className="py-4">
                <h3 className="text-2xl font-bold text-gray-900 pb-8">Lista de Formularios</h3>
                <ul className='grid grid-cols-4 gap-4 min-[320px]:text-center max-[768px]:grid-cols-1'>
                  {formularios.map((formulario, index) => (
                    <li className='border-4 rounded-md p-6 border-y-sky-500' key={index}>
                      <h2 className="text-xl font-medium text-gray-900 text-center">Formulario {formulario.id}</h2>
                      <div className='text-center py-2'>
                        <p className='text-blue-950 texto-lg'>Fecha de creación:</p>{formulario.fecha}<br></br>
                        <p className='text-blue-950 texto-lg '>Contenido</p>
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
    </AuthenticatedLayout>
  );
}
