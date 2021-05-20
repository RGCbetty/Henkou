<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConstructionSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('construction_schedules', function (Blueprint $table) {
            $table->string('customer_code', 12);
            $table->string('plan_no', 8);
            $table->timestamp('joutou_date')->nullable();
            $table->integer('days_before_joutou')->nullable();
            $table->timestamp('kiso_start')->nullable();
            $table->integer('days_before_kiso_start')->nullable();
            $table->primary(['customer_code', 'plan_no']);
            $table->unique(['customer_code', 'plan_no']);
            $table->timestamps();
        });
        // Schema::table('construction_schedules', function (Blueprint $table) {
        //     $table->string('customer_code', 20)->nullable()->constrained('details', 'customer_code')->onUpdate('cascade')
        //         ->onDelete('cascade');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('construction_schedules');
    }
}
