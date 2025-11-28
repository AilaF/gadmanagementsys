<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notification';
    protected $primaryKey = 'notifID';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'notifID',
        'recipientID',
        'recipientType',
        'message',
        'relatedPapsID',
        'dateSent',
        'isRead',
    ];

    public $timestamps = false; // because we manually use dateSent
}
