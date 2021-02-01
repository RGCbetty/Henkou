<?php

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
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return response()->json($request->user());;
// });


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/userinfo/{id}', 'AuthController@userinfo');
    Route::get('/users/{id}',);
    Route::get('/masterlist/{id}', 'AuthController@userinfo');
    //Specifications
    Route::get('/plans', 'InformationServiceController@table');
    Route::get('/plandetails/{id}', 'InformationServiceController@specs');
    Route::get('/reasons', 'ReasonController@index');
    Route::get('/types', 'TypeController@index');
    Route::get('/assessments', 'AssessmentController@index');
    //Henkou Details Record
    Route::get('/details/{customer_code}', 'DetailController@latest');
    Route::post('/details', 'HenkouController@store');
    Route::get('/products', 'ProductCategoryController@index');
    Route::get('/stop', 'InformationServiceController@stop');
    Route::get('/status/{id}', 'HenkouController@show');
    Route::post('/status/{id}', 'HenkouController@update');
    Route::post('/henkou/pending', 'PendingController@store');
    Route::get('/henkou/pending/{id}', 'PendingController@show');
    Route::post('/henkou/attachment/{id}', 'AttachmentController@store');
    Route::get('/henkou/attachments/{id}', 'AttachmentController@show');
});
