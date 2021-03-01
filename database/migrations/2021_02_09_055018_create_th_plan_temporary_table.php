<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThPlanTemporaryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('th_plan_temporaries', function (Blueprint $table) {
            $table->id();
            $table->string('customer_code', 12);
            $table->string('plan_no', 8);
            $table->tinyInteger('th_no');
            $table->string('house_code', 15);
            $table->string('house_type', 30);
            $table->text('remarks')->nullable();
            $table->tinyInteger('th_assessment_id')->nullable();
            $table->tinyInteger('reason_id')->nullable();
            $table->tinyInteger('th_action_id')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('finished_date')->nullable();
            $table->timestamp('pending_start_date')->nullable();
            $table->timestamp('pending_resume_date')->nullable();
            $table->timestamp('received_date')->nullable();
            $table->timestamps();
            $table->string('updated_by', 15);
            $table->unique(['customer_code', 'plan_no', 'th_no']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('th_plan_temporaries');
    }
}
