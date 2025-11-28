<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\EnsureAuthenticatedWithGuard;
use App\Http\Middleware\UpdateLastActive;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // register route middleware alias
        $middleware->alias([
            'auth.guard' => EnsureAuthenticatedWithGuard::class,
            'lastactive' => UpdateLastActive::class,
        ]);

        // web middleware stack
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            UpdateLastActive::class,
        ]);

        // don't forget cookie encryption exceptions (if used)
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })

        ->withSchedule(function ($schedule) {
        // 🧹 Prune old sessions daily (only needed when using database sessions)
        $schedule->command('session:prune')->daily();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();
