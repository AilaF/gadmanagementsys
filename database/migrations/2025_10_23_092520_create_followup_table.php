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
        // Check if table already exists
        if (Schema::hasTable('followup')) {
            Schema::table('followup', function (Blueprint $table) {
                if (!Schema::hasColumn('followup', 'userID')) {
                    $table->string('userID', 15);
                }
                if (!Schema::hasColumn('followup', 'papsID')) {
                    $table->string('papsID', 15);
                }
                if (!Schema::hasColumn('followup', 'evaluatorID')) {
                    $table->string('evaluatorID', 15);
                }
                if (!Schema::hasColumn('followup', 'dateRequested')) {
                    $table->date('dateRequested')->nullable();
                }
            });
        } else {
            Schema::create('followup', function (Blueprint $table) {
                $table->id('followupID');
                $table->string('userID', 15);
                $table->string('papsID', 15);
                $table->string('evaluatorID', 15);
                $table->date('dateRequested')->nullable();
                $table->timestamps();

                // Foreign key constraints
                $table->foreign('userID')
                      ->references('userID')
                      ->on('enduser')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                $table->foreign('papsID')
                      ->references('papsID')
                      ->on('paps')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                $table->foreign('evaluatorID')
                      ->references('evaluatorID')
                      ->on('evaluator')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                // Indexes
                $table->index(['userID', 'papsID', 'evaluatorID']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('followup');
    }
};
