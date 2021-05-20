<?php

namespace App\Http\Controllers;

use App\Models\PlanTypes;
use Illuminate\Http\Request;

class PlanTypesController extends Controller
{
    public function planTypes()
    {
        return PlanTypes::all();
    }
}
