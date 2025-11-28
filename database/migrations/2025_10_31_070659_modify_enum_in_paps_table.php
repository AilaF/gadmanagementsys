<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        DB::statement("ALTER TABLE paps MODIFY COLUMN status ENUM('UNASSIGNED','FOR EVALUATION','COMPLETED') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        // rollback to original enum values
        DB::statement("ALTER TABLE paps MODIFY COLUMN status ENUM('UNASSIGNED','PENDING','COMPLETED') NOT NULL");
    }
};

