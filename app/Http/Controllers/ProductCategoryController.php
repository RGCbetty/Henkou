<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return ProductCategory::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
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
                    'created_at' => $data->CreatedDate,
                    'updated_at' => null,
                    "updated_by" => null,
                    "details_id" => null
                ]);
                // Log::info();
            }
        } catch (Exception $e) {
            error_log($e);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProductCategory  $productCategory
     * @return \Illuminate\Http\Response
     */
    public function show(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProductCategory  $productCategory
     * @return \Illuminate\Http\Response
     */
    public function edit(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProductCategory  $productCategory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProductCategory $productCategory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProductCategory  $productCategory
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProductCategory $productCategory)
    {
        //
    }
}
