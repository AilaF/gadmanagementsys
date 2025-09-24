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
    Schema::create('enduser', function (Blueprint $table) {
        $table->string('userID', 10)->primary();
        $table->string('fname', 25);
        $table->string('lname', 25);
        $table->string('mname', 50)->nullable();
        $table->date('dob')->nullable();
        $table->string('sex', 2);
        $table->string('contactNo', 12);
        $table->string('email', 25)->nullable();
        $table->string('address', 25)->nullable();
        $table->string('orgname', 25)->nullable();
        $table->string('password', 512);
        $table->binary('profile_photo')->nullable();
        $table->dateTime('last_active')->nullable();
        $table->dateTime('date_joined')->useCurrent();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('endusers');
    }
};
