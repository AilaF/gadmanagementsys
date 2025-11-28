<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        if (!Schema::hasTable('notification')) {
            Schema::create('notification', function (Blueprint $table) {
                $table->string('notifID', 10)->primary();
                $table->string('recipientID', 10);
                $table->enum('recipientType', ['Admin', 'Evaluator', 'EndUser']);
                $table->text('message');
                $table->string('relatedPapsID', 10)->nullable();
                $table->dateTime('dateSent')->useCurrent();
                $table->boolean('isRead')->default(false);

                // Indexes for performance
                $table->index(['recipientID', 'recipientType', 'isRead']);
            });
        }
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
