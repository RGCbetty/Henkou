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
    Route::get('/types', 'PlanTypesController@planTypes');
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
    /* HOME */
    Route::get('/henkou/plans', 'PlanController@home');
    /* HOME */
    /* REGISTRATION */
    Route::get('/henkou/registration', 'InformationServiceController@table');
    Route::get('/plan/details/{customer_code}', 'InformationServiceController@specs');
    Route::post('/details', 'HenkouController@store');
    Route::post('/henkou/register/kouzou', 'HenkouController@registerKouzou');
    Route::post('/henkou/register/th', 'HenkouController@registerTh');




    // Route::get('/th/plans', 'ThPlanController@index');
    /* TH Plans */
    Route::post('/th/plan', 'ThPlanController@upsert');
    /* Th Plans */
    /* REGISTRATION */
    /* HENKOU PAGE AND REGISTRATION PAGE */
    Route::get('/henkou/plan/details/{customer_code}', 'DetailController@latest');
    Route::get('/henkou/plans/{customer_code}/products/{detail_id}', 'HenkouController@showStatusByDetailID');
    Route::get('/henkou/plans/{customer_code}/revision/{revision_index}', 'HenkouController@henkouLogs');

    /* HENKOU PAGE AND REGISTRATION PAGE */

    /* User */
    Route::get('/henkou/users', 'UserController@index');
    /* User */
    // Route::get('/masterlist/{id}', 'AuthController@userinfo');
    /* Company Information */

    Route::get('/department/{dep_id}/sections', 'CompanyInformationController@sectionsByDepartment');
    Route::get('/department/{dep_id}/section/{sec_id}/teams', 'CompanyInformationController@teamsByDepartmentAndSections');
    /* Company Information */
    /* HRD Information Service */
    Route::get('/plan', 'InformationServiceController@filteredplans');
    Route::get('/stop', 'InformationServiceController@stop');
    /* Specifications */
    /* Master */
    /* Master */
    /* Henkou Details Record */
    Route::get('/henkou/plans/{customer_code}/products/{affected_id}/logs', 'HenkouController@showProductLogsByAffectedID');
    Route::get('/henkou/plans/{customer_code}/product/id/{affected_id}', 'HenkouController@showStatusByAffectedID');


    // Route::get('/product', 'ProductCategoryController@index');
    Route::post('/productcategories', 'ProductCategoryController@update');

    // Route::get('/products/planstatus/{planstatus_id}', 'ProductCategoryController@show');
    /* HENKOU PRODUCTS IN HENKOU PAGE */

    // 05-12-2021
    // Route::get('/henkou/plans/{customer_code}/logs', 'HenkouController@showByCustomerCode');

    Route::get('/henkou/plans/{customer_code}/revision/{revision_index}/product/{affected_id}', 'HenkouController@products');


    /* ALL LOGS WITH SAME CUSTOMER CODE */
    /*  */
    Route::post('/status/{id}', 'HenkouController@update');

    /* Kouzou Pending */
    Route::post('/henkou/plans/pending', 'PendingController@store');
    // Route::get('/henkou/plans/pending/{customer_code}', 'PendingController@showByCustomerCode');
    Route::get('/henkou/plans/pending/{customer_code}/{affected_id}', 'PendingController@showByCustomerCodeAffectedID');

    /* Kouzou Pending */

    /* Henkou Attachments  */
    Route::post('/henkou/attachment/{id}', 'AttachmentController@store');
    Route::get('/henkou/attachments/{id}', 'AttachmentController@show');
    /* Henkou Attachments */
    Route::get('/henkou/form', 'ExcelController@readxls');
    /* CUSTOMER & SUPPLIER */
    // Route::get('/suppliers', 'SupplierController@index');
    // Route::get('/supplier', 'SupplierController@show');
    // Route::get('/customers', 'CustomerController@index');
    // Route::get('/customer', 'CustomerController@show');
    /* CUSTOMER & SUPPLIER */

    /* Affected Product  */
    Route::get('/products/planstatus/{id}', 'AffectedProductController@byPlanStatus');
    Route::post('/henkou/plans/recheck', 'ProductController@recheck');
    /* Affected Product */
    /* MASTER */
    Route::get('/henkou/products/planstatus/{id}', 'AffectedProductController@byPlanStatus');
    Route::get('/henkou/master/products', 'MasterController@ProductCategories');
    /* MASTER */
});
