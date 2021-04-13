<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConstructionSchedule;
use App\Models\Detail;
use App\Models\Invoice;
use App\Models\Status;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;

class HenkouController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        //
        return Status::where('detail_id', $id)->get();
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
                    'reason_id' => $request->details['reason_id'] + 1,
                    'type_id' => $request->details['type_id'] + 1,
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
                            'start_date' => isset($request->product[$i]['start_date']) ? $request->product[$i]['start_date'] : null,
                            'finished_date' => isset($request->product[$i]['finished_date']) ? $request->product[$i]['finished_date'] : null,
                            'received_date' => isset($request->product[$i]['received_date']) ? $request->product[$i]['received_date'] : null,
                            'assessment_id' => isset($request->product[$i]['assessment_id']) ? $request->product[$i]['assessment_id'] : null,
                            'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                            'affected_id' => $request->product[$i]['id'],
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
                        ));
                    } else {
                        array_push($status, array(
                            'log' =>  null,
                            'updated_by' => null,
                            // 'product_key' => $request->product[$i]['product_category_id'],
                            'start_date' => null,
                            'finished_date' => null,
                            'received_date' =>  $i == 1 ? (isset($request->product[$i - 1]['finished_date']) ? $request->product[$i - 1]['finished_date'] : null) : null,
                            'assessment_id' => null,
                            'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                            'affected_id' => $request->product[$i]['id'],
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
                        ));
                    }
                } else {
                    if ($i == 0) {
                        array_push($status, array(
                            'log' => null,
                            'updated_by' => $request->details['updated_by'],
                            // 'product_key' => $request->product[$i]['product_category_id'],
                            'start_date' => null,
                            'finished_date' =>  null,
                            'received_date' =>  null,
                            'assessment_id' => 3,
                            'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                            'affected_id' => $request->product[$i]['id'],
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
                        ));
                    } else if ($i == 1) {
                        array_push($status, array(
                            'log' => isset($request->product[$i]['remarks']) ? $request->product[$i]['remarks'] : null,
                            'updated_by' => $request->details['updated_by'],
                            // 'product_key' => $request->product[$i]['product_category_id'],
                            'start_date' => Carbon::now(),
                            'finished_date' => null,
                            'received_date' => Carbon::now(),
                            'assessment_id' => 1,
                            'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                            'affected_id' => $request->product[$i]['id'],
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
                        ));
                    } else {
                        array_push($status, array(
                            'log' =>  null,
                            'updated_by' => null,
                            // 'product_key' => $request->product[$i]['product_category_id'],
                            'start_date' => null,
                            'finished_date' => null,
                            'received_date' =>  $i == 1 ? (isset($request->product[$i - 1]['finished_date']) ? $request->product[$i - 1]['finished_date'] : null) : null,
                            'assessment_id' => null,
                            'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                            'affected_id' => $request->product[$i]['id'],
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
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
    public function show($id)
    {
        //
        // $statuses = Status::all();
        $array = Status::where('detail_id', $id)->get();
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
    public function edit($id)
    {
        //
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
        date_default_timezone_set('Asia/Manila');
        info($request->all());

        if (isset($request->all()['status'])) {
            $status = $request->input('status');
            // $removedKakouIrai = array_shift($status);
            // $row = isset($request->input('row')) ? $request->input('row') : null;
            $filteredStatus = array_filter(
                $status,
                function ($stat) {
                    return  $stat || $stat['start_date'];
                }
            );
            $statusToCreate = array_map(function ($stat, $key) use ($request) {
                if ((isset($stat['start_date']) && isset($stat['finished_date']) || ($stat['assessment_id'] !== 1 && !empty($stat['assessment_id'])))) {
                    if ($request->input('sectionCode') == "00465") {

                        if (isset($request->all()['row'])) {
                            if ($request->input('row')['log']) {
                                if ($key == 0) {
                                    return [];
                                } else if ($key == 1) {
                                    if ($request->input('row')['sequence'] == 2) {
                                        return [];
                                    }
                                    return [
                                        "received_date" => Carbon::now(),
                                        "updated_by" => null,
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $stat['detail_id'],
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else {
                                    if ($request->input('row')['sequence'] == 2 && $key == 3) {
                                        return [
                                            "received_date" => Carbon::now(),
                                            "updated_by" => null,
                                            "created_at" =>  date('Y-m-d H:i:s'),
                                            "updated_at" => date('Y-m-d H:i:s'),
                                            "assessment_id" => null,
                                            "detail_id" => $stat['detail_id'],
                                            'affected_id' => $stat['affected_id'],
                                        ];
                                    }
                                    return [
                                        "received_date" => null,
                                        "updated_by" => null,
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $stat['detail_id'],
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                }
                            }
                        } else {
                            if ($key == 0) {
                                return [
                                    "received_date" => $stat['received_date'],
                                    "updated_by" => null,
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "detail_id" => $stat['detail_id'],
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else {
                                return [
                                    "received_date" => null,
                                    "updated_by" => null,
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "detail_id" => $stat['detail_id'],
                                    'affected_id' => $stat['affected_id'],
                                ];
                            }
                        }
                    } else {
                        // info($request->input('row')['log']);
                        if (isset($request->all()['row'])) {
                            if ($request->input('row')['log']) {
                                if ($key == 0) {
                                    return [];
                                } else if ($key == 1) {
                                    if ($request->input('row')['sequence'] == 2) {
                                        return [];
                                    }
                                    return [
                                        "received_date" => Carbon::now(),
                                        "updated_by" => null,
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $stat['detail_id'],
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else {
                                    if ($request->input('row')['sequence'] == 2 && $key == 3) {
                                        return [
                                            "received_date" => Carbon::now(),
                                            "updated_by" => null,
                                            "created_at" =>  date('Y-m-d H:i:s'),
                                            "updated_at" => date('Y-m-d H:i:s'),
                                            "assessment_id" => null,
                                            "detail_id" => $stat['detail_id'],
                                            'affected_id' => $stat['affected_id'],
                                        ];
                                    }
                                    return [
                                        "received_date" => null,
                                        "updated_by" => null,
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $stat['detail_id'],
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                }
                            }
                        } else {
                            if ($key == 0) {
                                return [];
                            } else if ($key == 1) {
                                return [
                                    "received_date" => Carbon::now(),
                                    "updated_by" => null,
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "detail_id" => $stat['detail_id'],
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else {
                                return [
                                    "received_date" => null,
                                    "updated_by" => null,
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "detail_id" => $stat['detail_id'],
                                    'affected_id' => $stat['affected_id'],
                                ];
                            }
                        }
                    }
                } else {
                    return [];
                }
            }, $filteredStatus, array_keys($filteredStatus));
            $removeEmptyToStatusToCreate = array_filter(
                $statusToCreate,
                function ($stat) {
                    return  $stat;
                }
            );
            Status::insert($removeEmptyToStatusToCreate);
        } else {
            if (count($request->all()) == 2) {
                Status::where('detail_id', $id)->where('id', $request[0]['id'])
                    ->update([
                        'updated_by' => $request[0]['updated_by'],
                        'assessment_id' => $request[0]['assessment_id'],
                        'start_date' => $request[0]['start_date'],
                        'finished_date' => $request[0]['finished_date'],
                        'log' => $request[0]['log'],
                    ]);
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
                    ]);
            }
        }
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
