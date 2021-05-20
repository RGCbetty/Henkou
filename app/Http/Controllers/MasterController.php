<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\PlanStatus;
use App\Models\ProductCategory;
use Exception;
use Illuminate\Support\Facades\Log;

class MasterController extends Controller
{
    //
    public function ProductCategories()
    {
        try {
            $product_categories = ProductCategory::with(['designations'])->get();
            $plan_status = PlanStatus::all();
            $departments = Department::all();
            return response()->json([
                'products' => $product_categories,
                'planstatus' => $plan_status,
                'departments' => $departments
            ]);
        } catch (Exception $error) {
            Log::error($error);
        }
    }
}
