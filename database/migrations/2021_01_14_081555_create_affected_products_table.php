<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAffectedProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('affected_products', function (Blueprint $table) {
            $table->id();
            $table->string('product_key', 20);
            $table->smallInteger('sequence_no')->nullable();
            $table->string('updated_by', 15)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('affected_products', function (Blueprint $table) {
            $table->foreignId('plan_status_id')->nullable()->constrained('plan_statuses');
            $table->foreign('product_key')->references('product_key')->on('product_categories');
            $table->unique(['product_key', 'plan_status_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('affected_products');
    }
}
