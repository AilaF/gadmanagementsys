    <?php

    // config/auth.php (only the important parts shown)
    return [

        'defaults' => [
            'guard' => env('AUTH_GUARD', 'web'),
            'passwords' => env('AUTH_PASSWORD_BROKER', 'endusers'),
        ],

        'guards' => [
            'web' => [
                'driver' => 'session',
                'provider' => 'endusers', 
            ],

            'admin' => [
                'driver' => 'session',
                'provider' => 'admins',
            ],

            'evaluator' => [
                'driver' => 'session',
                'provider' => 'evaluators',
            ],

            'enduser' => [
                'driver' => 'session',
                'provider' => 'endusers',
            ],
        ],

        'providers' => [
            'admins' => [
                'driver' => 'eloquent',
                'model' => App\Models\Admin::class,
            ],

            'evaluators' => [
                'driver' => 'eloquent',
                'model' => App\Models\Evaluator::class,
            ],

            'endusers' => [
                'driver' => 'eloquent',
                'model' => App\Models\EndUser::class,
            ],
        ],

        'passwords' => [
            'endusers' => [
                'provider' => 'endusers',
                'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
                'expire' => 60,
                'throttle' => 60,
            ],
            // add admins/evaluators if you want forgot-password for them
        ],



        /*
        |--------------------------------------------------------------------------
        | Password Confirmation Timeout
        |--------------------------------------------------------------------------
        |
        | Here you may define the amount of seconds before a password confirmation
        | window expires and users are asked to re-enter their password via the
        | confirmation screen. By default, the timeout lasts for three hours.
        |
        */

        'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

    ];
