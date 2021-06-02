<?php

namespace App\Http\Controllers;

use App\Models\AffectedProduct;
use App\Models\Department;
use App\Models\PlanStatus;
use App\Models\ProductCategory;
use App\Models\ProductDesignation;
use App\Models\Section;
use App\Models\SectionTeamRelation;
use App\Models\Team;
use Exception;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MasterController extends Controller
{
    //
    public function ProductCategories()
    {
        try {
            $product_categories = ProductCategory::with(['designations.department' => function ($query) {
                $query->whereNull('DeletedDate');
            }, 'designations.section' => function ($query) {
                $query->whereNull('DeletedDate');
            }, 'designations.team' => function ($query) {
                $query->whereNull('DeletedDate');
            }])->get();
            $plan_status = PlanStatus::all();
            // $departments = Department::all();
            $designations = SectionTeamRelation::with(['Departments' => function ($query) {
                $query->whereNull('DeletedDate');
            }, 'Sections' => function ($query) {
                $query->whereNull('DeletedDate');
            }, 'Teams' => function ($query) {
                $query->whereNull('DeletedDate');
            }])->whereHas('departments', function ($query) {
                $query->whereNull('DeletedDate');
            })->whereHas('sections', function ($query) {
                $query->whereNull('DeletedDate');
            })->whereHas('teams', function ($query) {
                $query->whereNull('DeletedDate');
            })->whereNull('DeletedDate')->get();
            // $teams = Team::all();
            return response()->json([
                'products' => $product_categories,
                'planstatus' => $plan_status,
                // 'departments' => $departments,
                'designations' => $designations,
            ]);
        } catch (Exception $error) {
            Log::error($error);
        }
    }
    public function ProductCategoryUpsert(Request $request)
    {
        try {
            $limit = array(9, 10, 11);
            $rand_keys = array_rand($limit);
            $product_key = isset($request->product_key) ? $request->product_key : (string) Str::random($limit[$rand_keys]);
            $to_insert_product_designation = array();
            // $product_category = new ProductCategory(['product_key' => $product_key, 'product_name' => $request['product'], 'updated_by' => $request->user()->employee_no]);
            ProductCategory::upsert(['product_key' => $product_key, 'product_name' => $request['product'], 'updated_by' => $request->user()->employee_no], ['product_key'], ['product_name', 'updated_by']);
            // $product_category->save();
            for ($i = 0; $i < count($request->sections); $i++) {
                // ProductDesignation::insert()
                // info($request->sections[$i]);
                for ($j = 0; $j < count($request->teams); $j++) {
                    $checkIfExist = SectionTeamRelation::where(['SectionCode' => $request->sections[$i], 'TeamCode' => $request->teams[$j]])->get();
                    if ($checkIfExist->isNotEmpty()) {
                        array_push(
                            $to_insert_product_designation,
                            array(
                                'id' => null,
                                'product_key' => $product_key,
                                'department_id' => $request->departments,
                                'section_id' => $request->sections[$i],
                                'team_id' => $request->teams[$j],
                                'created_at' => now(),
                                'updated_at' => now(),
                            )
                        );
                    }
                }
            }
            info($to_insert_product_designation);
            ProductDesignation::upsert($to_insert_product_designation, ['product_key'], ['department_id', 'section_id', 'team_id']);
            return ProductCategory::with(['designations.department' => function ($query) {
                $query->whereNull('DeletedDate');
            }, 'designations.section' => function ($query) {
                $query->whereNull('DeletedDate');
            }, 'designations.team' => function ($query) {
                $query->whereNull('DeletedDate');
            }])->get();;
        } catch (Exception $error) {
            Log::error($error);
        }
    }
    public function ProductCategorySoftDelete($product_key)
    {
        try {
            ProductCategory::where('product_key', $product_key)->delete();
            return ProductCategory::with(['designations.department' => function ($query) {
                $query->whereNull('DeletedDate');
            }, 'designations.section' => function ($query) {
                $query->whereNull('DeletedDate');
            }, 'designations.team' => function ($query) {
                $query->whereNull('DeletedDate');
            }])->get();;
        } catch (Exception $error) {
            Log::error($error);
        }
    }
    public function AffectedProductUpsert(Request $request, $plan_status_id)
    {
        try {
            info($request);
            AffectedProduct::upsert(
                $request->all(),
                ['id', 'product_key', 'plan_status_id'],
                [
                    'sequence_no', 'updated_by', 'deleted_at'
                ]
            );
            return app(AffectedProductController::class)->ByPlanStatus($plan_status_id);
        } catch (Exception $error) {
            Log::error($error);
        }
    }
    public function AffectedProductSoftDelete(Request $request)
    {
        try {
            info($request);
            AffectedProduct::whereIn('id', collect($request)->pluck('id'))->delete();
        } catch (Exception $error) {
            Log::error($error);
        }
    }
}
