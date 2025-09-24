<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class EndUser extends Authenticatable
{
    use Notifiable;

    protected $table = 'enduser'; // lowercase table name

    protected $primaryKey = 'userID';
    public $incrementing = false; // primary key is varchar, not int
    protected $keyType = 'string';

    protected $fillable = [
        'userID',
        'fname',
        'lname',
        'mname',
        'dob',
        'sex',
        'contactNo',
        'email',
        'address',
        'orgname',
        'password',
        'profile_photo',
        'last_active',
        'date_joined',
    ];

    protected $hidden = [
        'password',
    ];

    public $timestamps = false; // no created_at / updated_at

    public function documents()
    {
        return $this->hasMany(Document::class, 'userID', 'userID');
    }

    public function getFullNameAttribute()
    {
        return trim($this->fname . ' ' . $this->mname . ' ' . $this->lname);
    }

}


