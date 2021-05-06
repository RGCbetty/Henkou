<?php

namespace App\Http\Controllers;

use App\Models\ThPlanTemporary;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ThPlanController extends Controller
{
    public function index()
    {
        return ThPlanTemporary::select()->whereDate('received_date', '=', Carbon::today()->subDay())->orWhere('received_date', '=', Carbon::today())->get();
    }
    public function upsert(Request $request)
    {
        $thplan = array();
        $req = (object) $request;
        array_push($thplan, array(
            'customer_code' => $request->ConstructionCode,
            'plan_no' => $request->PlanNo,
            'th_no' => $request->RequestNo,
            'house_code' => $request->NameCode,
            'house_type' => $request->ConstructionTypeName,
            'remarks' => isset($request->remarks) ? $request->remarks : null,
            'th_assessment_id' => isset($request->th_assessment_id) ? $request->th_assessment_id : null,
            'reason_id' => isset($request->reason_id) ? $request->reason_id : null,
            'th_action_id' => isset($request->th_action_id) ? $request->th_action_id : null,
            'start_date' => isset($request->start_date) ? $request->start_date : null,
            'finished_date' => isset($request->finished_date) ? $request->finished_date : null,
            'pending_start_date' => isset($request->pending_start_date) ? $request->pending_start_date : null,
            'pending_resume_date' => isset($request->pending_resume_date) ? $request->pending_resume_date : null,
            'received_date' => $request->RequestAcceptedDate,
            'updated_by' => $request->employee_code
        ));
        ThPlanTemporary::upsert(
            $thplan,
            ['customer_code', 'plan_no', 'th_no'],
            [
                'remarks', 'th_assessment_id', 'reason_id',
                'th_action_id', 'start_date', 'finished_date',
                'pending_start_date', 'pending_resume_date'
            ]
        );
    }
}
