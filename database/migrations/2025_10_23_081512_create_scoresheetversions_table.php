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
        if (Schema::hasTable('scoresheetversions')) {
            Schema::table('scoresheetversions', function (Blueprint $table) {
                if (!Schema::hasColumn('scoresheetversions', 'versionID')) {
                    $table->string('versionID', 15)->primary();
                }
                if (!Schema::hasColumn('scoresheetversions', 'itemID')) {
                    $table->string('itemID', 15)->after('versionID');
                }
                if (!Schema::hasColumn('scoresheetversions', 'adminID')) {
                    $table->string('adminID', 15)->after('itemID');
                }
                if (!Schema::hasColumn('scoresheetversions', 'dateAdministered')) {
                    $table->timestamp('dateAdministered')->useCurrent()->after('adminID');
                }
            });
        } else {
            Schema::create('scoresheetversions', function (Blueprint $table) {
                $table->string('versionID', 15)->primary();
                $table->string('itemID', 15);
                $table->string('adminID', 10);
                $table->timestamp('dateAdministered')->useCurrent();

                // Foreign key constraints
                $table->foreign('itemID')
                      ->references('itemID')
                      ->on('scoresheet')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                $table->foreign('adminID')
                      ->references('adminID')
                      ->on('admin')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                // Indexes
                $table->index(['itemID', 'adminID']);
                $table->index('dateAdministered');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scoresheetversions');
    }
};
