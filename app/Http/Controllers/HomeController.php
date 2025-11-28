<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::guard('enduser')->user();
        $userID = $user->userID;

        $query = Document::where('userID', $userID)->orderBy('created_at', 'desc');

        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'All') {
            if (strtolower($request->status) === 'pending') {
                $query->whereIn('status', ['PENDING', 'UNASSIGNED']);
            } else {
                $query->where('status', strtoupper($request->status));
            }
        }

        $documents = $query->get()->map(function ($doc) {
            return [
                'papsID' => $doc->papsID,
                'title' => $doc->title,
                'department' => $doc->department,
                'file_link' => $doc->file_link,
                'status' => $doc->status,
                'dateSubmitted' => $doc->dateSubmitted ? Carbon::parse($doc->dateSubmitted)->format('M d, Y') : Carbon::parse($doc->created_at)->format('M d, Y'),
                'date_needed' => $doc->date_needed ? Carbon::parse($doc->date_needed)->format('M d, Y') : null,
            ];
        });

        return Inertia::render('enduser/Home', [
            'auth' => ['user' => $user],
            'documents' => $documents->toArray(),
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
}
