<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class SpaController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }
    // protected function redirectTo($request)
    // {
    //     return route('login');
    // }
    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // Authentication passed...
            return redirect('/login');
        }
    }
    public function index()
    {
        return view('layouts.index');
    }
}
