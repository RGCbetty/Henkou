<?php

namespace Database\Seeders;

use App\Models\Customer;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {
            $customer = DB::connection('sqlsrv')->select(DB::raw('SELECT * FROM customer'));

            //     foreach ($customer as $data) {
            //         Customer::create([
            //             'product_key' => $data->product_key,
            //             'customer_key' => $data->customer_key,
            //         ]);
            //         // Log::info();
            //     }
            $customers = array();
            for ($i = 0; $i < count($customer); $i++) {
                array_push($customers, array(
                    'product_key' => $customer[$i]->product_key,
                    'customer_key' => $customer[$i]->customer_key,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ));
            }
            Customer::insert($customers);
        } catch (Exception $e) {
            error_log($e);
        }
    }
}
