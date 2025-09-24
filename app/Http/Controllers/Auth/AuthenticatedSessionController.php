<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/Login', [
            'status' => session('status'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        Log::info('Login attempt for: ' . $request->email);

        // Attempt login as Admin
        if (Auth::guard('admin')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            Log::info('Admin login successful for: ' . $request->email);
            return redirect()->route('admin.home');
        }

        // Attempt login as Evaluator
        if (Auth::guard('evaluator')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            Log::info('Evaluator login successful for: ' . $request->email);
            return redirect()->route('evaluator.home');
        }

        // Attempt login as Enduser
        if (Auth::guard('enduser')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            Log::info('Enduser login successful for: ' . $request->email);
            return redirect()->route('enduser.home');
        }

        // If all attempts fail
        Log::info('Login failed for: ' . $request->email);
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function destroy(Request $request)
    {
        // Determine which guard is currently authenticated and logout from that specific guard
        if (Auth::guard('admin')->check()) {
            Auth::guard('admin')->logout();
        } elseif (Auth::guard('evaluator')->check()) {
            Auth::guard('evaluator')->logout();
        } elseif (Auth::guard('enduser')->check()) {
            Auth::guard('enduser')->logout();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}