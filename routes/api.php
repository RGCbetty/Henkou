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


Route::prefix('master')->group(function () {
    Route::get('/departments', 'CompanyInformationController@departments');
    Route::get('/teams', 'CompanyInformationController@teams');
    Route::get('/sections', 'CompanyInformationController@sections');
    Route::get('/products', 'ProductCategoryController@all');
    Route::get('/assessments', 'AssessmentController@index');
    Route::get('/planstatuses', 'PlanStatusController@index');
    Route::get('/products/planstatus/', 'AffectedProductController@index');
    Route::get('/THassessments', "ThAssessmentController@index");
    Route::get('/types', 'TypeController@index');
    Route::get('/actions', 'ThActionController@index');
    Route::get('/reasons', 'ReasonController@index');
});
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return response()->json($request->user());;
// });


Route::middleware('auth:sanctum')->group(function () {
    Route::post('user/role', 'AuthController@role');
    Route::post('user/verify', 'AuthController@verify');
    Route::get('/users/{id}', 'AuthController@users');
    /* User */
    Route::get('/henkou/users', 'UserController@index');
    /* User */
    // Route::get('/masterlist/{id}', 'AuthController@userinfo');
    /* Company Information */

    Route::get('/department/{dep_id}/sections', 'CompanyInformationController@sectionsByDepartment');
    Route::get('/department/{dep_id}/section/{sec_id}/teams', 'CompanyInformationController@teamsByDepartmentAndSections');
    /* Company Information */
    /* HRD Information Service */
    Route::get('/plans', 'InformationServiceController@table');
    Route::get('/plan', 'InformationServiceController@filteredplans');
    Route::get('/plandetails/{id}', 'InformationServiceController@specs');
    Route::get('/stop', 'InformationServiceController@stop');
    /* Specifications */
    /* Master */
    /* Master */
    /* Henkou Details Record */
    Route::get('/henkou/plans/{customer_code}/products/{affected_id}/logs', 'HenkouController@showStatusByAffectedID');

    Route::get('/details/{customer_code}', 'DetailController@latest');
    Route::post('/details', 'HenkouController@store');
    // Route::get('/product', 'ProductCategoryController@index');
    Route::post('/productcategories', 'ProductCategoryController@update');

    // Route::get('/products/planstatus/{planstatus_id}', 'ProductCategoryController@show');
    Route::get('/henkou/plans', 'HenkouController@home');
    Route::get('/henkou/plans/{customer_code}/products/{detail_id}', 'HenkouController@showStatusByDetailID');
    Route::get('/henkou/plans/{customer_code}/logs', 'HenkouController@showByCustomerCode');

    /* ALL LOGS WITH SAME CUSTOMER CODE */
    /*  */
    Route::post('/status/{id}', 'HenkouController@update');

    /* Kouzou Pending */
    Route::post('/henkou/plans/pending', 'PendingController@store');

    Route::get('/henkou/plans/pending/{customer_code}', 'PendingController@showByCustomerCode');
    Route::get('/henkou/plans/pending/{customer_code}/{affected_id}', 'PendingController@showByCustomerCodeAffectedID');

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
    /* Affected Product  */
    Route::get('/products/planstatus/{id}', 'AffectedProductController@byPlanStatus');
    /* Affected Product */
});
