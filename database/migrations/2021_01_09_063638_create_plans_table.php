<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plans', function (Blueprint $table) {
            // $table->string('id', 20)->nullable(false);
            $table->id();
            $table->string('customer_code', 12);
            $table->foreign('customer_code')->references('customer_code')->on('details');
            $table->string('rev_no', 8);
            $table->text('logs')->nullable();
            $table->tinyInteger('th_no')->nullable();
            $table->timestamps();
            $table->string('updated_by', 15);
            $table->integer('department_id')->nullable();
            $table->unique(['customer_code', 'rev_no', 'th_no']);
        });
        Schema::table('plans', function (Blueprint $table) {
            $table->foreignId('reason_id')->nullable()->constrained('reasons');
            $table->foreignId('type_id')->nullable()->constrained('plan_types');
            $table->foreignId('plan_status_id')->constrained('plan_statuses');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('plans');
    }
}
