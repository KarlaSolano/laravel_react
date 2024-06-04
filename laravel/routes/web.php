<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FormularioController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //Añadimos Rutas para formularios
    Route::post('/formulario', [FormularioController::class, 'store']);
    Route::get('/formulario', [FormularioController::class, 'index'])->name('formulario.index');

});

require __DIR__.'/auth.php';
require __DIR__.'/admin-auth.php'; //Agregar auth de admin
