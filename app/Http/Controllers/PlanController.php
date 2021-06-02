<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class PlanController extends Controller
{
    public function home(Request $request)
    {
        info(Schema::getColumnListing('products'));
        info(Schema::getColumnListing('plans'));
        info(Schema::getColumnListing('details'));
        $plan_status_id = $request->query('plan_status_id')  ? $request->query('plan_status_id') : false;
        $henkou_status_id = $request->status_type_id ?  $request->query('status_type_id') : false;
        $henkou_plans =  Plan::with([
            'details',
            'details.construction_schedule',
            'reason',
            'type',
            'products.affectedProduct',
            'planStatus' => function ($query) use ($plan_status_id) {
                $plan_status_id ? $query->where('id', $plan_status_id) : null;
            },
            'products' => function ($query) use ($henkou_status_id, $request) {
                $latestStatus = DB::table('products')->select(DB::raw('MAX(id) as id'))->groupBy('affected_id', 'plan_id');
                $query->whereHas('affectedProduct', function ($query) use ($request) {
                    $query->whereHas('productCategory', function ($query) use ($request) {
                        $query->whereHas('designations', function ($query) use ($request) {
                            $query->where(['department_id' => $request->department_id, 'section_id' => $request->section_id, 'team_id' => $request->team_id]);
                            // $query->where('department_id', $request->department_id)
                            //     ->where(function ($query) use ($request) {
                            //         $query->where('section_id', $request->section_id)
                            //             ->orWhere('team_id', $request->team_id);;
                            //     });
                            $query->where(['department_id' => $request->department_id, 'section_id' => $request->section_id])->orWhere('team_id', $request->team_id);
                        });
                    });
                });
                switch ($henkou_status_id) {
                    case 1:
                        $query->joinSub($latestStatus, 'stat', function ($join) {
                            $join->on('products.id', '=', 'stat.id');
                        });
                        return $query->whereHas('affectedProduct', function ($query) use ($request) {
                            $query->whereHas('productCategory', function ($query) use ($request) {
                                $query->whereHas('designations', function ($query) use ($request) {
                                    $query->where(['department_id' => $request->department_id, 'section_id' => $request->section_id, 'team_id' => $request->team_id]);
                                    // $query->where('department_id', $request->department_id)->where(function ($query) use ($request) {
                                    //     $query->where('section_id', $request->section_id)
                                    //         ->orWhere('team_id', $request->team_id);;
                                    // });

                                    // $query->where(['department_id' => $request->department_id, 'section_id' => $request->section_id])->orWhere('team_id', $request->team_id);
                                    // ->orWhere('section_id', $request->section_id)
                                    // ->orWhere('team_id', $request->team_id);
                                });
                            });
                        });
                        break;
                    case 2:
                        $query->doesntHave('pendings');
                        return $query->joinSub($latestStatus, 'stat', function ($join) {
                            $join->on('products.id', '=', 'stat.id');
                        })->whereNotNull('products.start_date')->whereNull('products.finished_date');
                        break;
                    case 3:
                        return $query->joinSub($latestStatus, 'stat', function ($join) {
                            $join->on('products.id', '=', 'stat.id');
                        })->whereNotNull('products.start_date')->whereNotNull('products.finished_date');

                        break;
                    case 4:
                        $query->whereHas('pendings', function ($q) {
                            $q->whereNotNull('start_date')->whereNull('resume_date');
                        });
                        return $query->joinSub($latestStatus, 'stat', function ($join) {
                            $join->on('products.id', '=', 'stat.id');
                        })->whereNotNull('products.start_date')->whereNull('products.finished_date');
                        break;
                    case 5:
                        return $query->joinSub($latestStatus, 'stat', function ($join) {
                            $join->on('products.id', '=', 'stat.id');
                        })->whereNull('products.start_date')->whereNull('products.finished_date')->where(function ($query) {
                            $query->whereNotNull('products.received_date')->orWhereNull('products.received_date');
                        });
                        break;
                }
            },
            'products.affectedProduct.productCategory',
            'products.affectedProduct.productCategory.designations',
            'products.pendings',

        ])->whereBetween('created_at', [$request->from, $request->to]);
        $henkou_status_id == 1 ? $henkou_plans->joinSub(Plan::select('customer_code', DB::raw('MAX(rev_no) as max_rev'))->groupBy('customer_code'), 'rev', function ($join) {
            $join->on('plans.customer_code', '=', 'rev.customer_code')->on('plans.rev_no', '=',  'rev.max_rev');
        }) : null;
        $plan_status_id ? $henkou_plans->whereHas('planStatus', function ($query) use ($plan_status_id) {
            $plan_status_id ? $query->where('id', $plan_status_id) : null;
        }) : null;
        $request->query('customer_code') ? $henkou_plans->where('plans.customer_code', $request->query('customer_code')) : null;
        $request->query('method') ? $henkou_plans->where('method', $request->query('method')) : null;
        $request->query('henkou_type_id') == 2 ? $henkou_plans->whereNotNull('th_no') : null;
        return $henkou_plans->get();
    }
}
