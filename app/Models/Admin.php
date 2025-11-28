<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use Notifiable;

    protected $table = 'admin'; // Make sure this matches your actual table name
    protected $guard = 'admin';
    protected $primaryKey = 'adminID'; // Adjust if different
    public $incrementing = false; // Set to true if auto-incrementing
    protected $keyType = 'string'; // Change to 'int' if integer

    protected $fillable = [
        'adminID', // Adjust based on your actual columns
        'fname',
        'lname',
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