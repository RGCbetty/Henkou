<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Detail;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class AttachmentController extends Controller
{
    public function store(Request $request, $id)
    {

        $this->validate($request, [
            'files' => 'required',
            'files.*' => 'mimes:csv,ods,xls,xlsx,pdf,txt'
        ]);
        try {
            $henkou = Product::find($id);
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
    public function show(Attachment $attachment, $id)
    {
        //
        $attachments = Attachment::select()->where('detail_id', $id)->get();
        return json_encode($attachments);
    }

    public function destroy(Attachment $attachment)
    {
        //
    }
}
