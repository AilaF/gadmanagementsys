<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'lname' => 'required|string|max:25',
            'fname' => 'required|string|max:25',
            'mname' => 'nullable|string|max:50',
            'email' => 'required|email|max:25',
            'orgname' => 'nullable|string|max:25',
            'password' => 'nullable|min:8|confirmed',
        ]);

        $user->update([
            'lname' => $request->lname,
            'fname' => $request->fname,
            'mname' => $request->mname,
            'email' => $request->email,
            'orgname' => $request->orgname,
            'password' => $request->filled('password')
                ? Hash::make($request->password)
                : $user->password,
        ]);

        return redirect()->route('profile')->with('success', 'Profile updated successfully!');
    }
}
