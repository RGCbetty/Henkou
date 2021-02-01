<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('customer_code', 12)->unique();
            $table->string('dodai_invoice', 15)->nullable();
            $table->string('1f_panel_invoice', 15)->nullable();
            $table->string('1f_hari_invoice', 15)->nullable();
            $table->string('1f_iq_invoice', 15)->nullable();
            $table->timestamps();
        });
        // Schema::table('invoices', function (Blueprint $table) {
        //     // $table->string('customer_code');
        //     // $table->foreign('customer_code')->references('customer_code')->on('details');
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
        Schema::dropIfExists('invoices');
    }
}
