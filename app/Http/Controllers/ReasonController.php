<?php

namespace App\Http\Controllers;

use App\Models\Reason;
use Illuminate\Http\Request;


class ReasonController extends Controller
{
    public function index()
    {
        return Reason::all();
    }
}
