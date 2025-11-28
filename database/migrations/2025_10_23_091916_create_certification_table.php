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
        if (Schema::hasTable('certification')) {
            Schema::table('certification', function (Blueprint $table) {
                if (!Schema::hasColumn('certification', 'papsID')) {
                    $table->string('papsID', 15);
                }
                if (!Schema::hasColumn('certification', 'userID')) {
                    $table->string('userID', 15);
                }
                if (!Schema::hasColumn('certification', 'score')) {
                    $table->decimal('score', 10, 2)->nullable();
                }
            });
        } else {
            Schema::create('certification', function (Blueprint $table) {
                $table->string('certificationID', 15)->primary();
                $table->string('papsID', 15);
                $table->string('userID', 15);
                $table->decimal('score', 10, 2)->nullable();
                $table->timestamps();

                // Foreign key constraints
                $table->foreign('papsID')
                      ->references('papsID')
                      ->on('paps')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                $table->foreign('userID')
                      ->references('userID')
                      ->on('enduser')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                // Indexes
                $table->index(['papsID', 'userID']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certification');
    }
};
