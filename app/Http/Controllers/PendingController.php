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
        $pendings = array();
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
            array_push($pendings, array(
                'id' => isset($request[$i]['pending_id']) ? $request[$i]['pending_id'] : null,
                'product_key' => $request[$i]['product_key'],
                'status_id' =>  $request[$i]['id'],
                'rev_no' =>  $request[$i]['rev_no'],
                'start_date' =>  $request[$i]['start'],
                'reason' => $request[$i]['reason'],
                'resume_date' =>  $request[$i]['resume'],
                'duration' => $request[$i]['duration']
            ));
        }
        Pending::upsert(
            $pendings,
            ['id', 'status_id'],
            [
                'resume_date', 'duration'
            ]
        );
        // info($pendings);
        // Pending::firstOrCreate($pendings);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Pending  $pending
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Pending::select()->where('status_id', $id)->get();
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
