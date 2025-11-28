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
        Schema::create('evaluator', function (Blueprint $table) {
            $table->string('evaluatorID', 15)->primary();
            $table->string('fname', 25);
            $table->string('lname', 25);
            $table->date('dob')->nullable(); // Date of Birth
            $table->string('sex', 2);
            $table->string('contactNo', 12);
            $table->string('email', 25)->nullable();
            $table->string('address', 25)->nullable();
            $table->string('expertise', 50)->nullable();
            $table->string('department', 25)->nullable();
            $table->string('password', 512);
            $table->dateTime('last_active')->nullable();
            $table->dateTime('date_joined')->default(DB::raw('CURRENT_TIMESTAMP'));
            
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
        Schema::dropIfExists('evaluator');
    }
};