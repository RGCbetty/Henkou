<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function recheck(Request $request)
    {
        $this->store($request);
        $products = $request->products;
        $assessments = array_column($products, 'assessment');
        $found_key = array_search(true, $assessments);
        $productsToInsert = array_map(function ($product, $key) use ($request) {
            $max_revision = Plan::where('customer_code', $request->details['customer_code'])->max('rev_no'); {
                return array(
                    'log' =>  null,
                    'updated_by' => null,
                    'customer_code' => $request->details['customer_code'],
                    'rev_no' =>  $request->details['rev_no'],
                    'start_date' => null,
                    'finished_date' => null,
                    'received_date' =>  null,
                    'is_rechecking' => 1,
                    'assessment_id' => $product['assessment'] ? 1 : 3,
                    'plan_id' => Plan::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                    'affected_id' => $product['id'],
                    'created_at' => null,

                );
            }
        }, $products, array_keys($products));
        $productsToInsert[$found_key]['received_date'] =  Carbon::now();
        Product::insert($productsToInsert);
    }
}
