<?php

namespace App\Http\Controllers;

use App\Models\AffectedProduct;
use Illuminate\Http\Request;
use App\Models\ConstructionSchedule;
use App\Models\Detail;
use App\Models\Plan;
use App\Models\Product;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
// use PhpOffice\PhpSpreadsheet\IOFactory;

class HenkouController extends Controller
{

    public function products($customer_code, $revision_index, $affected_id)
    {
        // info($customer_code);
        // $test = Product::find(1);
        // info($test->details);
        $products = Product::with(['employee', 'plan' => function ($query) use ($customer_code, $revision_index) {
            $query->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index);
        }, 'affectedProduct', 'affectedProduct.productCategory.designations.department', 'affectedProduct.productCategory.designations.section', 'affectedProduct.productCategory.designations.team', 'affectedProduct.pendings' => function ($query) use ($customer_code, $revision_index) {
            $query->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index);
        }])->where(['affected_id' => $affected_id, 'customer_code' => $customer_code])->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index)->get();
        info($products);
        $sorted = $products->sortBy('id');


        // $tempArr = array_unique(array_column($sorted->values()->all(), 'affected_id'));
        // $tempCollection = collect(array_intersect_key($sorted->values()->all(), $tempArr));
        // $sortedByAffectedId = $tempCollection->sortBy('affected_id');
        return  $sorted->values()->all();
    }
    public function henkouLogs($customer_code, $revision_index)
    {
        // info($customer_code);
        // $test = Product::find(1);
        // info($test->details);
        $products = Product::with(['employee', 'plan' => function ($query) use ($customer_code, $revision_index) {
            $query->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index);
        }, 'affectedProduct',  'affectedProduct.productCategory.designations.department', 'affectedProduct.productCategory.designations.section', 'affectedProduct.productCategory.designations.team', 'pendings' => function ($query) use ($customer_code, $revision_index) {
            $query->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index);
        }])->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index)->get();
        return $products;
    }
    public function showByCustomerCode($customer_code)
    {
        // info($customer_code);
        // $test = Product::find(1);
        // info($test->details);
        $products = Product::with('plan.details')->select('log', 'updated_by', 'detail_id', 'affected_id', 'created_at')->where('customer_code', $customer_code)->get();
        return $products;
    }
    public function registerKouzou(Request $request)
    {
        try {
            info($request);
            $this->store($request);
            $products = AffectedProduct::select()->where(['plan_status_id' => $request->details['plan_status_id']])->get()->toArray();
            $productsToInsert = array_map(function ($product, $key) use ($request) {
                $max_revision = Plan::where('customer_code', $request->details['customer_code'])->max('rev_no');

                if ($key == 0) {
                    return array(
                        'log' => null,
                        'updated_by' => $request->details['updated_by'],
                        // 'product_key' => $request->product[$i]['product_category_id'],
                        'rev_no' =>  $request->details['rev_no'],
                        'customer_code' =>  $request->details['customer_code'],
                        'start_date' => null,
                        'finished_date' =>  null,
                        'received_date' =>  null,
                        'assessment_id' => 3,
                        'plan_id' => Plan::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                        'affected_id' => $product['id'],
                        'created_at' => null,
                        // 'created_at' => date('Y-m-d H:i:s'),
                        // 'updated_at' => date('Y-m-d H:i:s')
                    );
                } else if ($key == 1) {
                    return array(
                        'log' => null,
                        'updated_by' => $request->details['updated_by'],
                        // 'product_key' => $request->product[$i]['product_category_id'],
                        'rev_no' =>  $request->details['rev_no'],
                        'customer_code' =>  $request->details['customer_code'],
                        'start_date' => null,
                        'finished_date' => null,
                        'received_date' => Carbon::now(),
                        'assessment_id' => null,
                        'plan_id' => Plan::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                        'affected_id' => $product['id'],
                        'created_at' => date('Y-m-d H:i:s'),
                        // 'updated_at' => date('Y-m-d H:i:s')
                    );
                } else {
                    return array(
                        'log' =>  null,
                        'updated_by' => null,
                        'customer_code' =>  $request->details['customer_code'],
                        'rev_no' =>  $request->details['rev_no'],
                        'start_date' => null,
                        'finished_date' => null,
                        'received_date' =>   null,
                        'assessment_id' => null,
                        'plan_id' => Plan::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                        'affected_id' => $product['id'],
                        'created_at' => null,
                    );
                }
            }, $products, array_keys($products));
            Product::insert($productsToInsert);
        } catch (Exception $error) {
            Log::error($error);
        }
    }
    public function registerTh(Request $request)
    {
        try {
            info($request);
            $this->store($request);
            $products = AffectedProduct::select()->where(['plan_status_id' => $request->row['plan_status']['id']])->get()->toArray();
            $productsToInsert = array_map(function ($product, $key) use ($request) {
                $max_revision = Plan::where('customer_code', $request->details['customer_code'])->max('rev_no');
                if ($key == 0) {
                    return array(
                        'log' =>  $request->details['logs'],
                        'updated_by' => $request->details['updated_by'],
                        'customer_code' => $request->details['customer_code'],
                        'rev_no' =>  $request->details['rev_no'],
                        'start_date' => isset($request->row['start_date']) ? $request->row['start_date'] : null,
                        'finished_date' => isset($request->row['finished_date']) ? $request->row['finished_date'] : null,
                        'received_date' => isset($request->row['RequestAcceptedDate']) ? $request->row['RequestAcceptedDate'] : null,
                        'assessment_id' => 1,
                        'plan_id' => Plan::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                        'affected_id' => $product['id'],
                        'created_at' => date('Y-m-d H:i:s'),
                    );
                } else if ($key == 1) {
                    return array(
                        'log' =>  null,
                        'updated_by' => null,
                        'customer_code' => $request->details['customer_code'],
                        'rev_no' =>  $request->details['rev_no'],
                        'start_date' => null,
                        'finished_date' => null,
                        'received_date' =>  isset($request->row['finished_date']) ? $request->row['finished_date'] : null,
                        'assessment_id' => null,
                        'plan_id' => Plan::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                        'affected_id' => $product['id'],
                        'created_at' => null,
                    );
                } else {
                    return array(
                        'log' =>  null,
                        'updated_by' => null,
                        'customer_code' => $request->details['customer_code'],
                        'rev_no' =>  $request->details['rev_no'],
                        'start_date' => null,
                        'finished_date' => null,
                        'received_date' =>  null,
                        'assessment_id' => null,
                        'plan_id' => Plan::select('id')->where('customer_code', $request->details['customer_code'])->where('rev_no', $max_revision)->first()->id,
                        'affected_id' => $product['id'],
                        'created_at' => null,

                    );
                }
            }, $products, array_keys($products));
            Product::insert($productsToInsert);
        } catch (Exception $error) {
            Log::error($error);
        }
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($request)
    {
        try {
            date_default_timezone_set('Asia/Manila');
            if (Detail::where(['customer_code' => $request->details['customer_code'], 'plan_no' =>  $request->details['plan_no']])->first()) {
                // $detail = new Detail([
                //     'customer_code' => $request->details['customer_code'],
                //     'plan_no' => $request->details['plan_no'],
                //     'rev_no' => $request->details['rev_no'],
                //     'plan_specification' => $request->details['plan_specification'],
                //     'house_code' => $request->details['house_code'],
                //     'house_type' => $request->details['house_type'],
                //     'method' => $request->details['method'],
                //     'logs' => $request->details['logs'],
                //     'th_no' => $request->details['th_no'],
                //     'floors' => $request->details['floors'],
                //     'reason_id' => $request->details['reason_id'],
                //     'type_id' => $request->details['type_id'],
                //     'plan_status_id' => $request->details['plan_status_id'],
                //     'department_id' => isset($request->details['department_id']) ? $request->details['department_id'] : null,
                //     'invoice_id' => Invoice::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                //     'construction_schedule_id' => ConstructionSchedule::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                //     'updated_by' => $request->details['updated_by']
                // ]);

                $plan = new Plan([
                    'customer_code' => $request->details['customer_code'],
                    'rev_no' => $request->details['rev_no'],
                    'logs' => $request->details['logs'],
                    'th_no' => $request->details['th_no'],
                    'reason_id' => $request->details['reason_id'],
                    'type_id' => $request->details['type_id'],
                    'plan_status_id' => $request->details['plan_status_id'],
                    // 'details_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'department_id' => isset($request->details['department_id']) ? $request->details['department_id'] : null,
                    'updated_by' => $request->details['updated_by']
                ]);

                $plan->save();
            } else {
                // $invoice = new Invoice([
                //     'customer_code' => $request->details['customer_code'],
                //     'dodai_invoice' => $request->details['dodai_invoice'],
                //     '1f_panel_invoice' => $request->details['1F_panel_invoice'],
                //     '1f_hari_invoice' => $request->details['1F_hari_invoice'],
                //     '1f_iq_invoice' => $request->details['1F_iq_invoice']
                // ]);
                $construction_schedule = new ConstructionSchedule([
                    'customer_code' => $request->details['customer_code'],
                    'plan_no' => $request->details['plan_no'],
                    'joutou_date' => $request->details['joutou_date'],
                    'days_before_joutou' => $request->details['days_before_joutou'],
                    'kiso_start' => $request->details['kiso_start'],
                    'days_before_kiso_start' => $request->details['before_kiso_start'],
                ]);

                // $invoice->save();
                $construction_schedule->save();
                $detail = new Detail([
                    'customer_code' => $request->details['customer_code'],
                    'plan_no' => $request->details['plan_no'],
                    'house_code' => $request->details['house_code'],
                    'house_type' => $request->details['house_type'],
                    'method' => $request->details['method'],
                    'floors' => $request->details['floors'],
                    // 'invoice_id' => Invoice::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    // 'construction_schedule_id' => ConstructionSchedule::select('id')->where('customer_code',  $request->details['customer_code'])->first()->id,
                    'updated_by' => $request->details['updated_by']
                ]);
                $detail->save();

                $plan = new Plan([
                    'customer_code' => $request->details['customer_code'],
                    'rev_no' => $request->details['rev_no'],
                    'logs' => $request->details['logs'],
                    'th_no' => $request->details['th_no'],
                    'reason_id' => $request->details['reason_id'],
                    'type_id' => $request->details['type_id'],
                    'plan_status_id' => $request->details['plan_status_id'],
                    // 'details_id' => Detail::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'department_id' => isset($request->details['department_id']) ? $request->details['department_id'] : null,
                    'updated_by' => $request->details['updated_by']
                ]);

                $plan->save();
            }
        } catch (Exception $error) {
            Log::error($error);
        }
    }
    public function showStatusByDetailID($customer_code, $detail_id)
    {
        $array = Product::with(['affectedProduct', 'affectedProduct.productCategory.designations'])->where(['plan_id' => $detail_id, 'customer_code' => $customer_code])->get();
        $sorted = $array->sortByDesc('id');
        info($sorted);

        $tempArr = array_unique(array_column($sorted->values()->all(), 'affected_id'));
        $tempCollection = collect(array_intersect_key($sorted->values()->all(), $tempArr));
        $sortedByAffectedId = $tempCollection->sortBy('affected_id');
        // info($sortedByAffectedId->values()->all());
        return $sortedByAffectedId->values()->all();
    }
    public function showProductLogsByAffectedID($customer_code, $affected_id)
    {
        $array = Product::select('log', 'created_at')->where(['affected_id' => $affected_id, 'customer_code' => $customer_code])->get();
        return $array;
    }
    public function showStatusByAffectedID($customer_code, $affected_id)
    {

        $array = Product::where(['affected_id' => $affected_id, 'customer_code' => $customer_code])->get();
        return $array;
    }
    public function update(Request $request, $id)
    {
        date_default_timezone_set('Asia/Manila');
        if (isset($request->all()['status'])) {
            $status = $request->input('status');
            if (isset($request->all()['details'])) {
                $latest_revision = Detail::where('customer_code', $request->details['customer_code'])->max('rev_no');
                $detail = new Detail([
                    'customer_code' => $request->details['customer_code'],
                    'plan_no' => $request->details['plan_no'],
                    'rev_no' => ++$latest_revision,
                    'plan_specification' => $request->details['plan_specification'],
                    'house_code' => $request->details['house_code'],
                    'house_type' => $request->details['house_type'],
                    'method' => $request->details['method'],
                    'th_no' => $request->details['th_no'],
                    'floors' => $request->details['floors'],
                    'reason_id' => $request->details['reason_id'],
                    'type_id' => $request->details['type_id'],
                    'plan_status_id' => $request->details['plan_status_id'],
                    'department_id' => isset($request->details['department_id']) ? $request->details['department_id'] : null,
                    // 'invoice_id' => Invoice::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'construction_schedule_id' => ConstructionSchedule::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'updated_by' => $request->details['updated_by']
                ]);
                $detail->save();
            }
            $maxDetailId = Detail::where('customer_code', $request->details['customer_code'])->max('id');
            $statusToCreate = array_map(function ($stat, $key) use ($request, $maxDetailId) {
                // if ((isset($stat['start_date']) && isset($stat['finished_date']) || ($stat['assessment_id'] !== 1 && !empty($stat['assessment_id'])))) {
                if ($request->input('sectionCode') == "00465") {
                    /* ANY LOGS */
                    if (isset($request->all()['row'])) {
                        if (isset($request->input('row')['log']) && array_key_exists('log', $request->input('row'))) {
                            if (!empty($request->input('row')['log'])) {
                                if ($key == 0) {
                                    return [
                                        "received_date" => $stat['received_date'],
                                        "updated_by" => $stat['updated_by'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => $stat['assessment_id'],
                                        "detail_id" => $maxDetailId,
                                        "start_date" =>  $stat['start_date'],
                                        "finished_date" =>  $stat['finished_date'],
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else if ($key == 1) {
                                    // if ($request->input('row')['sequence'] == 2) {
                                    //     return [];
                                    // }
                                    return [
                                        "received_date" => Carbon::now(),
                                        "updated_by" => null,
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "start_date" =>  null,
                                        "finished_date" =>  null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else {
                                    // if ($request->input('row')['sequence'] == 2 && $key == 3) {
                                    //     return [
                                    //         "received_date" => Carbon::now(),
                                    //         "updated_by" => null,
                                    //         "created_at" =>  date('Y-m-d H:i:s'),
                                    //         "updated_at" => date('Y-m-d H:i:s'),
                                    //         "assessment_id" => null,
                                    //         "detail_id" => $maxDetailId,
                                    //         'affected_id' => $stat['affected_id'],
                                    //     ];
                                    // }
                                    return [
                                        "received_date" => null,
                                        "updated_by" => null,
                                        "start_date" =>  null,
                                        "finished_date" =>  null,
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                }
                            } else {
                                // info('borrow form');
                                if ($key == 0) {
                                    return [
                                        "received_date" => Carbon::now(),
                                        "updated_by" => null,
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "start_date" =>  null,
                                        "finished_date" =>  null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else if ($stat['affected_id'] == $request->input('row')['affected_id']) {
                                    return [
                                        "received_date" => $stat['received_date'],
                                        "updated_by" => $stat['updated_by'],
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "created_at" =>   Carbon::parse($stat['updated_at']),
                                        "updated_at" =>  Carbon::parse($stat['updated_at']),
                                        "start_date" =>  $stat['start_date'],
                                        "finished_date" =>  $stat['finished_date'],
                                        "assessment_id" => $stat['assessment_id'],
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else {
                                    return [
                                        "received_date" => null,
                                        "updated_by" => null,
                                        "start_date" =>  null,
                                        "finished_date" =>  null,
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                }
                            }
                        } else {
                            // info('borrow form');
                            if ($key == 0) {
                                return [
                                    "received_date" => Carbon::now(),
                                    "updated_by" => null,
                                    'customer_code' =>  $stat['customer_code'],
                                    'rev_no' =>  ++$stat['rev_no'],
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "start_date" =>  null,
                                    "finished_date" =>  null,
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else if ($stat['affected_id'] == $request->input('row')['affected_id']) {
                                return [
                                    "received_date" => $stat['received_date'],
                                    "updated_by" => $stat['updated_by'],
                                    'customer_code' =>  $stat['customer_code'],
                                    'rev_no' =>  ++$stat['rev_no'],
                                    "created_at" =>   Carbon::parse($stat['updated_at']),
                                    "updated_at" =>  Carbon::parse($stat['updated_at']),
                                    "start_date" =>  $stat['start_date'],
                                    "finished_date" =>  $stat['finished_date'],
                                    "assessment_id" => $stat['assessment_id'],
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else {
                                return [
                                    "received_date" => null,
                                    "updated_by" => null,
                                    "start_date" =>  null,
                                    "finished_date" =>  null,
                                    'customer_code' =>  $stat['customer_code'],
                                    'rev_no' =>  ++$stat['rev_no'],
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            }
                        }
                    }
                } else {
                    if (isset($request->all()['row'])) {
                        if (isset($request->input('row')['log']) && array_key_exists('log', $request->input('row'))) {
                            if (!empty($request->input('row')['log'])) {
                                if ($key == 0) {
                                    return [
                                        "received_date" => $stat['received_date'],
                                        "updated_by" => $stat['updated_by'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => $stat['assessment_id'],
                                        "detail_id" => $maxDetailId,
                                        "start_date" =>  $stat['start_date'],
                                        "finished_date" =>  $stat['finished_date'],
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else if ($key == 1) {
                                    // if ($request->input('row')['sequence'] == 2) {
                                    //     return [];
                                    // }
                                    return [
                                        "received_date" => Carbon::now(),
                                        "updated_by" => null,
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "start_date" =>  null,
                                        "finished_date" =>  null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else {
                                    // if ($request->input('row')['sequence'] == 2 && $key == 3) {
                                    //     return [
                                    //         "received_date" => Carbon::now(),
                                    //         "updated_by" => null,
                                    //         "created_at" =>  date('Y-m-d H:i:s'),
                                    //         "updated_at" => date('Y-m-d H:i:s'),
                                    //         "assessment_id" => null,
                                    //         "detail_id" => $maxDetailId,
                                    //         'affected_id' => $stat['affected_id'],
                                    //     ];
                                    // }
                                    return [
                                        "received_date" => null,
                                        "updated_by" => null,
                                        "start_date" =>  null,
                                        "finished_date" =>  null,
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                }
                            } else {
                                // info('borrow form');
                                if ($key == 0) {
                                    return [
                                        "received_date" => $stat['received_date'],
                                        "updated_by" => $stat['updated_by'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => $stat['assessment_id'],
                                        "detail_id" => $maxDetailId,
                                        "start_date" =>  $stat['start_date'],
                                        "finished_date" =>  $stat['finished_date'],
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else if ($key == 1) {
                                    return [
                                        "received_date" => Carbon::now(),
                                        "updated_by" => null,
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "start_date" =>  null,
                                        "finished_date" =>  null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else if ($stat['affected_id'] == $request->input('row')['affected_id']) {
                                    return [
                                        "received_date" => $stat['received_date'],
                                        "updated_by" => $stat['updated_by'],
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "created_at" =>   Carbon::parse($stat['updated_at']),
                                        "updated_at" =>  Carbon::parse($stat['updated_at']),
                                        "start_date" =>  $stat['start_date'],
                                        "finished_date" =>  $stat['finished_date'],
                                        "assessment_id" => $stat['assessment_id'],
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                } else {
                                    return [
                                        "received_date" => null,
                                        "updated_by" => null,
                                        "start_date" =>  null,
                                        "finished_date" =>  null,
                                        'customer_code' =>  $stat['customer_code'],
                                        'rev_no' =>  ++$stat['rev_no'],
                                        "created_at" =>  date('Y-m-d H:i:s'),
                                        "updated_at" => date('Y-m-d H:i:s'),
                                        "assessment_id" => null,
                                        "detail_id" => $maxDetailId,
                                        'affected_id' => $stat['affected_id'],
                                    ];
                                }
                            }
                        } else {
                            // info('borrow form');
                            if ($key == 0) {
                                return [
                                    "received_date" => $stat['received_date'],
                                    "updated_by" => $stat['updated_by'],
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    'customer_code' =>  $stat['customer_code'],
                                    'rev_no' =>   ++$stat['rev_no'],
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => $stat['assessment_id'],
                                    "detail_id" => $maxDetailId,
                                    "start_date" =>  $stat['start_date'],
                                    "finished_date" =>  $stat['finished_date'],
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else if ($key == 1) {
                                return [
                                    "received_date" => Carbon::now(),
                                    "updated_by" => null,
                                    'customer_code' =>  $stat['customer_code'],
                                    'rev_no' =>   ++$stat['rev_no'],
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "start_date" =>  null,
                                    "finished_date" =>  null,
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else if ($stat['affected_id'] == $request->input('row')['affected_id']) {
                                return [
                                    "received_date" => $stat['received_date'],
                                    "updated_by" => $stat['updated_by'],
                                    'customer_code' =>  $stat['customer_code'],
                                    'rev_no' =>   ++$stat['rev_no'],
                                    "created_at" =>   Carbon::parse($stat['updated_at']),
                                    "updated_at" =>  Carbon::parse($stat['updated_at']),
                                    "start_date" =>  $stat['start_date'],
                                    "finished_date" =>  $stat['finished_date'],
                                    "assessment_id" => $stat['assessment_id'],
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            } else {
                                return [
                                    "received_date" => null,
                                    "updated_by" => null,
                                    "start_date" =>  null,
                                    "finished_date" =>  null,
                                    'customer_code' =>  $stat['customer_code'],
                                    'rev_no' =>   ++$stat['rev_no'],
                                    "created_at" =>  date('Y-m-d H:i:s'),
                                    "updated_at" => date('Y-m-d H:i:s'),
                                    "assessment_id" => null,
                                    "detail_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            }
                        }
                    }
                }
                // } else {
                // return [];
                // }
            },  $status, array_keys($status));
            // $removeEmptyToStatusToCreate = array_filter(
            //     $statusToCreate,
            //     function ($stat) {
            //         return  $stat;
            //     }
            // );
            // info($statusToCreate);
            Product::insert($statusToCreate);
            $maxDetailId = Detail::where('customer_code', $request->details['customer_code'])->max('id');
            $array = Product::with(['employee', 'details', 'affectedProduct', 'affectedProduct.productCategory.designations', 'affectedProduct.pendings'])->where('detail_id', $maxDetailId)->get();
            return $array;
        } else {
            if (count($request->all()) == 2) {
                if (count(Product::where('detail_id', $id)->where('log', $request[0]['log'])->get()) >= 1) {
                    Product::where('detail_id', $id)->where('id', $request[0]['id'])
                        ->update([
                            'updated_by' => $request[0]['updated_by'],
                            'assessment_id' => $request[0]['assessment_id'],
                            'start_date' => $request[0]['start_date'],
                            'finished_date' => $request[0]['finished_date'],
                            'log' => $request[0]['log'],
                        ]);
                } else {
                    Product::where('detail_id', $id)->where('id', $request[0]['id'])
                        ->update([
                            'updated_by' => $request[0]['updated_by'],
                            'assessment_id' => $request[0]['assessment_id'],
                            'start_date' => $request[0]['start_date'],
                            'finished_date' => $request[0]['finished_date'],
                            'created_at' => date('Y-m-d H:i:s'),
                            'log' => $request[0]['log'],
                        ]);
                }
                if (count(Product::where('detail_id', $id)->where('id', $request[1]['id'])->whereNull('received_date')->get()) >= 1) {
                    Product::where('detail_id', $id)->where('id', $request[1]['id'])
                        ->update([
                            'received_date' =>  $request[1]['received_date']
                        ]);
                }
            } else if (count($request->all()) == 1) {
                Product::where('detail_id', $id)->where('id', $request['products']['id'])
                    ->update([
                        'updated_by' => isset($request['products']['updated_by']) ? $request['products']['updated_by'] : null,
                        'assessment_id' => isset($request['products']['assessment_id']) ?  $request['products']['assessment_id'] : null,
                        'start_date' => isset($request['products']['start_date']) ? $request['products']['start_date'] : null,
                        'finished_date' => isset($request['products']['finished_date']) ? $request['products']['finished_date'] : null,
                        'log' => isset($request['products']['log']) ?  $request['products']['log'] : null,
                        'created_at' => date('Y-m-d H:i:s'),
                    ]);
            }
        }
        // $maxDetailId = Detail::where('customer_code', $request->details['customer_code'])->max('id');
        $array = Product::with(['employee', 'details', 'affectedProduct', 'affectedProduct.productCategory.department', 'affectedProduct.productCategory.section', 'affectedProduct.productCategory.team', 'affectedProduct.pendings'])->where('detail_id', $id)->get();
        // info(json_decode($array));
        $sorted = $array->sortByDesc('id');
        // info($sorted->values()->all());
        $tempArr = array_unique(array_column($sorted->values()->all(), 'affected_id'));
        $tempCollection = collect(array_intersect_key($sorted->values()->all(), $tempArr));
        // info($tempCollection->values()->all());
        $sortedByAffectedId = $tempCollection->sortBy('affected_id');

        return $sortedByAffectedId->values()->all();
        // Product::where('');
        // $status = Product::find($request);
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
