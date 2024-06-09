<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Formulario;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class FormularioController extends Controller
{
    //Método para enlistar todos los formularios
    public function index(){
        $user_id = auth()->id();
        $formularios =  Formulario::where('user_id', $user_id)->latest()->get();
        return response()->json($formularios);
    }

    //Método para enlistar todos los formularios
    public function list(){
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
            'archivo' => 'nullable|file|mimes:pdf|max:2048', 
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
            
            if ($request->hasFile('archivo')) {
                $archivoPdf = $request->file('archivo');
                $archivoPdfNombre = $archivoPdf->getClientOriginalName();
                $archivoPdf->storeAs('archivos', $archivoPdfNombre);
            $form->archivo = $archivoPdfNombre;
                $form->archivo = $archivoPdfNombre;
            }
            $form->save();

            return redirect()->route('formulario.index')->with('success', 'Formulario creado exitosamente');
        } catch (\Exception $e) {
            \Log::error('Error al guardar el Formulario:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Ocurrió un error al crear el formulario'], 500);
        }
    }

    // Método de búsqueda para filtrar formularios por fecha y usuario
    public function search(Request $request){
        $query = Formulario::query();

        if ($request->has('fecha')) {
            $query->whereDate('fecha', $request->input('fecha'));
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $formularios = $query->latest()->get();
        return response()->json($formularios);
    }

}
