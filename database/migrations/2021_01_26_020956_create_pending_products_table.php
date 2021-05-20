<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePendingProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pending_products', function (Blueprint $table) {
            $table->id();
            $table->string('customer_code', 12);
            $table->string('rev_no', 8);
            $table->timestamp('start_date')->nullable();
            $table->text("reason")->nullable();
            $table->text("remarks")->nullable();
            $table->text("borrow_details")->nullable();
            $table->string('updated_by', 15);
            $table->timestamp('resume_date')->nullable();
            $table->string("duration", 15)->nullable();
            $table->timestamps();
        });
        Schema::table('pending_products', function (Blueprint $table) {
            $table->foreignId('affected_id')->constrained('affected_products');
            $table->foreignId('product_id')->constrained('products');
        });
        // Schema::create('pending_products', function (Blueprint $table) {
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
        Schema::dropIfExists('pending_products');
    }
}
