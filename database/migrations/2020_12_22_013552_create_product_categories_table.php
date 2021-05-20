<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateProductCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_categories', function (Blueprint $table) {
            $table->string('product_key', 20);
            $table->string('product_name', 50);
            // $table->string('department_id', 5);
            // $table->string('section_id', 5);
            // $table->string('team_id', 5);
            // $table->smallInteger("waku_sequence");
            // $table->smallInteger("jiku_sequence");
            // $table->string('house_type', 20);
            $table->primary('product_key');
            $table->timestamps();
            $table->softDeletes();
            $table->string('updated_by', 15)->nullable();
            // $table->unique(['department_id', 'section_id', 'team_id', 'id'], "sequence");
        });
        // Schema::table('product_categories', function (Blueprint $table) {
        //     $table->string('details_id', 20)->nullable()->constrained('details', 'details_id');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_categories');
    }
}
