<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureAuthenticatedWithGuard
{
    /**
     * Handle an incoming request.
     * Example usage: ->middleware('auth.guard:admin')
     */
public function handle(Request $request, Closure $next, $guard = null)
{
    $guard = $guard ?: 'web';
    $activeGuard = session('auth_guard'); // your login controller sets this

    // If the current session guard doesn't match, force logout and redirect
    if ($activeGuard !== $guard) {
        foreach (['admin', 'evaluator', 'enduser', 'web'] as $g) {
            Auth::guard($g)->logout();
        }
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    if (!Auth::guard($guard)->check()) {
        if (!$request->expectsJson()) {
            return redirect()->route('login');
        }
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }

    return $next($request);
}

}
