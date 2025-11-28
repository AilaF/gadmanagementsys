<?php

namespace App\Http\Controllers;

use App\Models\EndUser;
use App\Models\Evaluator;
use Inertia\Inertia;
use Carbon\Carbon;

class UserManagementController extends Controller
{
    public function usermngIndex()
    {
        // Fetch End Users
        $endUsers = EndUser::select(
            'userID as id',
            'fname',
            'lname',
            'email',
            'last_active',
            'date_joined'
        )
        ->get()
        ->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => "{$user->fname} {$user->lname}",
                'email' => $user->email ?? 'N/A',
                'date_joined' => $user->date_joined
                    ? date('Y-m-d', strtotime($user->date_joined))
                    : 'N/A',
                'last_active' => $user->last_active,
                'role' => 'End User',
            ];
        });


        // Fetch Evaluators
        $evaluators = Evaluator::select(
            'evaluatorID as id',
            'fname',
            'lname',
            'email',
            'department',
            'expertise',
            'last_active',
            'date_joined'
        )
        ->get()
        ->map(function ($user) {

            return [
                'id' => $user->id,
                'name' => "{$user->fname} {$user->lname}",
                'email' => $user->email ?? 'N/A',
                'department' => $user->department ?? 'N/A',
                'expertise' => $user->expertise ?? 'N/A',
                'date_joined' => $user->date_joined
                    ? date('Y-m-d', strtotime($user->date_joined))
                    : 'N/A',
                'last_active' => $user->last_active,
                'role' => 'Evaluator',
            ];
        });

        // Combine both lists
        $allUsers = $endUsers->concat($evaluators);

        return Inertia::render('admin/manageusers', [
            'allUsers' => $allUsers
        ]);
    }

    public function destroy($id)
    {
        // Try deleting from EndUser first
        $endUser = EndUser::where('userID', $id)->first();
        if ($endUser) {
            $endUser->delete();
            return redirect()->back()->with('success', 'End User deleted successfully.');
        }

        // Try deleting from Evaluator next
        $evaluator = Evaluator::where('evaluatorID', $id)->first();
        if ($evaluator) {
            $evaluator->delete();
            return redirect()->back()->with('success', 'Evaluator deleted successfully.');
        }

        // User not found
        return redirect()->back()->with('error', 'User not found.');
    }
}
