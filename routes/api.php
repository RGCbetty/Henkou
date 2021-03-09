<?php

use App\Http\Controllers\ThActionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::post('/login', 'AuthController@login');
Route::get('/employee/{id}', 'AuthController@employee');
Route::post('/register', 'AuthController@register');

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return response()->json($request->user());;
// });


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users/{id}', 'AuthController@users');

    // Route::get('/masterlist/{id}', 'AuthController@userinfo');
    /* HRD Information Service */
    Route::get('/plans', 'InformationServiceController@table');
    Route::get('/plandetails/{id}', 'InformationServiceController@specs');
    Route::get('/stop', 'InformationServiceController@stop');

    /* Specifications */
    /* Master */
    Route::get('/reasons', 'ReasonController@index');
    Route::get('/types', 'TypeController@index');
    Route::get('/assessments', 'AssessmentController@index');
    Route::get('/actions', 'ThActionController@index');
    Route::get('/THassessments', "ThAssessmentController@index");
    /* Master */
    /* Henkou Details Record */
    Route::get('/details/{customer_code}', 'DetailController@latest');
    Route::post('/details', 'HenkouController@store');
    Route::get('/product', 'ProductCategoryController@index');
    Route::get('/products', 'ProductCategoryController@all');
    Route::post('/productcategories', 'ProductCategoryController@update');

    Route::get('/status/{id}', 'HenkouController@show');
    Route::post('/status/{id}', 'HenkouController@update');
    /* Kouzou Pending */
    Route::post('/henkou/pending', 'PendingController@store');
    Route::get('/henkou/pending/{id}', 'PendingController@show');
    /* Kouzou Pending */
    /* Henkou Attachments  */
    Route::post('/henkou/attachment/{id}', 'AttachmentController@store');
    Route::get('/henkou/attachments/{id}', 'AttachmentController@show');
    /* Henkou Attachments */
    Route::get('/henkou/form', 'ExcelController@readxls');
    /* CUSTOMER & SUPPLIER */
    Route::get('/suppliers', 'SupplierController@index');
    Route::get('/supplier', 'SupplierController@show');
    Route::get('/customers', 'CustomerController@index');
    Route::get('/customer', 'CustomerController@show');
    /* CUSTOMER & SUPPLIER */
    /* TH Plans */
    Route::post('/th/plan', 'ThPlanController@upsert');
    Route::get('/th/plans', 'ThPlanController@index');
    /* Th Plans */
});
