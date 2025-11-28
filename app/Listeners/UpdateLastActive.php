<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;

class UpdateLastActive
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        // $event->user is the authenticated model (EndUser or Evaluator)
        if ($event->user) {
            // Update last_active without triggering other model observers
            $event->user->forceFill(['last_active' => now()])->save();
        }
    }
}
