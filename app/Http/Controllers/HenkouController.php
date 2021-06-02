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
    public function RegisterKouzou(Request $request)
    {
        try {
            // info($request);
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
                        'created_at' => Carbon::now(),
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
    public function RegisterTH(Request $request)
    {
        try {
            // info($request);
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
    public function update(Request $request, $id)
    {
        info($request);
        // info($id);
        date_default_timezone_set('Asia/Manila');

        if (isset($request->all()['products'])) {
            $products = $request->input('products');
            if (isset($request->all()['details'])) {
                $latest_revision = Plan::where('customer_code', $request->details['customer_code'])->max('rev_no');
                $plan = new Plan([
                    'customer_code' => $request->details['customer_code'],
                    // 'plan_no' => $request->details['plan_no'],
                    'rev_no' => ++$latest_revision,
                    // 'plan_specification' => $request->details['plan_specification'],
                    // 'house_code' => $request->details['house_code'],
                    // 'house_type' => $request->details['house_type'],
                    // 'method' => $request->details['method'],
                    'th_no' => $request->details['th_no'],
                    // 'floors' => $request->details['floors'],
                    'reason_id' => $request->details['reason_id'],
                    'type_id' => $request->details['type_id'],
                    'plan_status_id' => $request->details['plan_status_id'],
                    'department_id' => isset($request->details['department_id']) ? $request->details['department_id'] : null,
                    // 'invoice_id' => Invoice::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    // 'construction_schedule_id' => ConstructionSchedule::select('id')->where('customer_code', $request->details['customer_code'])->first()->id,
                    'updated_by' => $request->details['updated_by']
                ]);
                $plan->save();
            }
            $maxDetailId = Plan::where('customer_code', $request->details['customer_code'])->max('id');
            $statusToCreate = array_map(function ($stat, $key) use ($request, $maxDetailId) {

                // if ((isset($stat['start_date']) && isset($stat['finished_date']) || ($stat['assessment_id'] !== 1 && !empty($stat['assessment_id'])))) {
                if ($request->input('sectionCode') == "00465") {
                    /* ANY LOGS */
                    if (isset($request->all()['row'])) {
                        if (!empty($request->input('row')['log'])) {
                            if ($key == 0) {
                                return [
                                    "received_date" => $stat['received_date'],
                                    "updated_by" => $stat['updated_by'],
                                    "created_at" =>  Carbon::now(),
                                    'customer_code' =>  $stat['customer_code'],
                                    'rev_no' =>  ++$stat['rev_no'],
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => $stat['assessment_id'],
                                    "plan_id" => $maxDetailId,
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
                                    "created_at" =>  Carbon::now(),
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => null,
                                    "start_date" =>  null,
                                    "finished_date" =>  null,
                                    "plan_id" => $maxDetailId,
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
                                //         "plan_id" => $maxDetailId,
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
                                    "created_at" =>  Carbon::now(),
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => null,
                                    "plan_id" => $maxDetailId,
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
                                    "created_at" =>  Carbon::now(),
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => null,
                                    "start_date" =>  null,
                                    "finished_date" =>  null,
                                    "plan_id" => $maxDetailId,
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
                                    "plan_id" => $maxDetailId,
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
                                    "created_at" =>  Carbon::now(),
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => null,
                                    "plan_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            }
                        }
                    }
                } else {
                    if (isset($request->all()['row'])) {
                        if (!empty($request->input('row')['log'])) {
                            if ($key == 0) {
                                return [
                                    "received_date" => $stat['received_date'],
                                    "updated_by" => $stat['updated_by'],
                                    "created_at" =>  Carbon::now(),
                                    'customer_code' =>  $stat['customer_code'],
                                    'rev_no' =>  ++$stat['rev_no'],
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => $stat['assessment_id'],
                                    "plan_id" => $maxDetailId,
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
                                    "created_at" =>  Carbon::now(),
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => null,
                                    "start_date" =>  null,
                                    "finished_date" =>  null,
                                    "plan_id" => $maxDetailId,
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
                                    "created_at" =>  Carbon::now(),
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => null,
                                    "plan_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            }
                        } else {
                            // info('borrow form');
                            if ($key == 0) {
                                return [
                                    "received_date" => $stat['received_date'],
                                    "updated_by" => $stat['updated_by'],
                                    "created_at" =>  Carbon::now(),
                                    'customer_code' =>  $stat['customer_code'],
                                    'rev_no' =>   ++$stat['rev_no'],
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => $stat['assessment_id'],
                                    "plan_id" => $maxDetailId,
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
                                    "created_at" =>  Carbon::now(),
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => null,
                                    "start_date" =>  null,
                                    "finished_date" =>  null,
                                    "plan_id" => $maxDetailId,
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
                                    "plan_id" => $maxDetailId,
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
                                    "created_at" =>  Carbon::now(),
                                    "updated_at" => Carbon::now(),
                                    "assessment_id" => null,
                                    "plan_id" => $maxDetailId,
                                    'affected_id' => $stat['affected_id'],
                                ];
                            }
                        }
                    }
                }
                // } else {
                // return [];
                // }
            },  $products, array_keys($products));
            // $removeEmptyToStatusToCreate = array_filter(
            //     $statusToCreate,
            //     function ($stat) {
            //         return  $stat;
            //     }
            // );
            // info($statusToCreate);
            Product::insert($statusToCreate);
            info(app(DetailController::class)->plan($request->details['customer_code'])['products']);
            return response()->json([
                'details' => app(DetailController::class)->plan($request->details['customer_code'])['details'],
                'products' =>  app(DetailController::class)->plan($request->details['customer_code'])['products']
            ]);
        }
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
