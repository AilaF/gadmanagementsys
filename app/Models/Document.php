<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Document extends Model
{
    use HasFactory;

    protected $table = 'paps';
    protected $primaryKey = 'papsID';

    protected $fillable = [
        'userID',
        'title',
        'department',
        'file_link',
        'date_needed',
        'status',
        'dateSubmitted',
    ];

    protected $casts = [
        'date_needed' => 'date',
        'dateSubmitted' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationship with EndUser
    public function user()
    {
        return $this->belongsTo(EndUser::class, 'userID', 'userID');
    }

    // Accessor for formatted dateSubmitted
    public function getFormattedDateSubmittedAttribute()
    {
        return $this->dateSubmitted ? $this->dateSubmitted->format('M d, Y') : $this->created_at->format('M d, Y');
    }

    // Accessor for formatted date_needed
    public function getFormattedDateNeededAttribute()
    {
        return $this->date_needed ? $this->date_needed->format('M d, Y') : null;
    }

    // Automatically set default values
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($document) {
            if (!$document->status) {
                $document->status = 'UNASSIGNED';
            }
            if (!$document->dateSubmitted) {
                $document->dateSubmitted = now();
            }
        });
    }

    // Scope for filtering by status
    public function scopeByStatus($query, $status)
    {
        return match($status) {
            'Completed' => $query->where('status', 'COMPLETED'),
            'Pending' => $query->whereIn('status', ['PENDING', 'UNASSIGNED']),
            default => $query,
        };
    }

    // Scope for searching by title
    public function scopeSearch($query, $search)
    {
        return $search ? $query->where('title', 'like', "%{$search}%") : $query;
    }
}
