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
        if (!Schema::hasTable('comment')) {
            Schema::create('comment', function (Blueprint $table) {
                $table->string('commentID', 15)->primary();
                $table->longText('comments'); // allows more than 1000 characters
                $table->string('userID', 15);
                $table->string('evaluatorID', 15);
                $table->string('papsID', 15);
                $table->timestamps();

                // Foreign keys
                $table->foreign('userID')
                      ->references('userID')
                      ->on('enduser')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                $table->foreign('evaluatorID')
                      ->references('evaluatorID')
                      ->on('evaluator')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                $table->foreign('papsID')
                      ->references('papsID')
                      ->on('paps')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                // Indexes for performance
                $table->index(['userID', 'evaluatorID', 'papsID']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comment');
    }
};
