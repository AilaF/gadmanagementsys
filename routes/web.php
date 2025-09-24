<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Login & logout
Route::get('/', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.attempt');
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

// Signup
Route::get('/signup', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/signup', [RegisteredUserController::class, 'store'])->name('register.store');

// Protected routes - Role-specific middleware
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/admin/home', fn() => Inertia::render('admin/Home'))->name('admin.home');
    Route::get('/admin/dashboard', [HomeController::class, 'adminIndex'])->name('admin.dashboard');
});

Route::middleware(['auth:evaluator'])->group(function () {
    Route::get('/evaluator/home', fn() => Inertia::render('evaluator/Home'))->name('evaluator.home');
    Route::get('/evaluator/dashboard', [HomeController::class, 'evaluatorIndex'])->name('evaluator.dashboard');
});

Route::middleware(['auth:enduser'])->group(function () {
    Route::get('/enduser/home', [HomeController::class, 'index'])->name('enduser.home');
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document}', [DocumentController::class, 'show'])->name('documents.show');
    Route::put('/documents/{document}', [DocumentController::class, 'update'])->name('documents.update');
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');
});

// General authenticated routes (can be accessed by any authenticated user regardless of guard)
Route::middleware(['auth'])->group(function () {
    // Profile routes - accessible by all authenticated users
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Keep Breeze/Laravel default auth (forgot password, reset, etc.)
require __DIR__ . '/auth.php';