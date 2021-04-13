<?php

namespace App\Http\Controllers;

use App\Models\AffectedProduct;
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
    public function byPlanStatus($id)
    {
        try {
            $affectedProducts = AffectedProduct::select()->where('plan_status_id', $id)->get();
            return response()->json($affectedProducts);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 401);
        }
    }
}
