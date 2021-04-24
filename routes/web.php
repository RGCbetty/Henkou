<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\SpaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


// Route::get('/{any_path?}', 'SpaController@index')->where('any_path', '.*');


// Route::get('/henkou/plans', 'HenkouController@home');

Route::get('{reactRoutes}', 'SpaController@index')->where('reactRoutes', '^(?!api).*');
// Route::get('/{any?}', 'SpaController@index')->where('any', '.*');
// Auth::routes();

Route::get('/login', function () {
    return redirect('/login');
})->name('login');




// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

// Auth::routes();

// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
