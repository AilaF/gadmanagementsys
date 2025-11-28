<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScoresheetVersion extends Model
{
    protected $table = 'ScoresheetVersions';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'versionID','itemID','adminID','dateAdministered'
    ];

    // existing relation (if present)
    public function sheet()
    {
        return $this->belongsTo(Scoresheet::class, 'itemID', 'itemID');
    }

    // add this alias so ->with('scoresheet') works
    public function scoresheet()
    {
        return $this->sheet();
    }
}
