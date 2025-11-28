<?php

namespace App\Http\Controllers\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Show login page
     */
    public function create()
    {
        return Inertia::render('auth/Login');
    }

    /**
     * Handle login attempt
     */
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
        Log::info('Trying admin login...');
        if (Auth::guard('admin')->attempt($credentials, $remember)) {
            session(['auth_guard' => 'admin']);
            $request->session()->regenerate();            
            Log::info('Admin login successful for: ' . $request->email);
            return Inertia::location(route('admin.home')); // ✅ Fixed
        }

        // Attempt login as Evaluator
        Log::info('Trying evaluator login...');
        if (Auth::guard('evaluator')->attempt($credentials, $remember)) {            
            session(['auth_guard' => 'evaluator']);
            $request->session()->regenerate();
            Log::info('Evaluator login successful for: ' . $request->email);
            return Inertia::location(route('evaluator.home')); // ✅ Fixed
        }

        // Attempt login as Enduser
        Log::info('Trying enduser login...');
        
        // Debug: Check if enduser exists before auth attempt
        $enduserExists = \App\Models\EndUser::where('email', $request->email)->first();
        Log::info('Enduser exists in database: ' . ($enduserExists ? 'YES' : 'NO'));
        
        if ($enduserExists) {
            $passwordCheck = \Hash::check($request->password, $enduserExists->password);
            Log::info('Manual password check: ' . ($passwordCheck ? 'PASSED' : 'FAILED'));
        }
        
        $authAttempt = Auth::guard('enduser')->attempt($credentials, $remember);
        Log::info('Auth::guard(enduser)->attempt result: ' . ($authAttempt ? 'SUCCESS' : 'FAILED'));
        
        if ($authAttempt) {
            session(['auth_guard' => 'enduser']);
            $request->session()->regenerate();            
            Log::info('Enduser login successful for: ' . $request->email);
            
            // Check if user is actually authenticated after attempt
            $user = Auth::guard('enduser')->user();
            Log::info('Authenticated enduser after login: ' . ($user ? $user->email : 'null'));
            Log::info('Authenticated enduser ID: ' . ($user ? $user->getAuthIdentifier() : 'null'));
            
            // Check if route exists
            try {
                $routeUrl = route('enduser.home');
                Log::info('Enduser home route URL: ' . $routeUrl);
            } catch (\Exception $e) {
                Log::error('Route enduser.home not found: ' . $e->getMessage());
                return back()->withErrors(['email' => 'Configuration error: route not found']);
            }
            
            Log::info('About to redirect to: ' . $routeUrl);
            return Inertia::location(route('dashboard'));
        }

        // If all attempts fail
        Log::info('All login attempts failed for: ' . $request->email);
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Handle logout
     */
public function destroy(Request $request)
{
    foreach (['admin', 'evaluator', 'enduser', 'web'] as $guard) {
        if (Auth::guard($guard)->check()) {
            Auth::guard($guard)->logout();
        }
    }

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/login');
}

}
