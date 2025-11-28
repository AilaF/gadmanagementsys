<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scoresheet extends Model
{
    protected $table = 'Scoresheet';
    public $incrementing = false;
    public $timestamps = false;

    protected $primaryKey = 'itemID';
    protected $keyType = 'string';

    protected $fillable = [
        'itemID', 'item', 'subitem', 'yesValue', 'noValue', 'partlyValue', 'adminID'
    ];
}
