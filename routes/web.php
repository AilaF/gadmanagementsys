<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AddEvaluatorController;    
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\EditProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ScorecardController;
use App\Http\Controllers\AssignEvaluatorController;
use App\Http\Controllers\NotificationController;


// Login & logout
Route::get('/', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login');
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');


// Signup
Route::get('/signup', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/signup', [RegisteredUserController::class, 'store'])->name('register.store');

// Protected routes - Role-specific middleware
Route::middleware(['auth:admin'])->group(function () {
        Route::get('/admin/home', fn() => Inertia::render('admin/home'))->name('admin.home');
        Route::get('/admin/dashboard', [HomeController::class, 'adminIndex'])->name('admin.dashboard');
        Route::get('/admin/add-evaluator', fn() => Inertia::render('admin/AddEvaluator'))->name('admin.addEvaluator');
        Route::post('/admin/add-evaluator', [AddEvaluatorController::class, 'store'])->name('admin.saveEvaluator');
        Route::get('/admin/manageusers', [UserManagementController::class, 'usermngIndex'])->name('admin.manageusers');
        Route::get('/admin/trackpaps', [DocumentController::class, 'trackPaps'])->name('admin.trackpaps');
        Route::post('/admin/assign-evaluator-multiple', [EvaluatorAssignmentController::class, 'assignMultiple'])->name('admin.assignEvaluatorMultiple');
        Route::get('/admin/reports', fn() => Inertia::render('admin/reports'))->name('admin.reports');
        Route::delete('/admin/users/{id}', [UserManagementController::class, 'destroy'])->name('admin.deleteuser');
        Route::post('/assign-evaluator', [AssignEvaluatorController::class, 'assign'])->name('admin.assignEvaluator');
        Route::get('/assigned-evaluators/{papsID}', [AssignEvaluatorController::class, 'show'])->name('admin.showAssignedEvaluators');
        Route::delete('/unassign-evaluator', [AssignEvaluatorController::class, 'unassign'])->name('admin.unassignEvaluator');
        Route::post('/admin/assign-evaluator', [AssignEvaluatorController::class, 'store'])->name('admin.assignEvaluator');


        // Scorecard management routes
            Route::get('/admin/manage-scoresheet', [ScorecardController::class, 'manage'])
        ->name('admin.managescoresheet');
            Route::post('/admin/manage-scoresheet/save', [ScorecardController::class, 'saveNewVersion'])
        ->name('admin.manageScoresheet.save');
        Route::post('/admin/scoresheet/finalize', [ScorecardController::class, 'finalizeVersion'])
        ->name('admin.scoresheet.finalize');


    // Scorecard display (shows latest or previous versions)
            Route::get('/admin/scorecard', [ScorecardController::class, 'index'])
        ->name('admin.scorecard');
});

    //Notifications    
    Route::get('/notifications/{recipientID}/{recipientType}', [NotificationController::class, 'index']);
    Route::post('/notifications/{recipientID}/{recipientType}/read-all', [NotificationController::class, 'markAllAsRead']);



Route::middleware(['auth:evaluator'])->group(function () {
    Route::get('/evaluator/home', fn() => Inertia::render('evaluator/home'))->name('evaluator.home');
    Route::get('/evaluator/dashboard', [HomeController::class, 'evaluatorIndex'])->name('evaluator.dashboard');
    Route::get('/evaluator/home', [AssignEvaluatorController::class, 'showEvaluatorDashboard'])
        ->name('evaluator.home');

    
});

Route::middleware(['auth:enduser'])->group(function () {
    Route::get('/enduser/home', [HomeController::class, 'index'])->name('enduser.home');
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document}', [DocumentController::class, 'show'])->name('documents.show');
    Route::put('/documents/{document}', [DocumentController::class, 'update'])->name('documents.update');
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');
    Route::put('/enduser/{userID}', [EditProfileController::class, 'update'])->name('enduser.update');
    
});



// Keep Breeze/Laravel default auth (forgot password, reset, etc.)
require __DIR__ . '/auth.php';