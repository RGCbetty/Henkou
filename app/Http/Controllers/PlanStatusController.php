<?php

namespace App\Http\Controllers;

use App\Models\PlanStatus;
use Exception;
use Illuminate\Http\Request;

class PlanStatusController extends Controller
{
    public function index()
    {
        try {
            // $ePlanProcess =  AffectedProduct::select()->where('plan_status_id', $id)->get();
            $plan_status = PlanStatus::all();
            return response()->json($plan_status, 200);
        } catch (Exception $error) {
            return response()->json(array('message' => $error->getMessage()), 401);
        }
    }
}
