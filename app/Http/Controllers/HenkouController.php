<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConstructionSchedule;
use App\Models\Detail;
use App\Models\Invoice;
use App\Models\Status;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;

class HenkouController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function showByCustomerCode($customer_code)
    {
        // info($customer_code);
        // $test = Status::find(1);
        // info($test->details);
        $products = Status::with('details')->select('log', 'updated_by', 'detail_id', 'affected_id', 'created_at')->where('customer_code', $customer_code)->get();
        return $products;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }
    public function home(Request $request)
    {
        // info($request);
        // $planStatusID = isset($request->input('status_type_id')) ? 'true' : 'false';
        // info($planStatusID);
        $plan_status_id = $request->query('plan_status_id')  ? $request->query('plan_status_id') : false;
        $henkou_status_id = $request->status_type_id ?  $request->query('status_type_id') : false;
        // $plan_status_id ? array('planStatus' => function ($query) use ($plan_status_id) {
        //     $query->where('id', $plan_status_id);
        // }) : 'planStatus';

        // $latestRevision = Detail::select('customer_code', DB::raw('MAX(rev_no) as max_rev'))->groupBy('customer_code');
        // info($latestRevision);
        $henkou_plans =  Detail::with([
            'construction_schedule',
            'invoice',
            'reason',
            'type',
            'statuses.affectedProduct'
            // => function ($query) use ($request) {
            // $query->where('department_id', $request->department_id);
            // $query->whereHas('product', function ($q) use ($request) {
            //     $q->where('department_id', $request->department_id);
            // });
            // $request->section_id !== 0 ? $respective->where('section_id', $request->section_id) : null;
            // $request->team_id !== 0 ? $respective->where('team_id', $request->team_id) : null;
            // }
            ,
            'planStatus' => function ($query) use ($plan_status_id) {
                $plan_status_id ? $query->where('id', $plan_status_id) : null;
            },
            'statuses' => function ($query) use ($henkou_status_id, $request) {
                $latestStatus = DB::table('statuses')->select(DB::raw('MAX(id) as id'))->groupBy('affected_id', 'detail_id');
                $query->whereHas('affectedProduct', function ($query) use ($request) {
                    $query->whereHas('product', function ($query) use ($request) {
                        $query->where('department_id', $request->department_id);
                    });
                });
                switch ($henkou_status_id) {
                    case 1:
                        $query->joinSub($latestStatus, 'stat', function ($join) {
                            $join->on('statuses.id', '=', 'stat.id');
                        });
                        return $query->whereHas('affectedProduct', function ($query) use ($request) {
                            $query->whereHas('product', function ($query) use ($request) {
                                $query->where('department_id', $request->department_id);
                            });
                        });
                        break;
                    case 2:
                        $query->doesntHave('pending');
                        return $query->joinSub($latestStatus, 'stat', function ($join) {
                            $join->on('statuses.id', '=', 'stat.id');
                        })->whereNotNull('statuses.start_date')->whereNull('statuses.finished_date');
                        break;
                    case 3:
                        // $query->doesntHave('affectedProduct');
                        return $query->joinSub($latestStatus, 'stat', function ($join) {
                            $join->on('statuses.id', '=', 'stat.id');
                        })->whereNotNull('statuses.start_date')->whereNotNull('statuses.finished_date');
                        // return $query->joinSub($latestStatus, 'stat', function ($join) {
                        //     $join->on('statuses.id', '=', 'stat.id');
                        // })->whereNotNull('statuses.start_date')->whereNotNull('statuses.finished_date');
                        break;
                    case 4:
                        $query->whereHas('pending', function ($q) {
                            $q->whereNotNull('start_date')->whereNull('resume_date');
                        });
                        return $query->joinSub($latestStatus, 'stat', function ($join) {
                            $join->on('statuses.id', '=', 'stat.id');
                        })->whereNotNull('statuses.start_date')->whereNull('statuses.finished_date');
                        break;
                    case 5:
                        return $query->joinSub($latestStatus, 'stat', function ($join) {
                            $join->on('statuses.id', '=', 'stat.id');
                        })->whereNull('statuses.start_date')->whereNull('statuses.finished_date')->where(function ($query) {
                            $query->whereNotNull('statuses.received_date')->orWhereNull('statuses.received_date');
                        });
                        break;
                }
            },
            'statuses.affectedProduct.product'
            // => function ($query) use ($request) {
            //     $query->where('department_id', $request->department_id);
            //     $query->whereHas('product', function ($q) {
            //         $q->where('department_id', $q->department_id);
            //     });
            //     $request->section_id !== 0 ? $respective->where('section_id', $request->section_id) : null;
            //     $request->team_id !== 0 ? $respective->where('team_id', $request->team_id) : null;
            // }
            ,
            'statuses.pending'
            //  => function ($query) use ($henkou_status_id) {
            //     if ($henkou_status_id == 3) {
            //         $query->whereNotNull('start_date')->whereNull('resume_date');
            //     }
            // }
            ,
            // 'pending' => function ($query) use ($henkou_status_id) {
            //     $query->whereNotNull('start_date')->whereNull('resume_date');
            // }
        ])->whereBetween('created_at', [$request->from, $request->to]);
        // ->whereHas('statuses', function ($query) use ($henkou_status_id, $request) {

        //     // $query->whereHas('affectedProduct', function ($query) use ($request) {
        //     //     $query->whereHas('product', function ($query) use ($request) {
        //     //         $respective = $query->where('department_id', $request->department_id);
        //     //         return $respective;
        //     //     });
        //     // });


        //     $latestStatus = DB::table('statuses')->select(DB::raw('MAX(id) as id'))->groupBy('affected_id', 'detail_id');
        //     switch ($henkou_status_id) {
        //         case 1:
        //             info('sdf');
        //             return $query->whereHas('affectedProduct', function ($query) use ($request) {
        //                 $query->whereHas('product', function ($query) use ($request) {
        //                     $respective = $query->where('department_id', $request->department_id);
        //                     return $respective;
        //                 });
        //             });
        //             break;
        //         case 2:
        //             $query->whereHas('pending', function ($q) {
        //                 $q->whereNotNull('start_date')->whereNull('resume_date');
        //             });
        //             return $query->joinSub($latestStatus, 'stat', function ($join) {
        //                 $join->on('statuses.id', '=', 'stat.id');
        //             })->whereNotNull('statuses.start_date')->whereNull('statuses.finished_date');
        //             break;
        //         case 3:
        //             return $query->joinSub($latestStatus, 'stat', function ($join) {
        //                 $join->on('statuses.id', '=', 'stat.id');
        //             })->whereNotNull('statuses.start_date')->whereNotNull('statuses.finished_date');
        //             // return $query->joinSub($latestStatus, 'stat', function ($join) {
        //             //     $join->on('statuses.id', '=', 'stat.id');
        //             // })->whereNotNull('statuses.start_date')->whereNotNull('statuses.finished_date');
        //             break;
        //         case 4:

        //             return $query->whereHas('pending', function ($q) {
        //                 $q->whereNotNull('start_date')->whereNull('resume_date');
        //             });


        //             // $query->joinSub($latestStatus, 'stat', function ($join) {
        //             //     $join->on('statuses.id', '=', 'stat.id');
        //             // });

        //             break;
        //         case 5:
        //             return $query->joinSub($latestStatus, 'stat', function ($join) {
        //                 $join->on('statuses.id', '=', 'stat.id');
        //             })->whereNotNull('statuses.received_date')->whereNull('statuses.start_date')->whereNull('statuses.finished_date');
        //             break;
        //     }
        // });
        // ->whereHas('statuses.pending', function ($query) use ($henkou_status_id) {
        //     $query->whereNotNull('start_date')->whereNull('resume_date');
        //     // $query->whereNull('start_date')->whereNull('resume_date');
        // });
        // ->whereHas('pending', function ($query) use ($henkou_status_id) {
        //     if ($henkou_status_id == 4) {
        //         $query->whereNotNull('start_date')->whereNull('resume_date');
        //     }
        //     // $query->whereNull('start_date')->whereNull('resume_date');
        // });
        // ->whereHas(
        //     'status',
        //     function ($query) use ($request) {
        //         $query->whereHas('affectedProduct', function ($query) use ($request) {
        //             $query->whereHas('product', function ($query) use ($request) {
        //                 $respective = $query->where('department_id', $request->department_id);
        //                 return $respective;
        //             });
        //         });

        //     },
        // );
        // ->whereHas('pending', function ($query) {
        //     $query->whereNull('start_date')->whereNull('resume_date');
        // });
        $henkou_status_id == 1 ? $henkou_plans->joinSub(Detail::select('customer_code', DB::raw('MAX(rev_no) as max_rev'))->groupBy('customer_code'), 'rev', function ($join) {
            $join->on('details.customer_code', '=', 'rev.customer_code')->on('details.rev_no', '=',  'rev.max_rev');
        }) : null;
        $plan_status_id ? $henkou_plans->whereHas('planStatus', function ($query) use ($plan_status_id) {
            $plan_status_id ? $query->where('id', $plan_status_id) : null;
            // $plan_status_id = $request->query('plan_status_id')  ? $request->query('plan_status_id') : false;
            // switch ($plan_status_id) {
            //     case 0:
            //         break;
            //     default:
            //         return  $query->where('id', $plan_status_id);
            // }
        }) : null;
        $request->query('customer_code') ? $henkou_plans->where('details.customer_code', $request->query('customer_code')) : null;
        $request->query('method') ? $henkou_plans->where('method', $request->query('method')) : null;
        $request->query('henkou_type_id') == 2 ? $henkou_plans->whereNotNull('th_no') : null;
        // return Detail::find(1)()->get();
        // Detail::first()->
        // $henkou_plans->where()

        return $henkou_plans->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            date_default_timezone_set('Asia/Manila');
            // $plan_specification = explode(',', $request->details['plan_specification']);
            // if ($request->details['logs'] && $request->details['reason_id'] && $request->details['type_id']) {
            if (Detail::where('customer_code', $request->details['customer_code'])->first()) {
                $latest_revision = Detail::where('customer_code', $request->details['customer_code'])->max('rev_no');
                $detail = new Detail([
                    'customer_code' => $request->details['customer_code'],
                    'plan_no' => $request->details['plan_no'],
                    'rev_no' => ++$latest_revision,
                    'plan_specification' => $request->details['plan_specification'],
                    'house_code' => $request->details['house_code'],
                    'house_type' => $request->details['house_type'],
                    'method' => $request->details['method'],
                    'logs' => $request->details['logs'],
                    'th_no' => $request->details['th_no'],
                    'floors' => $request->details['floors'],
                    'reason_id' => $request->details['reason_id'],
                    'type_id' => $request->details['type_id'],
                    'plan_status_id' => $request->details['plan_status_id'],
                    'department_id' => isset($request->details['department_id']) ? $request->details['department_id'] : null,
                    'invoice_id' => Invoice::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'construction_schedule_id' => ConstructionSchedule::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'updated_by' => $request->details['updated_by']
                ]);

                $detail->save();
            } else {
                $invoice = new Invoice([
                    'customer_code' => $request->details['customer_code'],
                    'dodai_invoice' => $request->details['dodai_invoice'],
                    '1f_panel_invoice' => $request->details['1F_panel_invoice'],
                    '1f_hari_invoice' => $request->details['1F_hari_invoice'],
                    '1f_iq_invoice' => $request->details['1F_iq_invoice']
                ]);
                $construction_schedule = new ConstructionSchedule([
                    'customer_code' => $request->details['customer_code'],
                    'joutou_date' => $request->details['joutou_date'],
                    'days_before_joutou' => $request->details['days_before_joutou'],
                    'kiso_start' => $request->details['kiso_start'],
                    'days_before_kiso_start' => $request->details['before_kiso_start'],
                ]);

                $invoice->save();
                $construction_schedule->save();

                // $invoice->refresh();
                // $construction_schedule->refresh();
                $detail = new Detail([
                    'customer_code' => $request->details['customer_code'],
                    'plan_no' => $request->details['plan_no'],
                    'rev_no' => $request->details['rev_no'],
                    'plan_specification' => $request->details['plan_specification'],
                    'house_code' => $request->details['house_code'],
                    'house_type' => $request->details['house_type'],
                    'method' => $request->details['method'],
                    'logs' => $request->details['logs'],
                    'th_no' => $request->details['th_no'],
                    'floors' => $request->details['floors'],
                    'reason_id' => $request->details['reason_id'] + 1,
                    'type_id' => $request->details['type_id'] + 1,
                    'plan_status_id' => isset($request->details['plan_status_id']) ? $request->details['plan_status_id'] : null,
                    'department_id' => isset($request->details['department_id']) ? $request->details['department_id'] : null,
                    'invoice_id' => Invoice::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'construction_schedule_id' => ConstructionSchedule::select('id')->where('customer_code',  $request->details['customer_code'])->first()->id,
                    'updated_by' => $request->details['updated_by']
                ]);
                $detail->save();
            }
            $max_revision = Detail::where('customer_code', $request->details['customer_code'])->max('rev_no');
            $status = array();
            for ($i = 0; $i < count($request->product); $i++) {
                if (isset($request->row)) {
                    if ($i == 0) {
                        array_push($status, array(
                            'log' => isset($request->product[$i]['remarks']) ? $request->product[$i]['remarks'] : null,

                            'updated_by' => $request->details['updated_by'],
                            // 'product_key' => $request->product[$i]['product_category_id'],
                            'customer_code' => $request->details['customer_code'],
                            'start_date' => isset($request->product[$i]['start_date']) ? $request->product[$i]['start_date'] : null,
                            'finished_date' => isset($request->product[$i]['finished_date']) ? $request->product[$i]['finished_date'] : null,
                            'received_date' => isset($request->product[$i]['received_date']) ? $request->product[$i]['received_date'] : null,
                            'assessment_id' => isset($request->product[$i]['assessment_id']) ? $request->product[$i]['assessment_id'] : null,
                            'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                            'affected_id' => $request->product[$i]['id'],
                            'created_at' => date('Y-m-d H:i:s'),
                            // 'updated_at' => date('Y-m-d H:i:s')
                        ));
                    } else {
                        array_push($status, array(
                            'log' =>  null,
                            'updated_by' => null,
                            // 'product_key' => $request->product[$i]['product_category_id'],
                            'customer_code' => $request->details['customer_code'],
                            'start_date' => null,
                            'finished_date' => null,
                            'received_date' =>  $i == 1 ? (isset($request->product[$i - 1]['finished_date']) ? $request->product[$i - 1]['finished_date'] : null) : null,
                            'assessment_id' => null,
                            'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                            'affected_id' => $request->product[$i]['id'],
                            'created_at' => null,
                            // 'created_at' => date('Y-m-d H:i:s'),
                            // 'updated_at' => date('Y-m-d H:i:s')
                        ));
                    }
                } else {
                    if ($i == 0) {
                        array_push($status, array(
                            'log' => null,
                            'updated_by' => $request->details['updated_by'],
                            // 'product_key' => $request->product[$i]['product_category_id'],
                            'customer_code' =>  $request->details['customer_code'],
                            'start_date' => null,
                            'finished_date' =>  null,
                            'received_date' =>  null,
                            'assessment_id' => 3,
                            'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                            'affected_id' => $request->product[$i]['id'],
                            'created_at' => null,
                            // 'created_at' => date('Y-m-d H:i:s'),
                            // 'updated_at' => date('Y-m-d H:i:s')
                        ));
                    } else if ($i == 1) {
                        array_push($status, array(
                            'log' => isset($request->product[$i]['remarks']) ? $request->product[$i]['remarks'] : null,
                            'updated_by' => $request->details['updated_by'],
                            // 'product_key' => $request->product[$i]['product_category_id'],
                            'customer_code' =>  $request->details['customer_code'],
                            'start_date' => Carbon::now(),
                            'finished_date' => null,
                            'received_date' => Carbon::now(),
                            'assessment_id' => 1,
                            'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                            'affected_id' => $request->product[$i]['id'],
                            'created_at' => date('Y-m-d H:i:s'),
                            // 'updated_at' => date('Y-m-d H:i:s')
                        ));
                    } else {
                        array_push($status, array(
                            'log' =>  null,
                            'updated_by' => null,
                            // 'product_key' => $request->product[$i]['product_category_id'],
                            'customer_code' =>  $request->details['customer_code'],
                            'start_date' => null,
                            'finished_date' => null,
                            'received_date' =>  $i == 1 ? (isset($request->product[$i - 1]['finished_date']) ? $request->product[$i - 1]['finished_date'] : null) : null,
                            'assessment_id' => null,
                            'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                            'affected_id' => $request->product[$i]['id'],
                            'created_at' => null,
                            // 'created_at' => date('Y-m-d H:i:s'),
                            // 'updated_at' => date('Y-m-d H:i:s')
                        ));
                    }
                }
            }
            Status::insert($status);

            return response()->json([
                'status_code' => 200,
            ]);
            // }
        } catch (Exception $error) {
            Log::error($error);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showStatusByDetailID($customer_code, $detail_id)
    {
        //
        // $statuses = Status::all();
        $array = Status::where(['detail_id' => $detail_id, 'customer_code' => $customer_code])->get();
        $sorted = $array->sortByDesc('id');


        $tempArr = array_unique(array_column($sorted->values()->all(), 'affected_id'));
        $tempCollection = collect(array_intersect_key($sorted->values()->all(), $tempArr));
        $sortedByAffectedId = $tempCollection->sortBy('affected_id');
        return $sortedByAffectedId->values()->all();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showStatusByAffectedID($customer_code, $affected_id)
    {
        info('testsetestestes');

        $array = Status::select('log', 'created_at')->where(['affected_id' => $affected_id, 'customer_code' => $customer_code])->get();
        //
        return $array;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        info($request);
        date_default_timezone_set('Asia/Manila');
        if (isset($request->all()['status'])) {
            $status = $request->input('status');
            if (isset($request->all()['details'])) {
                $latest_revision = Detail::where('customer_code', $request->details['customer_code'])->max('rev_no');

                $detail = new Detail([
                    'customer_code' => $request->details['customer_code'],
                    'plan_no' => $request->details['plan_no'],
                    'rev_no' => ++$latest_revision,
                    'plan_specification' => $request->details['plan_specification'],
                    'house_code' => $request->details['house_code'],
                    'house_type' => $request->details['house_type'],
                    'method' => $request->details['method'],
                    'logs' => $request->details['logs'],
                    'th_no' => $request->details['th_no'],
                    'floors' => $request->details['floors'],
                    'reason_id' => $request->details['reason_id'],
                    'type_id' => $request->details['type_id'],
                    'plan_status_id' => $request->details['plan_status_id'],
                    'department_id' => isset($request->details['department_id']) ? $request->details['department_id'] : null,
                    'invoice_id' => Invoice::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'construction_schedule_id' => ConstructionSchedule::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'updated_by' => $request->details['updated_by']
                ]);
                $detail->save();
            }
            // $filteredStatus = array_filter(
            //     $status,
            //     function ($stat) {
            //         return  $stat || $stat['start_date'];
            //     }
            // );
            $maxDetailId = Detail::where('customer_code', $request->details['customer_code'])->max('id');
            // info($maxDetailId);
            $statusToCreate = array_map(function ($stat, $key) use ($request, $maxDetailId) {
                // if ((isset($stat['start_date']) && isset($stat['finished_date']) || ($stat['assessment_id'] !== 1 && !empty($stat['assessment_id'])))) {
                if ($request->input('sectionCode') == "00465") {
                    /* ANY LOGS */
                    if (isset($request->all()['row'])) {
                        if (isset($request->input('row')['log']) && array_key_exists('log', $request->input('row'))) {
                            if (!empty($request->input('row')['log'])) {
                                if ($key == 0) {
                                    return [
                                        "received_date" => $stat['received_date'],
                                        "updated_by" => $stat['updated_by'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        'customer_code' =>  $stat['customer_code'],
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => $stat['assessment_id'],
                                        "detail_id" => $maxDetailId,
                                        "start_date" =>  $stat['start_date'],
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else if ($key == 1) {
                                    // if ($request->input('row')['sequence'] == 2) {
                                    //     return [];
                                    // }
                                    return [
                                        "received_date" => Carbon::now(),
                                        "updated_by" => null,
                                        'customer_code' =>  $stat['customer_code'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "start_date" =>  null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else {
                                    // if ($request->input('row')['sequence'] == 2 && $key == 3) {
                                    //     return [
                                    //         "received_date" => Carbon::now(),
                                    //         "updated_by" => null,
                                    //         "created_at" =>  date('Y-m-d H:i:s'),
                                    //         "updated_at" => date('Y-m-d H:i:s'),
                                    //         "assessment_id" => null,
                                    //         "detail_id" => $maxDetailId,
                                    //         'affected_id' => $stat['affected_id'],
                                    //     ];
                                    // }
                                    return [
                                        "received_date" => null,
                                        "updated_by" => null,
                                        "start_date" =>  null,
                                        'customer_code' =>  $stat['customer_code'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                }
                            } else {
                                info('borrow form');
                                if ($key == 0) {
                                    return [
                                        "received_date" => Carbon::now(),
                                        "updated_by" => null,
                                        'customer_code' =>  $stat['customer_code'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "start_date" =>  null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else if ($stat['affected_id'] == $request->input('row')['affected_id']) {
                                    return [
                                        "received_date" => $stat['received_date'],
                                        "updated_by" => $stat['updated_by'],
                                        'customer_code' =>  $stat['customer_code'],
                                        "created_at" =>   Carbon::parse($stat['updated_at']),
                                        "updated_at" =>  Carbon::parse($stat['updated_at']),
                                        "start_date" =>  $stat['start_date'],
                                        "assessment_id" => $stat['assessment_id'],
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else {
                                    return [
                                        "received_date" => null,
                                        "updated_by" => null,
                                        "start_date" =>  null,
                                        'customer_code' =>  $stat['customer_code'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                }
                            }
                        } else {
                            info('borrow form');
                            if ($key == 0) {
                                return [
                                    "received_date" => Carbon::now(),
                                    "updated_by" => null,
                                    'customer_code' =>  $stat['customer_code'],
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "start_date" =>  null,
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else if ($stat['affected_id'] == $request->input('row')['affected_id']) {
                                return [
                                    "received_date" => $stat['received_date'],
                                    "updated_by" => $stat['updated_by'],
                                    'customer_code' =>  $stat['customer_code'],
                                    "created_at" =>   Carbon::parse($stat['updated_at']),
                                    "updated_at" =>  Carbon::parse($stat['updated_at']),
                                    "start_date" =>  $stat['start_date'],
                                    "assessment_id" => $stat['assessment_id'],
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else {
                                return [
                                    "received_date" => null,
                                    "updated_by" => null,
                                    "start_date" =>  null,
                                    'customer_code' =>  $stat['customer_code'],
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            }
                        }
                    }
                } else {
                    if (isset($request->all()['row'])) {
                        if (isset($request->input('row')['log']) && array_key_exists('log', $request->input('row'))) {
                            if (!empty($request->input('row')['log'])) {
                                if ($key == 0) {
                                    return [
                                        "received_date" => $stat['received_date'],
                                        "updated_by" => $stat['updated_by'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        'customer_code' =>  $stat['customer_code'],
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => $stat['assessment_id'],
                                        "detail_id" => $maxDetailId,
                                        "start_date" =>  $stat['start_date'],
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else if ($key == 1) {
                                    // if ($request->input('row')['sequence'] == 2) {
                                    //     return [];
                                    // }
                                    return [
                                        "received_date" => Carbon::now(),
                                        "updated_by" => null,
                                        'customer_code' =>  $stat['customer_code'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "start_date" =>  null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else {
                                    // if ($request->input('row')['sequence'] == 2 && $key == 3) {
                                    //     return [
                                    //         "received_date" => Carbon::now(),
                                    //         "updated_by" => null,
                                    //         "created_at" =>  date('Y-m-d H:i:s'),
                                    //         "updated_at" => date('Y-m-d H:i:s'),
                                    //         "assessment_id" => null,
                                    //         "detail_id" => $maxDetailId,
                                    //         'affected_id' => $stat['affected_id'],
                                    //     ];
                                    // }
                                    return [
                                        "received_date" => null,
                                        "updated_by" => null,
                                        "start_date" =>  null,
                                        'customer_code' =>  $stat['customer_code'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                }
                            } else {
                                info('borrow form');
                                if ($key == 0) {
                                    return [
                                        "received_date" => $stat['received_date'],
                                        "updated_by" => $stat['updated_by'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        'customer_code' =>  $stat['customer_code'],
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => $stat['assessment_id'],
                                        "detail_id" => $maxDetailId,
                                        "start_date" =>  $stat['start_date'],
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else if ($key == 1) {
                                    return [
                                        "received_date" => Carbon::now(),
                                        "updated_by" => null,
                                        'customer_code' =>  $stat['customer_code'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "start_date" =>  null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else if ($stat['affected_id'] == $request->input('row')['affected_id']) {
                                    return [
                                        "received_date" => $stat['received_date'],
                                        "updated_by" => $stat['updated_by'],
                                        'customer_code' =>  $stat['customer_code'],
                                        "created_at" =>   Carbon::parse($stat['updated_at']),
                                        "updated_at" =>  Carbon::parse($stat['updated_at']),
                                        "start_date" =>  $stat['start_date'],
                                        "assessment_id" => $stat['assessment_id'],
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else {
                                    return [
                                        "received_date" => null,
                                        "updated_by" => null,
                                        "start_date" =>  null,
                                        'customer_code' =>  $stat['customer_code'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                }
                            }
                        } else {
                            info('borrow form');
                            if ($key == 0) {
                                return [
                                    "received_date" => $stat['received_date'],
                                    "updated_by" => $stat['updated_by'],
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    'customer_code' =>  $stat['customer_code'],
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => $stat['assessment_id'],
                                    "detail_id" => $maxDetailId,
                                    "start_date" =>  $stat['start_date'],
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else if ($key == 1) {
                                return [
                                    "received_date" => Carbon::now(),
                                    "updated_by" => null,
                                    'customer_code' =>  $stat['customer_code'],
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "start_date" =>  null,
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else if ($stat['affected_id'] == $request->input('row')['affected_id']) {
                                return [
                                    "received_date" => $stat['received_date'],
                                    "updated_by" => $stat['updated_by'],
                                    'customer_code' =>  $stat['customer_code'],
                                    "created_at" =>   Carbon::parse($stat['updated_at']),
                                    "updated_at" =>  Carbon::parse($stat['updated_at']),
                                    "start_date" =>  $stat['start_date'],
                                    "assessment_id" => $stat['assessment_id'],
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else {
                                return [
                                    "received_date" => null,
                                    "updated_by" => null,
                                    "start_date" =>  null,
                                    'customer_code' =>  $stat['customer_code'],
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            }
                        }
                    }
                }
                // } else {
                // return [];
                // }
            },  $status, array_keys($status));
            // $removeEmptyToStatusToCreate = array_filter(
            //     $statusToCreate,
            //     function ($stat) {
            //         return  $stat;
            //     }
            // );
            // info($statusToCreate);
            Status::insert($statusToCreate);
            $maxDetailId = Detail::where('customer_code', $request->details['customer_code'])->max('id');
            $array = Status::where('detail_id', $maxDetailId)->get();
            return $array;
        } else {
            if (count($request->all()) == 2) {
                if (count(Status::where('detail_id', $id)->where('log', $request[0]['log'])->get()) >= 1) {
                    Status::where('detail_id', $id)->where('id', $request[0]['id'])
                        ->update([
                            'updated_by' => $request[0]['updated_by'],
                            'assessment_id' => $request[0]['assessment_id'],
                            'start_date' => $request[0]['start_date'],
                            'finished_date' => $request[0]['finished_date'],
                            'log' => $request[0]['log'],
                        ]);
                } else {
                    Status::where('detail_id', $id)->where('id', $request[0]['id'])
                        ->update([
                            'updated_by' => $request[0]['updated_by'],
                            'assessment_id' => $request[0]['assessment_id'],
                            'start_date' => $request[0]['start_date'],
                            'finished_date' => $request[0]['finished_date'],
                            'created_at' => date('Y-m-d H:i:s'),
                            'log' => $request[0]['log'],
                        ]);
                }
                if (count(Status::where('detail_id', $id)->where('id', $request[1]['id'])->whereNull('received_date')->get()) >= 1) {
                    Status::where('detail_id', $id)->where('id', $request[1]['id'])
                        ->update([
                            'received_date' =>  $request[1]['received_date']
                        ]);
                }
            } else if (count($request->all()) == 1) {
                Status::where('detail_id', $id)->where('id', $request['products']['id'])
                    ->update([
                        'updated_by' => isset($request['products']['updated_by']) ? $request['products']['updated_by'] : null,
                        'assessment_id' => isset($request['products']['assessment_id']) ?  $request['products']['assessment_id'] : null,
                        'start_date' => isset($request['products']['start_date']) ? $request['products']['start_date'] : null,
                        'finished_date' => isset($request['products']['finished_date']) ? $request['products']['finished_date'] : null,
                        'log' => isset($request['products']['log']) ?  $request['products']['log'] : null,
                        'created_at' => date('Y-m-d H:i:s'),
                    ]);
            }
        }
        // $maxDetailId = Detail::where('customer_code', $request->details['customer_code'])->max('id');
        $array = Status::where('detail_id', $id)->get();

        // info(json_decode($array));
        $sorted = $array->sortByDesc('id');
        // info($sorted->values()->all());
        $tempArr = array_unique(array_column($sorted->values()->all(), 'affected_id'));
        $tempCollection = collect(array_intersect_key($sorted->values()->all(), $tempArr));
        // info($tempCollection->values()->all());
        $sortedByAffectedId = $tempCollection->sortBy('affected_id');

        return $sortedByAffectedId->values()->all();
        // Status::where('');
        // $status = Status::find($request);
        // $status->start_date =
        //     $status->received_date =
        //     $status->finished_date =

        //     $status->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
