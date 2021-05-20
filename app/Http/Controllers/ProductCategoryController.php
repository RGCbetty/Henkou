<?php

namespace App\Http\Controllers;

use App\Models\PlanStatus;
use App\Models\ProductCategory;
use App\Models\Supplier;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ProductCategoryController extends Controller
{
    public function all()
    {
        return ProductCategory::with(['designations'])->get();
    }
    public function index(Request $request)
    {
        return PlanStatus::all()->with('products')->orderBy('id')->get();
    }
    public function create()
    {
        $product_category = DB::connection('sqlsrv')->select(DB::raw('SELECT * FROM M_ProductCategories'));
        try {
            foreach ($product_category as $data) {
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
            }
        } catch (Exception $e) {
            error_log($e);
        }
    }
    public function show($planstatus_id)
    {
        //
        $planStat = PlanStatus::all()->find(1);
    }
}
