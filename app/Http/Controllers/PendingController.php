<?php

namespace App\Http\Controllers;

use App\Models\Pending;
use Illuminate\Http\Request;

class PendingController extends Controller
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
            // Pending::firstOrCreate(array(
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
                    // 'detail_id' =>  $request[$i]['detail_id'],
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
                    // 'detail_id' =>  $request[$i]['detail_id'],
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
        // foreach ($existingPendings as $pending) {
        // }
        if (count($existingPendings) > 0) {
            Pending::upsert(
                $existingPendings,
                ['id', 'status_id'],
                [
                    'resume_date', 'duration', 'reason', 'borrow_details', 'remarks'
                ]
            );
        }
        if (count($newPendings) > 0) {
            Pending::upsert(
                $newPendings,
                ['id', 'status_id'],
                [
                    'resume_date', 'duration', 'reason', 'borrow_details', 'remarks'
                ]
            );
        }
        // Pending::insert($newPendings);

        // Pending::firstOrCreate($pendings);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Pending  $pending
     * @return \Illuminate\Http\Response
     */
    public function showByCustomerCodeAffectedID($customer_code, $affected_id)
    {
        return Pending::select()->where('customer_code', $customer_code)->where('affected_id', $affected_id)->get();
    }

    public function showByCustomerCode($customer_code)
    {
        return Pending::select()->where('customer_code', $customer_code)->get();
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Pending  $pending
     * @return \Illuminate\Http\Response
     */
    public function edit(Pending $pending)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Pending  $pending
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Pending $pending)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Pending  $pending
     * @return \Illuminate\Http\Response
     */
    public function destroy(Pending $pending)
    {
        //
    }
}
