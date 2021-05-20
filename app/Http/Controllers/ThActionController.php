<?php

namespace App\Http\Controllers;

use App\Models\ThAction;
use Illuminate\Http\Request;

class ThActionController extends Controller
{
    public function index()
    {
        //
        return ThAction::all();
    }
}
