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
            'actividades.*' => 'required|string',
        ]);

          // Logging para depuración
        Log::info('Datos recibidos:', $validated);

        try {
            $date = Carbon::now();  
            $fecha = $date->format('Y-m-d');            
            $actividades = $request->actividades;
    
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

    //Método para actualizar el formulario
    public function edit(Request $request, $id){
        $validated = $request->validate([
            'actividades' => 'required|array',
            'actividades.*' => 'required|string',
        ]);

        try {
            $form = Formulario::findOrFail($id);
            $form->actividades = $validated['actividades'];
            $form->save();

            return redirect()->route('formulario.index')->with('success', 'Formulario actualizado exitosamente');
        } catch (\Exception $e) {
            Log::error('Error al actualizar el formulario:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al actualizar el formulario'], 500);
        }
    }

    //Método para eliminar el formulario
    public function destroy($id){
        try {
            $form = Formulario::findOrFail($id);
            $form->delete();

            return redirect()->route('formulario.index')->with('success', 'Formulario eliminado exitosamente');
        } catch (\Exception $e) {
            Log::error('Error al eliminar el formulario:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al eliminar el formulario'], 500);
        }
    }

}
