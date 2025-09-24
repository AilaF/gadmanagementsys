<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Evaluator extends Authenticatable
{
    use Notifiable;

    protected $table = 'evaluator'; // Make sure this matches your actual table name

    protected $primaryKey = 'evaluatorID'; // Adjust if different  
    public $incrementing = false; // Set to true if auto-incrementing
    protected $keyType = 'string'; // Change to 'int' if integer

    protected $fillable = [
        'evaluatorID', // Adjust based on your actual columns
        'fname',
        'lname', 
        'mname',
        'email',
        'password',
        // Add other columns as needed
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public $timestamps = false; // Set to true if you have created_at/updated_at

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}