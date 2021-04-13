<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {
            $supplier = DB::connection('sqlsrv')->select(DB::raw('SELECT * FROM supplier'));
            // foreach ($supplier as $data) {
            //     Supplier::create([
            //         'product_key' => $data->product_key,
            //         'supplier_key' => $data->supplier_key,
            //     ]);
            // }
            // $suppliers = array();
            // for ($i = 0; $i < count($supplier); $i++) {
            //     array_push($suppliers, array(
            //         'product_key' => $supplier[$i]->product_key,
            //         'customer_key' => $supplier[$i]->customer_key,
            //         'created_at' => date('Y-m-d H:i:s'),
            //         'updated_at' => date('Y-m-d H:i:s')
            //     ));
            // }
            // Supplier::insert($suppliers);
            $suppliers = array();
            for ($i = 0; $i < count($supplier); $i++) {
                array_push($suppliers, array(
                    'product_key' => $supplier[$i]->product_key,
                    'supplier_key' => $supplier[$i]->supplier_key,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ));
            }
            Supplier::insert($suppliers);
        } catch (Exception $e) {
            error_log($e);
        }
    }
}
