<?php

use App\Models\Notification;
use Illuminate\Support\Str;

if (!function_exists('sendNotification')) {
    function sendNotification($recipientID, $recipientType, $message, $relatedPapsID = null)
    {

        Notification::create([
            'notifID' => Str::random(10),
            'recipientID' => $recipientID,
            'recipientType' => $recipientType,
            'message' => $message,
            'relatedPapsID' => $relatedPapsID,
            'dateSent' => now(),
            'isRead' => false,
        ]);
    }
}
