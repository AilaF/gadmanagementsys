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
        if (Schema::hasTable('scores')) {
            Schema::table('scores', function (Blueprint $table) {
                if (!Schema::hasColumn('scores', 'itemID')) {
                    $table->string('itemID', 15);
                }
                if (!Schema::hasColumn('scores', 'papsID')) {
                    $table->string('papsID', 15);
                }
                if (!Schema::hasColumn('scores', 'evaluatorID')) {
                    $table->string('evaluatorID', 15);
                }
                if (!Schema::hasColumn('scores', 'score')) {
                    $table->decimal('score', 5, 2)->nullable();
                }
                if (!Schema::hasColumn('scores', 'versionID')) {
                    $table->string('versionID', 15);
                }
            });
        } else {
            Schema::create('scores', function (Blueprint $table) {
                $table->id('scoreID');
                $table->string('itemID', 15);
                $table->string('papsID', 15);
                $table->string('evaluatorID', 15);
                $table->decimal('score', 5, 2)->nullable();
                $table->string('versionID', 15);
                $table->timestamps();

                // Foreign key constraints
                $table->foreign('itemID')
                      ->references('itemID')
                      ->on('scoresheet')
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

                $table->foreign('versionID')
                      ->references('versionID')
                      ->on('scoresheetversions')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                // Indexes
                $table->index(['itemID', 'papsID', 'evaluatorID', 'versionID']);
            });
        }
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('score');
    }
};
