<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Fetch notifications for a specific recipient.
     */
    public function index($recipientID, $recipientType)
    {
        try {
            $notifications = Notification::where('recipientID', $recipientID)
                ->where('recipientType', $recipientType)
                ->orderBy('dateSent', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $notifications
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching notifications: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch notifications.'
            ], 500);
        }
    }

    /**
     * Mark all notifications as read for a user.
     */
    public function markAllAsRead($recipientID, $recipientType)
    {
        try {
            $updatedCount = Notification::where('recipientID', $recipientID)
                ->where('recipientType', $recipientType)
                ->where('isRead', false)
                ->update(['isRead' => true]);

            return response()->json([
                'success' => true,
                'message' => "{$updatedCount} notifications marked as read."
            ]);
        } catch (\Exception $e) {
            Log::error('Error marking notifications as read: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to update notifications.'
            ], 500);
        }
    }
}
