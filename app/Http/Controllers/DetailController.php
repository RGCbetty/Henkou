<?php

namespace App\Http\Controllers;

use App\Models\ConstructionSchedule;
use App\Models\Detail;
use App\Models\Invoice;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DetailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Detail::all();
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function latest($customer_code)
    {
        try {
            $latest_revision = Detail::where('customer_code', $customer_code)->max('rev_no');
            $result = Detail::with(['invoice', 'construction_schedule'])->where('customer_code', $customer_code)->where('rev_no', $latest_revision)->first();
            // DB::connection('mysql')->select(DB::raw("SELECT A.*,B.*, C.* FROM henkou.details as A
            // INNER JOIN henkou.construction_schedules as B
            //     ON A.customer_code = B.customer_code
            //         INNER JOIN henkou.invoices AS C
            //             ON A.customer_code = C.customer_code
            //             WHERE A.rev_no = (SELECT MAX(rev_no) FROM henkou.details)
            //             AND A.customer_code = '{$customer_code}';"));
            // $max = Detail::where('customer_code', $customer_code)->max('rev_no');
            // $found = (empty($max)) ? null :  Detail::where('customer_code', $customer_code)->where('rev_no', $max)->first()->invoice()->where('customer_code', $customer_code)->first();
            return $result;
        } catch (Exception $e) {
            Log::error($e);
        }
    }
    public function store(Request $request)
    {
        //

        try {
            $detail = new Detail;
            $invoice = new Invoice;
            $construction_schedule = new ConstructionSchedule;

            if (Detail::find($request->details_id)) {
                //    foreach($data as $key => $value) {

                //    }
                $rev_no = $request->rev_no;
                $pieces = explode("-", $rev_no);
                $max = Detail::where('id', $request->details_id)->max('rev_no');
                $detail->id = $request->id;
                $detail->customer_code = $request->customer_code;
                $detail->house_code = $request->house_code;
                $detail->house_type = $request->house_type;
                $detail->plan_no = $request->plan_no;
                $detail->plan_specification = $request->plan_specification;
                $detail->rev_no = ++$max;
                $detail->type_id = $request->type_id;
                $detail->reason_id = $request->reason_id;
                $detail->logs = $request->logs;
                $detail->updated_by = $request->updated_by;
                $detail->floors = $request->floors;
                $detail->department_id = $request->department_id;
                $detail->section_id = $request->section_id;
                $detail->team_id = $request->team_id;
                $detail->created_at = date('Y-m-d H:i:s');
                $detail->updated_at = date('Y-m-d H:i:s');
            } else {
                $detail->id = $request->details_id;
                $detail->customer_code = $request->customer_code;
                $detail->house_code = $request->house_code;
                $detail->house_type = $request->house_type;
                $detail->plan_no = $request->plan_no;
                $detail->plan_specification = $request->plan_specification;
                $detail->rev_no = $request->rev_no;
                $detail->type_id = $request->type_id;
                $detail->reason_id = $request->reason_id;
                $detail->logs = $request->logs;
                $detail->updated_by = $request->updated_by;
                $detail->floors = $request->floors;
                $detail->department_id = $request->department_id;
                $detail->section_id = $request->section_id;
                $detail->team_id = $request->team_id;
                $invoice->dodai_invoice = $request->dodai_invoice;
                $invoice->{'1f_panel_invoice'} = $request->{'1F_panel_invoice'};
                $invoice->{'1f_hari_invoice'} = $request->{'1F_hari_invoice'};
                $invoice->{'1f_iq_invoice'} = $request->{'1F_iq_invoice'};
                $invoice->customer_code = $request->customer_code;
                $construction_schedule->customer_code = $request->customer_code;
                $construction_schedule->joutou_date = $request->jouto_date;
                $construction_schedule->days_before_joutou = $request->days_before_joutou;
                $construction_schedule->kiso_start = $request->kiso_start;
                $construction_schedule->days_before_kiso_start = $request->before_kiso_start;
                $detail->created_at = date('Y-m-d H:i:s');
                $detail->updated_at = date('Y-m-d H:i:s');
                $construction_schedule->created_at = date('Y-m-d H:i:s');
                $construction_schedule->updated_at = date('Y-m-d H:i:s');
                $invoice->created_at = date('Y-m-d H:i:s');
                $invoice->updated_at = date('Y-m-d H:i:s');
                $invoice->save();
                $construction_schedule->save();
            }

            $detail->save();
        } catch (Exception $error) {
            Log::error($error);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Detail  $detail
     * @return \Illuminate\Http\Response
     */
    public function show(Detail $detail)
    {
        //

    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Detail  $detail
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Detail $detail)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Detail  $detail
     * @return \Illuminate\Http\Response
     */
    public function destroy(Detail $detail)
    {
        //
    }
}
