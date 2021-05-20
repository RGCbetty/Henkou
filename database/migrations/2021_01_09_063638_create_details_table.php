<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('details', function (Blueprint $table) {
            // $table->string('id', 20)->nullable(false);
            $table->string('customer_code', 12);
            $table->string('plan_no', 8);
            $table->string('house_code', 15);
            $table->string('house_type', 30);
            $table->integer('method');
            $table->tinyInteger("floors");
            $table->timestamps();
            $table->string('updated_by', 15);
            $table->primary(['customer_code', 'plan_no']);
            $table->unique(['customer_code', 'plan_no']);
        });
        Schema::table('details', function (Blueprint $table) {
            $table->foreign('customer_code')->references('customer_code')->on('construction_schedules');
            // $table->foreignId('construction_schedule_id')->nullable()->constrained('construction_schedules');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('details');
    }
}
