<?php

namespace App\Http\Controllers;

use App\Models\Evaluator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AddEvaluatorController extends Controller
{
    /**
     * Store multiple evaluator assignments for a single PAP.
     */
    public function store(Request $request)
    {
        // Validate inputs
        $validator = Validator::make($request->all(), [
            'fname'       => ['required', 'regex:/^[a-zA-Z\s\'-]{1,25}$/'],
            'lname'       => ['required', 'regex:/^[a-zA-Z\s\'-]{1,25}$/'],
            'dob'         => 'nullable|date',
            'sex'         => 'required|in:M,F',
            'contactNo'   => ['required', 'regex:/^\d{11}$/'],
            'email'       => 'required|email|max:50|unique:evaluator,email',
            'address'     => 'nullable|string|max:100',
            'expertise'   => 'nullable|string|max:50',
            'department'  => 'nullable|string|max:25',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        /** STEP 1: Generate the new Evaluator ID*/
        $year = now()->year;
        $lastEvaluator = Evaluator::where('evaluatorID', 'like', "EID{$year}-%")
            ->orderBy('evaluatorID', 'desc')
            ->first();

        if ($lastEvaluator) {
            $lastNumber = intval(substr($lastEvaluator->evaluatorID, -4));
        } else {
            $lastNumber = 0;
        }
        $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        $newEvaluatorID = "EID{$year}-{$newNumber}";

        $defaultPassword = $newEvaluatorID;

        /** STEP 2: Create evaluator record*/
        Evaluator::create([
            'evaluatorID' => $newEvaluatorID,
            'fname'       => trim($request->fname),
            'lname'       => trim($request->lname),
            'dob'         => $request->dob,
            'sex'         => strtoupper($request->sex),
            'contactNo'   => trim($request->contactNo),
            'email'       => strtolower(trim($request->email)),
            'address'     => trim($request->address),
            'expertise'   => trim($request->expertise),
            'department'  => trim($request->department),
            'password'    => Hash::make($defaultPassword),
            'date_joined' => now(),
        ]);

        /** STEP 4: Return success with new ID*/
        return back()->with('success', "Evaluator added successfully! ID: {$newEvaluatorID}");
    }
}
