<?php

namespace App\Http\Controllers;

use App\Models\ThAssessment;
use Illuminate\Http\Request;

class ThAssessmentController extends Controller
{
    public function index()
    {
        return ThAssessment::all();
    }
}
