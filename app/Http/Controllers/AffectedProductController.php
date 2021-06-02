<?php

namespace App\Http\Controllers;

use App\Models\AffectedProduct;
use App\Models\PlanStatus;
use Exception;

class AffectedProductController extends Controller
{
    public function index()
    {
        try {
            $affectedProducts = AffectedProduct::all();
            return response()->json($affectedProducts);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 401);
        }
    }
    public function ByPlanStatus($planstatus_id)
    {
        try {
            $affectedProducts = AffectedProduct::with(['productCategory' => function ($query) {
                $query->whereNull('deleted_at');
            }, 'productCategory.designations'])->select()->where('plan_status_id', $planstatus_id)->get();
            // info($affectedProducts);
            return response()->json($affectedProducts);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 401);
        }
    }
}
