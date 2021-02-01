<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $product_category = DB::connection('sqlsrv')->select(DB::raw('SELECT * FROM M_ProductCategories'));
        try {
            foreach ($product_category as $data) {
                $result = json_decode(json_encode($data), true);
                Log::info($result);
                ProductCategory::create([
                    'id' => $data->ProductID,
                    'product_name' => $data->ProductName,
                    "sequence_no" =>  $data->ProductID,
                    "department_id" => $data->DeptCode,
                    "section_id" => $data->SectionCode,
                    "team_id" => $data->TeamCode,
                    // "department_name" => $data->DeptName,
                    // "section_name" => $data->SectionName,
                    // "team_name" => $data->TeamName,
                    'created_at' => $data->CreatedDate,
                    'updated_at' => null,
                    "updated_by" => null,
                ]);
                // Log::info();
            }
        } catch (Exception $e) {
            error_log($e);
        }
    }
}
