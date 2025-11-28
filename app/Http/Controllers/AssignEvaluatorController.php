<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AssignedEval;
use App\Models\Document;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AssignEvaluatorController extends Controller
{
    /**
     * Store multiple evaluator assignments for a single PAP.
     */
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'papsID' => 'required|integer|exists:paps,papsID',
            'evaluatorIDs' => 'required|array|min:3',
            'evaluatorIDs.*' => 'string|exists:evaluator,evaluatorID',
        ]);

        // Get logged-in admin ID or fallback
        $adminID = Auth::guard('admin')->id() ?? 'AID2025-0001';

        // Use transaction to ensure assignments + status update are atomic
        DB::transaction(function () use ($validated, $adminID) {
            foreach ($validated['evaluatorIDs'] as $evaluatorID) {
                AssignedEval::updateOrCreate(
                    [
                        'papsID' => $validated['papsID'],
                        'evaluatorID' => $evaluatorID,
                    ],
                    [
                        'adminID' => $adminID,
                    ]
                );
            }

            // After assignments created/updated, mark the PAP/document status
            // as FOR EVALUATION so UI and evaluators see it.
            Document::where('papsID', $validated['papsID'])
                ->update(['status' => 'FOR EVALUATION']);
        });

        return back()->with('success', 'Evaluators successfully assigned to PAP and status updated.');
    }


 public function evaluatorDashboard()
    {
        $evaluator = Auth::guard('evaluator')->user();

        if (!$evaluator) {
            return redirect()->route('evaluator.login')->with('error', 'Please log in first.');
        }

        $assignedPaps = AssignedEval::with('document')
            ->where('evaluatorID', $evaluator->evaluatorID)
            ->get()
            ->map(function ($assigned) {
                return [
                    'papsID' => $assigned->paps->papsID ?? null,
                    'title' => $assigned->paps->title ?? 'Untitled',
                    'college' => $assigned->paps->college ?? 'N/A',
                    'dateSubmitted' => $assign->document->dateSubmitted ?? null,
                    'status' => $assigned->paps->status ?? 'UNASSIGNED ',
                ];
            });

        return inertia('evaluator/home', [
            'assignedPaps' => $assignedPaps,
        ]);
    }


public function showEvaluatorDashboard()
    {
        $evaluatorID = auth()->guard('evaluator')->user()->evaluatorID ?? null;

        if (!$evaluatorID) {
            return redirect()->route('evaluator.login')->with('error', 'Please log in first.');
        }

        // Get all assigned PAPs (documents)
        $assignedPaps = AssignedEval::where('evaluatorID', $evaluatorID)
            ->with(['document' => function ($query) {
                $query->select('papsID', 'title', 'department', 'dateSubmitted', 'status');
            }])
            ->get()
            ->map(function ($assign) {
                $doc = $assign->document;
                return [
                    'papsID' => $doc->papsID ?? null,
                    'title' => $doc->title ?? 'Untitled',
                    'college' => $doc->department ?? 'N/A',
                    'dateSubmitted' => $doc->formatted_date_submitted ?? null,
                    'status' => $doc->status ?? 'Unknown',
                ];
            });

        return Inertia::render('evaluator/home', [
            'paps' => $assignedPaps,
            'auth' => Auth::guard('evaluator')->user(),
        ]);
    }
}
