<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->string('log')->nullable();
            $table->string('updated_by', 15);
            $table->timestamp('start_date')->nullable();
            $table->timestamp('finished_date')->nullable();
            $table->timestamp('received_date')->nullable();
            $table->timestamps();
        });
        Schema::table('statuses', function (Blueprint $table) {
            $table->foreignId('assessment_id')->nullable()->constrained('assessments');
            $table->foreignId('detail_id')->constrained('details');
            // $table->foreignId('product_id')->constrained('product_categories');
            $table->foreignId('affected_id')->constrained('affected_products');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('statuses');
    }
}
