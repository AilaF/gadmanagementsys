<?php

namespace App\Http\Controllers;

use App\Models\EndUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EditProfileController extends Controller
{
    // Display the Home page with user data
   public function update(Request $request, $userID)
{
    $request->validate([
        'fname' => 'required|string|max:25',
        'lname' => 'required|string|max:25',
        'mname' => 'nullable|string|max:50',
        'dob' => 'nullable|date',
        'sex' => 'nullable|string|max:2',
        'contactNo' => 'nullable|string|max:12',
        'email' => 'nullable|string|max:25',
        'address' => 'nullable|string|max:25',
        'orgname' => 'nullable|string|max:50',
    ]);

    $user = \DB::table('enduser')->where('userID', $userID)->first();

    if (!$user) {
        return back()->with('error', 'User not found.');
    }

    \DB::table('enduser')->where('userID', $userID)->update([
        'fname' => $request->fname,
        'lname' => $request->lname,
        'mname' => $request->mname,
        'dob' => $request->dob,
        'sex' => $request->sex,
        'contactNo' => $request->contactNo,
        'email' => $request->email,
        'address' => $request->address,
        'orgname' => $request->orgname,
    ]);

 
}
}