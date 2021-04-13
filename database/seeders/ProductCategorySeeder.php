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
        try {
            $product_category = DB::connection('sqlsrv')->select(DB::raw('SELECT * FROM product_categories'));
            // foreach ($product_category as $data) {
            //     ProductCategory::create([
            //         'product_key' => $data->ProductID,
            //         'product_name' => $data->ProductName,
            //         "department_id" => $data->DepartmentCode,
            //         "section_id" => $data->SectionCode,
            //         "team_id" => $data->TeamCode,
            //         "waku_sequence" => $data->SeqWaku,
            //         "jiku_sequence" => $data->SeqJiku,
            //         "house_type" => $data->HouseType,
            //     ]);
            // }
            $products = array();
            for ($i = 0; $i < count($product_category); $i++) {
                array_push($products, array(
                    'product_key' => $product_category[$i]->ProductID,
                    'product_name' => $product_category[$i]->ProductName == 'KAKOU IRAI' ? 'TH RELEASING' : $product_category[$i]->ProductName,
                    "department_id" => $product_category[$i]->DepartmentCode,
                    "section_id" => $product_category[$i]->SectionCode,
                    "team_id" => $product_category[$i]->TeamCode,
                    "waku_sequence" => $product_category[$i]->SeqWaku,
                    "jiku_sequence" => $product_category[$i]->SeqJiku,
                    "house_type" => $product_category[$i]->HouseType,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ));
            }
            ProductCategory::insert($products);
        } catch (Exception $e) {
            error_log($e);
        }
    }
}
