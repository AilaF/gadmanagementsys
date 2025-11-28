<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DocumentController extends Controller
{

    public function index(Request $request)
    {
        $userID = Auth::guard('enduser')->user()->userID;

        $query = Document::where('userID', $userID)
            ->orderBy('dateSubmitted', 'desc');

        // Search filter
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'All') {
            $query->byStatus($request->status);
        }

        $documents = $query->get()->map(function ($doc) {
            return [
                'papsID' => $doc->papsID,
                'title' => $doc->title,
                'department' => $doc->department,
                'file_link' => $doc->file_link,
                'status' => $doc->status,
                'dateSubmitted' => $doc->formatted_date_submitted, 
                'date_needed' => $doc->formatted_date_needed,     
            ];
        });

        return Inertia::render('Dashboard/Home', [
            'auth' => ['user' => Auth::guard('enduser')->user()],
            'documents' => $documents,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'All',
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    // Store a new document
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:100',
            'file_link' => 'required|url|max:500',
            'date_needed' => 'required|date|after:today',
        ]);

        Document::create([
            'userID' => Auth::guard('enduser')->user()->userID,
            'title' => $validated['title'],
            'department' => $validated['department'],
            'file_link' => $validated['file_link'],
            'date_needed' => $validated['date_needed'],
        ]);

        return redirect()->route('dashboard')->with('success', 'Document submitted successfully!');
    }

    // Admin: View all submitted PAPS documents // -TADDED
    public function trackPaps()
    {
        // Fetch all PAPS with their related EndUser data
        $paps = Document::with('user')
            ->orderBy('dateSubmitted', 'desc')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->papsID,
                    'docNo' => $doc->papsID,
                    'title' => $doc->title,
                    'collegeUnit' => $doc->department ?? $doc->organization ?? 'N/A',
                    'dateSubmitted' => $doc->formatted_date_submitted,
                    'fileLink' => $doc->file_link,
                    'status' => ucfirst(strtolower($doc->status)),
                    'fullName' => optional($doc->user)->fname . ' ' . optional($doc->user)->lname,
                    'email' => optional($doc->user)->email,
                ];
            });

        // Fetch all Evaluators using the Evaluator model
        $evaluators = \App\Models\Evaluator::select(
            'evaluatorID as id',
            'fname',
            'lname',
            'email',
            'expertise',
            'department'
        )
        ->orderBy('lname', 'asc')
        ->get()
        ->map(function ($evaluator) {
            return [
                'id' => $evaluator->id,
                'name' => $evaluator->fname . ' ' . $evaluator->lname,
                'email' => $evaluator->email,
                'expertise' => $evaluator->expertise ?? 'N/A',
                'department' => $evaluator->department ?? 'N/A',
                'role' => 'Evaluator',
            ];
        });

        //Pass both PAPS and Evaluators to the frontend
        return Inertia::render('admin/trackpaps', [
            'paps' => $paps,
            'evaluators' => $evaluators,
        ]);
    } //PAPS

}
