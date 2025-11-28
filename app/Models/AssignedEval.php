<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class AssignedEval extends Model
{
    use HasFactory;

    protected $table = 'assignedeval';
    protected $primaryKey = 'assignID';
    public $timestamps = true;
    protected $fillable = [
        'evaluatorID',
        'papsID',
        'adminID',
    ];

    // Relationships
    public function evaluator()
    {
        return $this->belongsTo(Evaluator::class, 'evaluatorID', 'evaluatorID');
    }

    public function document()
    {
        return $this->belongsTo(Document::class, 'papsID', 'papsID');
    }

    // Compatibility alias so existing code using "paps" keeps working
    public function paps()
    {
        return $this->document();
    }    
        
}
