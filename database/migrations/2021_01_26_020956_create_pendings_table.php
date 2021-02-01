<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePendingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pendings', function (Blueprint $table) {
            $table->id();
            $table->string("product_id", 20);
            $table->string('rev_no', 8);
            $table->timestamp('start_date')->nullable();
            $table->text("reason");
            $table->timestamp('resume_date')->nullable();
            $table->integer("duration");
            $table->timestamps();
        });
        Schema::table('pendings', function (Blueprint $table) {
            $table->foreignId('status_id')->constrained('statuses');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pendings');
    }
}
