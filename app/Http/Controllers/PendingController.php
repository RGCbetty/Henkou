<?php

namespace App\Http\Controllers;

use App\Models\PendingProduct;

use Illuminate\Http\Request;

class PendingController extends Controller
{
    public function store(Request $request)
    {
        date_default_timezone_set('Asia/Manila');
        info($request);
        // function pending($item)
        // {
        //     return array(
        //         'product_key' => $item['ProductCode'],
        //         'status_id' => $item['id'],
        //         'rev_no' => $item['rev_no'],
        //         'start_date' => $item['start'],
        //         'resume_date' => $item['resume'],
        //         'duration' => $item['duration'],
        //     );
        // }
        $existingPendings = array();
        $newPendings = array();
        for ($i = 0; $i < count($request->all()); $i++) {
            // PendingProduct::firstOrCreate(array(
            //     'product_key' => $request[$i]['product_key'],
            //     'status_id' =>  $request[$i]['id'],
            //     'rev_no' =>  $request[$i]['rev_no'],
            //     'start_date' =>  $request[$i]['start'],
            //     'reason' => $request[$i]['reason'],
            //     'resume_date' =>  $request[$i]['resume'],
            //     'duration' => $request[$i]['duration']
            // ));
            if (isset($request[$i]['pending_id'])) {
                array_push($existingPendings, array(
                    'id' => isset($request[$i]['pending_id']) ? $request[$i]['pending_id'] : null,
                    'customer_code' => $request[$i]['customer_code'],
                    'affected_id' =>  $request[$i]['affected_id'],
                    'updated_by' =>  $request[$i]['updated_by'],
                    'status_id' => $request[$i]['id'],
                    'rev_no' =>  $request[$i]['rev_no'],
                    'start_date' =>  $request[$i]['start'],
                    'reason' => $request[$i]['reason'],
                    'remarks' => $request[$i]['remarks'],
                    'borrow_details' => $request[$i]['borrow_details'],
                    'resume_date' =>  $request[$i]['resume'],
                    'duration' => $request[$i]['duration']
                ));
            } else {
                array_push($newPendings, array(
                    'customer_code' => $request[$i]['customer_code'],
                    'affected_id' =>  $request[$i]['affected_id'],
                    'updated_by' =>  $request[$i]['updated_by'],
                    'status_id' => $request[$i]['id'],
                    'rev_no' =>  $request[$i]['rev_no'],
                    'start_date' =>  $request[$i]['start'],
                    'reason' => $request[$i]['reason'],
                    'remarks' => $request[$i]['remarks'],
                    'borrow_details' => $request[$i]['borrow_details'],
                    'resume_date' =>  $request[$i]['resume'],
                    'duration' => $request[$i]['duration']
                ));
            }
        }
        if (count($existingPendings) > 0) {
            PendingProduct::upsert(
                $existingPendings,
                ['id', 'status_id'],
                [
                    'resume_date', 'duration', 'reason', 'borrow_details', 'remarks', 'updated_by'
                ]
            );
        }
        if (count($newPendings) > 0) {
            PendingProduct::upsert(
                $newPendings,
                ['id', 'status_id'],
                [
                    'resume_date', 'duration', 'reason', 'borrow_details', 'remarks', 'updated_by'
                ]
            );
        }
    }
    public function showByCustomerCodeAffectedID($customer_code, $affected_id)
    {
        return PendingProduct::with('employee')->where(['customer_code' => $customer_code, 'affected_id' => $affected_id])->get();
    }

    public function showByCustomerCode($customer_code)
    {
        return PendingProduct::select()->where('customer_code', $customer_code)->get();
    }
}
