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
        if (!Schema::hasTable('scoresheet')) {
            Schema::create('scoresheet', function (Blueprint $table) {
                $table->string('itemID', 15)->primary();
                $table->text('item');
                $table->text('subitem')->nullable();
                $table->string('adminID', 15);
                $table->decimal('yesValue', 8, 2)->default(0);
                $table->decimal('noValue', 8, 2)->default(0);
                $table->decimal('partlyValue', 8, 2)->default(0);
                $table->timestamps();

                // Optional: link to admin table if exists
                   $table->foreign('adminID')
                         ->references('adminID')
                         ->on('admin')
                         ->onDelete('cascade')
                         ->onUpdate('cascade');

                // Index for faster lookups
                $table->index(['adminID']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scoresheet');
    }
};
