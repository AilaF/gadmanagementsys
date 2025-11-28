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
        if (Schema::hasTable('assignedEval')) {
            Schema::table('assignedEval', function (Blueprint $table) {
                if (!Schema::hasColumn('assignedEval', 'evaluatorID')) {
                    $table->string('evaluatorID', 15);
                }
                if (!Schema::hasColumn('assignedEval', 'papsID')) {
                    $table->string('papsID', 15);
                }
                if (!Schema::hasColumn('assignedEval', 'adminID')) {
                    $table->string('adminID', 15);
                }
            });
        } else {
            Schema::create('assignedEval', function (Blueprint $table) {
                $table->id('assignID');
                $table->string('evaluatorID', 15);
                $table->string('papsID', 15);
                $table->string('adminID', 15);
                $table->timestamps();

                // Foreign key constraints
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

                $table->foreign('adminID')
                      ->references('adminID')
                      ->on('admin')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                // Indexes
                $table->index(['evaluatorID', 'papsID', 'adminID']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assigned_eval');
    }
};
