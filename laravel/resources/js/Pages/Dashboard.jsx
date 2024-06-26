import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid';

export default function Dashboard({ auth }) {
  const [fields, setFields] = useState([{ id: Date.now(), label: '', value: '', type: 'text' }]);
  const [archivo, setArchivo] = useState(null); // Estado para almacenar el archivo
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario
  const [editingFormulario, setEditingFormulario] = useState(null); // Estado para controlar la edición de formularios

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const actividades = fields.map(field => ({ label: field.label, value: field.type === 'file' ? field.value.name : field.value }));

    const formData = new FormData();
    
    actividades.forEach((actividad, index) => {
      formData.append(`actividades[${index}][label]`, actividad.label);
      formData.append(`actividades[${index}][value]`, actividad.value);
    });

    // Añadir el archivo al formData
    if (archivo) {
      formData.append('archivo', archivo);
    }

    try {
      let response;
      if (editingFormulario) {
        // Actualizar formulario existente
        response = await axios.post(`/formulario/${editingFormulario.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Crear nuevo formulario
        response = await axios.post('/formulario', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setFields([{ id: Date.now(), label: '', value: '', type: 'text' }]);
      setArchivo(null); // Resetear el archivo después de enviarlo

      // Actualizar la lista de formularios
      setFormularios(formularios.map(f => (f.id === response.data.id ? response.data : f)));
      setEditingFormulario(null);
      setShowForm(false);
      cargarFormularios();
    } catch (error) {
      setError('Error al enviar el formulario');
      console.error('Error al enviar el formulario:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/formulario/${id}`);
      setFormularios(formularios.filter(formulario => formulario.id !== id));
      alert('Formulario eliminado correctamente');
    } catch (error) {
      setError('Error al borrar el formulario');
      console.error('Error al borrar el formulario:', error);
      alert('Ocurrió un error al eliminar el formulario');
    }
  };
  
  const handform = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setEditingFormulario(null);
      setFields([{ id: Date.now(), label: '', value: '', type: 'text' }]);
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
              <div>
                <button
                  type="button"
                  onClick={handform}
                  className="ml-2 px-4 py-2 mb-4 bg-blue-500 text-white rounded"
                >
                  {showForm ? 'Ocultar Formulario' : 'Agregar Formulario'}
                </button>
                {showForm && (
                  <form id="Form" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap">
                      <div id="field" className="mb-2 border-4 rounded-md p-6 border-gray-500 w-full max-w-xl shadow-lg shadow-cyan-500/50 max-h-52">
                        <div className="max-h-40 overflow-auto focus:overscroll-contain">
                          {fields.map(field => (
                            <div key={field.id}>
                              <div className="flex flex-wrap p-2">
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
                      </div>
                      <div>
                        <div className="p-4">
                          <button
                            type="button"
                            onClick={() => addField('text')}
                            className="px-2 py-2 bg-blue-500 text-white rounded"
                          >
                            Añadir texto
                          </button>
                          <button
                            type="button"
                            onClick={() => addField('file')}
                            className="ml-4 px-2 py-2 bg-blue-500 text-white rounded"
                          >
                            Añadir campo de archivo
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      {editingFormulario ? 'Actualizar Formulario' : 'Guardar Formulario'}
                    </button>
                  </form>
                )}
              </div>

              {/* Mostrar la lista de formularios */}
              <div className="py-4">
                <h3 className="text-2xl font-bold text-gray-900 pb-8">Lista de Formularios</h3>
                <div className="max-h-lvh overflow-auto focus:overscroll-contain">
                  <ul className="grid grid-cols-4 gap-4 min-[320px]:text-center max-[768px]:grid-cols-1 ">
                    {formularios.map((formulario, index) => (
                     
                      <li className="group block rounded-lg p-6 bg-blue-50 ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-blue-400 hover:ring-sky-500 flex flex-col justify-between" key={index}>
                        <h2 className="h-6 w-6 stroke-sky-500 group-hover:text-white font-semibold">Formulario {formulario.id}</h2>
                        <div className="text-center py-2">
                          <p className="text-blue-950 texto-lg text-slate-500 group-hover:text-white">Fecha de creación:</p>{formulario.fecha}<br />
                          <p className="text-blue-950 texto-lg text-slate-500 group-hover:text-white">Contenido</p>
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
                        <div className="flex justify-end mt-4">
                        {/* <button
                            type="button"
                            onClick={() => handleEdit(formulario)}
                            className="px-2 py-2 bg-yellow-500 text-white rounded"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button> */}

                          <button
                            type="button"
                            onClick={() => handleDelete(formulario.id)}
                            className="px-2 py-2 bg-red-500 text-white rounded"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
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
