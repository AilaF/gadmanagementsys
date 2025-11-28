<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class UpdateLastActive
{
    public function handle($request, Closure $next)
    {
        // EndUser guard
        if (Auth::guard('enduser')->check()) {
            $user = Auth::guard('enduser')->user();
            $user->forceFill(['last_active' => now()])->save();
        }

        // Evaluator guard
        if (Auth::guard('evaluator')->check()) {
            $evaluator = Auth::guard('evaluator')->user();
            $evaluator->forceFill(['last_active' => now()])->save();
        }

        return $next($request);
    }
}
