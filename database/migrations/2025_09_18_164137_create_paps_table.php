<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Check if table already exists
        if (Schema::hasTable('paps')) {
            Schema::table('paps', function (Blueprint $table) {
                if (!Schema::hasColumn('paps', 'title')) {
                    $table->string('title')->after('userID');
                }
                if (!Schema::hasColumn('paps', 'department')) {
                    $table->string('department', 100)->after('title');
                }
                if (!Schema::hasColumn('paps', 'file_link')) {
                    $table->text('file_link')->after('department');
                }
                if (!Schema::hasColumn('paps', 'date_needed')) {
                    $table->date('date_needed')->after('file_link');
                }
                if (!Schema::hasColumn('paps', 'status')) {
                    $table->enum('status', ['UNASSIGNED', 'PENDING', 'COMPLETED'])->default('UNASSIGNED')->after('date_needed');
                }
                if (!Schema::hasColumn('paps', 'dateSubmitted')) {
                    $table->timestamp('dateSubmitted')->useCurrent()->after('status');
                }
            });
        } else {
            Schema::create('paps', function (Blueprint $table) {
                $table->id('papsID');
                
                // 🔥 FIX: Match type with enduser.userID
                $table->string('userID', 10);

                $table->string('title');
                $table->string('department', 100);
                $table->text('file_link');
                $table->date('date_needed');
                $table->enum('status', ['UNASSIGNED', 'PENDING', 'COMPLETED'])->default('UNASSIGNED');
                $table->timestamp('dateSubmitted')->useCurrent();
                $table->timestamps();

                // Foreign key constraint
                $table->foreign('userID')
                      ->references('userID')
                      ->on('enduser')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                // Indexes
                $table->index(['userID', 'status']);
                $table->index('dateSubmitted');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('paps');
    }
};
