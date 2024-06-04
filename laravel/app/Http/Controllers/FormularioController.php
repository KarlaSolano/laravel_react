<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Formulario;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class FormularioController extends Controller
{
    //Método para enlistar todos los formularios
    public function index(){
        $formularios = Formulario::latest()->get();
        return response()->json($formularios);
    }

    // Mostrar formulario de creación
    public function create(){
        return view('crearFormulario');
    }

    //Método para guardar el formulario
    public function store(Request $request){
        $validated = $request->validate([
            'actividades' => 'required|array',
            'actividades.*.label' => 'required|string',
            'actividades.*.value' => 'required|string',
        ]);

        // Logging para depuración
        Log::info('Datos recibidos:', $validated);

        try {
            $date = Carbon::now();  
            $fecha = $date->format('Y-m-d');            
            $actividades = $request->input('actividades');

            // Almacenamiento de archivos
            foreach ($actividades as &$actividad) {
                if (isset($actividad['type']) && $actividad['type'] === 'file') {
                    $archivo = $actividad['value'];
                    $archivoNombre = $archivo->getClientOriginalName();
                    $archivo->storeAs('archivos', $archivoNombre);
                    $actividad['value'] = $archivoNombre;
                }
            }

            $form = new Formulario();
            $form->fecha = $fecha;
            $form->actividades = json_encode($actividades);
            $form->save();

            return redirect()->route('formulario.index')->with('success', 'Formulario creado exitosamente');
        } catch (\Exception $e) {
            \Log::error('Error al guardar el Formulario:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Ocurrió un error al crear el formulario'], 500);
        }
    }

}
