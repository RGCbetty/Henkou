<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->string('customer_code', 12);
            $table->string('name');
            $table->string('path');
            $table->timestamps();
        });
        Schema::table('attachments', function (Blueprint $table) {
            // $table->foreignId('detail_id')->constrained('details');
            $table->foreign('customer_code')->references('customer_code')->on('plans');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('attachments');
    }
}
