<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Detail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class AttachmentController extends Controller
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
    public function store(Request $request, $id)
    {
        info($request->all());
        info($request);
        $this->validate($request, [
            'files' => 'required',
            'files.*' => 'mimes:csv,ods,xls,xlsx,pdf,txt'
        ]);
        try {
            $henkou = Detail::find($id);
            if ($request->hasfile('files')) {
                $attachment = array();
                foreach ($request->file('files') as $file) {
                    $name = $file->getClientOriginalName();
                    $path = $file->storeAs($henkou->customer_code, $name);

                    array_push($attachment, array(
                        'detail_id' => $id,
                        'name' => $name,
                        'path' => $path
                    ));
                }

                // $files[] = $path;
                // foreach ($request->file('file') as $file) {
                //     $name = time() . rand(1, 100) . '.' . $file->extension();
                //     // $file->move(public_path('files'), $name);
                //     info($name);

                //     $file->storeAs('files', $name);
                //     $files[] = $name;
                // }
            }
            // $attachment =  Attachment::insert($attachment);
            $henkou->attachment()->createMany($attachment);
            return response()->json([
                'message' =>  'Your files has been successfully added.',
                'status' => 'Success'
            ]);
        } catch (Exception $err) {
            Log::error($err);
            return response()->json([
                'message' =>  'Failed to Upload',
                'status' => 'Failed'
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Attachment  $attachment
     * @return \Illuminate\Http\Response
     */
    public function show(Attachment $attachment, $id)
    {
        //
        $attachments = Attachment::select()->where('detail_id', $id)->get();
        return json_encode($attachments);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Attachment  $attachment
     * @return \Illuminate\Http\Response
     */
    public function edit(Attachment $attachment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Attachment  $attachment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Attachment $attachment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Attachment  $attachment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Attachment $attachment)
    {
        //
    }
}
