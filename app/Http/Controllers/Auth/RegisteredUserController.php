<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\EndUser;

class RegisteredUserController extends Controller
{
    /**
     * Show the signup page
     */
    public function create()
    {
        return Inertia::render('auth/Register'); 
    }

    /**
     * Handle storing a new EndUser
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'fname'      => 'required|string|max:25',
            'lname'      => 'required|string|max:25',
            'mname'      => 'nullable|string|max:50',
            'email'      => 'required|email|unique:enduser,email',
            'password'   => 'required|string|min:6',
            'department' => 'required|string',
        ]);

        // 🔹 Logout any existing sessions first
        \Auth::guard('admin')->logout();
        \Auth::guard('evaluator')->logout();
        \Auth::guard('enduser')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // 🔹 Create a new EndUser
        $enduser = EndUser::create([
            'userID'     => 'UID_' . bin2hex(random_bytes(3)),
            'fname'      => $request->fname,
            'lname'      => $request->lname,
            'mname'      => $request->mname,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'department' => $request->department,
        ]);

        // 🔹 Login the new user with the correct guard
        \Auth::guard('enduser')->login($enduser);
        $request->session()->regenerate();

        // Redirect to dashboard
        return redirect()->route('enduser.home');
    }
}
