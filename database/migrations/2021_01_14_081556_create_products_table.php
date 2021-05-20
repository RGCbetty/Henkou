<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('customer_code', 12);
            $table->string('rev_no', 8);
            $table->string('log')->nullable();
            $table->string('updated_by', 15)->nullable();;
            $table->timestamp('start_date')->nullable();
            $table->timestamp('finished_date')->nullable();
            $table->timestamp('received_date')->nullable();
            $table->boolean('is_rechecking')->default(0);
            $table->timestamps();
        });
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('assessment_id')->nullable()->constrained('assessments');
            $table->foreignId('plan_id')->constrained('plans');
            // $table->foreignId('customer_code')->references('customer_code')->on('plans');
            // $table->foreignId('product_id')->constrained('product_categories');
            $table->foreignId('affected_id')->constrained('affected_products');
        });
        // Schema::create('products', function (Blueprint $table) {
        //     $table->id();
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
