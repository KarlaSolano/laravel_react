<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formulario extends Model
{
    use HasFactory;

    protected $fillable = [
        'fecha',
        'actividades',
        'user_id',
    ];

    protected $casts = [
        'actividades' => 'array',
    ];

    protected static function boot(){
        parent::boot();
        static::creating(function ($form) {
            $form->user_id = auth()->id();
        });
    }

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }
}
