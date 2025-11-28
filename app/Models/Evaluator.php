<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Evaluator extends Authenticatable
{
    use Notifiable;

    protected $table = 'evaluator'; // Make sure this matches your actual table name
    protected $guard = 'evaluator';
    protected $primaryKey = 'evaluatorID'; // Adjust if different  
    public $incrementing = false; // Set to true if auto-incrementing
    protected $keyType = 'string'; // Change to 'int' if integer

    protected $fillable = [
        'evaluatorID',
        'fname',
        'lname',
        'dob',
        'sex',
        'contactNo',
        'email',
        'address',
        'expertise',
        'department',
        'password',
        'last_active',
        'date_joined',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public $timestamps = false; // Set to true if you have created_at/updated_at

    protected $casts = [
        'dob'          => 'date', // check this if it has problems
        'last_active'  => 'datetime', // check this if it has problems
        'date_joined'  => 'datetime', // check this if it has problems
        'password'     => 'hashed', // Automatically hash on set
    ];
}