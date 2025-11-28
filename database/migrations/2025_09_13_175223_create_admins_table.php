<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('admin'); // Drop if exists first
        
        Schema::create('admin', function (Blueprint $table) {
            $table->string('adminID', 10)->primary();
            $table->string('fname', 25);
            $table->string('lname', 25);
            $table->date('dob')->nullable();
            $table->string('sex', 2);
            $table->string('contactNo', 12);
            $table->string('email', 25)->nullable();
            $table->string('password', 300);
            $table->dateTime('last_active')->nullable();
            
            $table->charset = 'latin1';
            $table->collation = 'latin1_swedish_ci';
            $table->engine = 'InnoDB';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
};