<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function borrow(Request $request)
    {
    }
    public function update(Request $request, $plan_id, $product_id)
    {
        info($request);
        // date_default_timezone_set('Asia/Manila');
        if (count($request->all()) == 2) {
            if (count(Product::where('plan_id', $plan_id)->where('log', $request[0]['log'])->get()) >= 1) {
                Product::where('plan_id', $plan_id)->where('id', $product_id)
                    ->update([
                        'updated_by' => $request[0]['updated_by'],
                        'assessment_id' => $request[0]['assessment_id'],
                        'start_date' => $request[0]['start_date'],
                        'finished_date' => $request[0]['finished_date'],
                        'log' => $request[0]['log'],
                    ]);
            } else {
                Product::where('plan_id', $plan_id)->where('id', $product_id)
                    ->update([
                        'updated_by' => $request[0]['updated_by'],
                        'assessment_id' => $request[0]['assessment_id'],
                        'start_date' => $request[0]['start_date'],
                        'finished_date' => $request[0]['finished_date'],
                        'created_at' => date('Y-m-d H:i:s'),
                        'log' => $request[0]['log'],
                    ]);
            }
            if (count(Product::where('plan_id', $plan_id)->where('id', $request[1]['id'])->whereNull('received_date')->get()) >= 1) {
                Product::where('plan_id', $plan_id)->where('id', $request[1]['id'])
                    ->update([
                        'received_date' =>  $request[1]['received_date']
                    ]);
            }
        } else if (count($request->all()) == 1) {
            Product::where(['plan_id' => $plan_id, 'id' => $product_id])
                ->update([
                    'updated_by' => isset($request[0]['updated_by']) ? $request[0]['updated_by'] : null,
                    'assessment_id' => isset($request[0]['assessment_id']) ?  $request[0]['assessment_id'] : null,
                    'start_date' => isset($request[0]['start_date']) ? $request[0]['start_date'] : null,
                    'finished_date' => isset($request[0]['finished_date']) ? $request[0]['finished_date'] : null,
                    'log' => isset($request[0]['log']) ? $request[0]['log'] : null,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
        }
        $customer_code = $request[0]['customer_code'];
        $latest_revision = Plan::where('customer_code', $customer_code)->max('rev_no');

        $revision_index = explode('-', $latest_revision);
        $products_by_revision = Product::with(['plan.employee', 'employee', 'affectedProduct.productCategory.designations', 'affectedProduct.pendings.employee', 'pendings.products' => function ($query) use ($customer_code, $revision_index) {
            $query->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index);
        }])->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index[0])->get();
        return $products_by_revision;
        // $products_by_revision = Product::with(['plan.employee', 'employee', 'affectedProduct.productCategory.designations', 'pendings.employee', 'pendings.products' => function ($query) use ($customer_code, $revision_index) {
        //     $query->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index);
        // }])->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index[0])->get();
        // // $products = Product::with(['affectedProduct', 'employee', 'affectedProduct.pendings', 'pendings', 'affectedProduct.productCategory.designations'])->where(['plan_id' => $plan_id])->get();
        // info($products_by_revision);
        // return  $products_by_revision;



        // json_encode($products_by_revision);
    }
}
