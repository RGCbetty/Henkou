<?php

namespace Database\Seeders;

use App\Models\ProductDesignation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductDesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
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
        $designation = array();
        for ($i = 0; $i < count($product_category); $i++) {
            array_push($designation, array(
                'product_key' => $product_category[$i]->ProductID,
                'department_id' => $product_category[$i]->DepartmentCode,
                'section_id' => $product_category[$i]->SectionCode,
                'team_id' => $product_category[$i]->TeamCode,
                // "waku_sequence" => $product_category[$i]->SeqWaku,
                // "jiku_sequence" => $product_category[$i]->SeqJiku,
                // "house_type" => $product_category[$i]->HouseType,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ));
        }
        info(json_encode($designation));
        ProductDesignation::insert($designation);
    }
}
