<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductDesignationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_designations', function (Blueprint $table) {
            $table->id();
            $table->string('product_key', 20);
            $table->foreign('product_key')->references('product_key')->on('product_categories');
            $table->string('department_id', 5);
            $table->string('section_id', 5);
            $table->string('team_id', 5);
            $table->unique(['product_key', 'department_id', 'section_id', 'team_id'], 'unique_key');
            $table->timestamps();
        });
        // Schema::table('product_designations', function (Blueprint $table) {
        //     // $table->foreignId('product_key')->nullable()->constrained('product_categories');
        //     $table->foreign('product_key')->references('product_key')->on('product_categories');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_designations');
    }
}
