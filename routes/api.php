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
    /* User */
    Route::get('/henkou/users', 'UserController@index');
    /* User */
    Route::post('user/role', 'AuthController@role');
    Route::post('user/verify', 'AuthController@verify');
    Route::get('/users/{id}', 'AuthController@users');
    /* HOME */
    Route::get('/henkou/plans', 'PlanController@home');
    /* HOME */
    /* REGISTRATION */
    Route::get('/henkou/registration', 'InformationServiceController@table');
    Route::get('/plan/details/{customer_code}', 'InformationServiceController@specs');

    // Route::post('/details', 'HenkouController@store');
    Route::post('/henkou/register/kouzou', 'HenkouController@RegisterKouzou');
    Route::post('/henkou/register/th', 'HenkouController@RegisterTH');

    /* TH Plans */
    Route::post('/th/plan', 'ThPlanController@upsert');
    /* Th Plans */
    /* REGISTRATION */
    /* HENKOU PAGE AND REGISTRATION PAGE */
    Route::get('/henkou/plan/details/{customer_code}', 'DetailController@latest');



    /* HENKOU PAGE AND REGISTRATION PAGE */



    /* Company Information */

    Route::get('/department/{dep_id}/sections', 'CompanyInformationController@SectionByDepartment');
    Route::get('/department/{dep_id}/section/{sec_id}/teams', 'CompanyInformationController@TeamByDepartmentAndSection');
    Route::get('/department/{dep_id}/sections/teams', 'CompanyInformationController@TeamByDepartmentAndSections');
    /* Company Information */
    /* HRD Information Service */
    Route::get('/plan', 'InformationServiceController@filteredplans');
    Route::get('/stop', 'InformationServiceController@stop');
    /* Specifications */
    /* Master */
    /* Master */








    /* ALL LOGS WITH SAME CUSTOMER CODE */
    /*  */
    Route::post('/status/{id}', 'HenkouController@update');
    Route::patch('/henkou/plan/{plan_id}/product/{product_id}', 'ProductController@update');

    /* Kouzou Pending */
    Route::post('/henkou/plans/pending', 'PendingController@store');


    /* Kouzou Pending */

    /* Henkou Attachments  */
    Route::post('/henkou/attachment/{id}', 'AttachmentController@store');
    Route::get('/henkou/attachments/{id}', 'AttachmentController@show');
    /* Henkou Attachments */
    Route::get('/henkou/form', 'ExcelController@readxls');


    /* Affected Product  */
    Route::get('/products/planstatus/{planstatus_id}', 'AffectedProductController@ByPlanStatus');
    Route::post('/henkou/plans/recheck', 'HenkouController@recheck');
    /* Affected Product */
    /* MASTER */
    // Route::get('/henkou/products/planstatus/{id}', 'AffectedProductController@byPlanStatus');
    Route::get('/henkou/master/products', 'MasterController@ProductCategories');
    Route::post('/henkou/master/product', 'MasterController@ProductCategoryUpsert');
    Route::put('/henkou/master/product/{product_key}', 'MasterController@ProductCategorySoftDelete');
    Route::post('/henkou/master/process/{plan_status_id}', 'MasterController@AffectedProductUpsert');
    Route::post('/henkou/master/process/product/softdelete', 'MasterController@AffectedProductSoftDelete');


    /* MASTER */
});
