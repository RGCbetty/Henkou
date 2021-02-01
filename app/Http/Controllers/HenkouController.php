<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConstructionSchedule;
use App\Models\Detail;
use App\Models\Invoice;
use App\Models\Status;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HenkouController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
                    'logs' => $request->details['logs'],
                    'th_no' => $request->details['th_no'],
                    'floors' => $request->details['floors'],
                    'reason_id' => $request->details['reason_id'] + 1,
                    'type_id' => $request->details['type_id'] + 1,
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

                $invoice->refresh();
                $construction_schedule->refresh();
                $detail = new Detail([
                    'customer_code' => $request->details['customer_code'],
                    'plan_no' => $request->details['plan_no'],
                    'rev_no' => $request->details['rev_no'],
                    'plan_specification' => $request->details['plan_specification'],
                    'house_code' => $request->details['house_code'],
                    'house_type' => $request->details['house_type'],
                    'logs' => $request->details['logs'],
                    'th_no' => $request->details['th_no'],
                    'floors' => $request->details['floors'],
                    'reason_id' => $request->details['reason_id'] + 1,
                    'type_id' => $request->details['type_id'] + 1,
                    'invoice_id' => Invoice::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'construction_schedule_id' => ConstructionSchedule::select('id')->where('customer_code',  $request->details['customer_code'])->first()->id,
                    'updated_by' => $request->details['updated_by']
                ]);
                $detail->save();
            }
            $max_revision = Detail::where('customer_code', $request->details['customer_code'])->max('rev_no');
            for ($i = 0; $i < count($request->planStatus); $i++) {
                if ($i == 0) {
                    date_default_timezone_set('Asia/Manila');
                    $status = new Status([
                        'log' => null,
                        'updated_by' => $request->details['updated_by'],
                        'product_id' => $request->planStatus[$i]['ProductCode'],
                        'start_date' => null,
                        'finished_date' => null,
                        'received_date' => date('Y-m-d H:i:s', time()),
                        'assessment_id' => null,
                        'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id
                    ]);
                } else {
                    $status = new Status([
                        'log' => null,
                        'updated_by' => $request->details['updated_by'],
                        'product_id' => $request->planStatus[$i]['ProductCode'],
                        'start_date' => null,
                        'finished_date' => null,
                        'received_date' => null,
                        'assessment_id' => null,
                        'detail_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id
                    ]);
                }
                $status->save();
            }
            // }
        } catch (Exception $error) {
            Log::info($error);
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
        return Status::select()->where('detail_id', $id)->get();
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
        if (count($request->all()) == 2) {

            Status::where('detail_id', $id)->where('product_id', $request[0]['ProductCode'])
                ->update([
                    'assessment_id' => $request[0]['assessment_id'],
                    'start_date' => $request[0]['start_date'],
                    'finished_date' => $request[0]['finish_date'],
                ]);
            Status::where('detail_id', $id)->where('product_id', $request[1]['ProductCode'])
                ->update([
                    'received_date' => $request[1]['received_date']
                ]);
        } else {
            Status::where('detail_id', $id)->where('product_id', $request['products']['ProductCode'])
                ->update([
                    'assessment_id' => $request['products']['assessment_id'],
                    'start_date' => $request['products']['start_date'],
                    'finished_date' => $request['products']['finish_date'],
                ]);
        }
        return Status::where('detail_id', $id)->get();
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
