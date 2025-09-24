<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('userID', 10);
            $table->string('title');
            $table->string('department');
            $table->text('file_link');
            $table->enum('status', ['PENDING', 'COMPLETED', 'UNASSIGNED'])->default('PENDING');
            $table->timestamps();
            
            $table->foreign('userID')->references('userID')->on('enduser')->onDelete('cascade');
            $table->index(['userID', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};