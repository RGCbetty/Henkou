<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Detail;
use App\Models\Plan;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DetailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Detail::all();
    }
    public function plan($customer_code)
    {
        $latest_revision = Plan::where('customer_code', $customer_code)->max('rev_no');
        $latest_plan = Plan::with(['details', 'planStatus', 'details.construction_schedule'])->where('customer_code', $customer_code)->where('rev_no', $latest_revision)->first();
        // info($latest_plan);
        if ($latest_plan) {
            $invoice = DB::connection('sqlsrv')->select(DB::raw("SELECT A.InvoiceID,A.DepartmentCode,B.InvoiceName,B.Invoice  FROM M_InvoiceList A
            INNER JOIN
                (
                  (SELECT A.InvoiceID,A.InvoiceName,
                          B.ConstructionMaterialCode + CAST(B.RequestWeek AS VARCHAR) + '-' + SUBSTRING(CAST(B.RequestYear AS VARCHAR),3,2) + B.RequestDestination AS Invoice
                   FROM M_InvoiceListCondition A
                    INNER JOIN hrdsql.hrdinformationservice.dbo.ShipmentRequests B
                        ON A.ConstructionMaterialCode = B.ConstructionMaterialCode
                        AND A.ConstructionMaterialDetailCode = B.ConstructionMaterialDetailCode
                        AND A.Floor = B.Floor
                        AND  B.ConstructionCode ='$customer_code'

                        AND A.DeletedDate IS NULL)
                    ) B
            ON A.InvoiceID=B.InvoiceID
            AND (A.DepartmentCode='0' OR A.DepartmentCode='0123')
            AND A.DeletedDate IS NULL
            "));
            // $invoice = DB::connection('sqlsrv')->select(DB::raw("SELECT * FROM getInvoice ('$id')"));
            // $plan_specs = DB::connection('sqlsrv')->select(DB::raw("SELECT * FROM getPlanSpecs ('$id')"));
            $plan_specification = DB::connection('sqlsrv')->select(DB::raw("SELECT A.SpecsID,A.SpecificationName,Count(*) AS 'No.of Link'  FROM M_PlanSpecification A
            INNER JOIN
                (
                  (SELECT A.* FROM M_PlanSpecificationCondition A
                    INNER JOIN hrdsql.hrdinformationservice.dbo.BasicSpecificationDetails B
                        ON A.BasicSpecificationCode = B.BasicSpecificationCode
                        AND A.SpecificationDetailCode = B.SpecificationDetailCode
                        AND  B.ConstructionCode = '$customer_code'
                        AND A.DeletedDate IS NULL)
                    ) B
            ON A.SpecsID=B.SpecsID
            AND A.DeletedDate IS NULL
            GROUP BY A.SpecsID,A.SpecificationName"));
            $InvoiceMapped = array();
            $latest_plan['specification'] = implode(', ', array_map(function ($entry) {
                return $entry['SpecificationName'];
            }, json_decode(json_encode($plan_specification), true)));
            foreach (json_decode(json_encode($invoice), true)  as $value) {
                $InvoiceMapped["{$value['InvoiceName']}"] = $value['Invoice'];
                // $PlanSpecsMapped =
            }
            $plan = array_merge($InvoiceMapped, json_decode(json_encode($latest_plan), true));
            $revision_index = explode('-', $latest_revision);

            return [
                'details' => $plan,
                'products' => $this->products($customer_code, $revision_index)
            ];
        } else {
            throw new Exception("Henkou plan not found!");
        }
    }
    public function products($customer_code, $revision_index)
    {
        $products_by_revision = Product::with(['plan.employee', 'employee', 'affectedProduct.productCategory.designations', 'affectedProduct.pendings.employee', 'pendings.products' => function ($query) use ($customer_code, $revision_index) {
            $query->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index);
        }])->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index[0])->get();
        return $products_by_revision;
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function latest($customer_code)
    {
        try {
            $assessment = Assessment::all();
            // LATEST PRODUCTS
            // info($latest_plan);
            // $products = Product::with(['affectedProduct', 'employee', 'affectedProduct.pendings', 'pendings', 'affectedProduct.productCategory.designations'])->where(['plan_id' => $latest_plan->id, 'customer_code' => $customer_code])->get();
            // $sorted = $products->sortByDesc('id');
            // $tempArr = array_unique(array_column($sorted->values()->all(), 'affected_id'));
            // $tempCollection = collect(array_intersect_key($sorted->values()->all(), $tempArr));
            // $sortedByAffectedId = $tempCollection->sortBy('affected_id');
            // $sorted_products = $sortedByAffectedId->values()->all();

            // PRODUCTS BY REVISION FIRST INDEX

            // return $products;
            return response()->json([
                'HenkouPlan' =>  $this->plan($customer_code)['details'],
                "ProductsByFirstIndexRevision" => $this->plan($customer_code)['products'],
                // 'PlanSpecification' =>  $plan_specification,
                // 'Invoice' => $invoice,
                'Assessment' => $assessment
                // 'LatestProducts' =>  $sorted_products,
            ]);
        } catch (Exception $e) {
            return response($e->getMessage(), 204);
            Log::error($e->getMessage());
        }
    }
    // public function store(Request $request)
    // {
    //     //

    //     try {
    //         $detail = new Detail;
    //         $invoice = new Invoice;
    //         $construction_schedule = new ConstructionSchedule;

    //         if (Detail::find($request->details_id)) {
    //             //    foreach($data as $key => $value) {

    //             //    }
    //             $rev_no = $request->rev_no;
    //             $pieces = explode("-", $rev_no);
    //             $max = Detail::where('id', $request->details_id)->max('rev_no');
    //             $detail->id = $request->id;
    //             $detail->customer_code = $request->customer_code;
    //             $detail->house_code = $request->house_code;
    //             $detail->house_type = $request->house_type;
    //             $detail->plan_no = $request->plan_no;
    //             $detail->plan_specification = $request->plan_specification;
    //             $detail->rev_no = ++$max;
    //             $detail->type_id = $request->type_id;
    //             $detail->reason_id = $request->reason_id;
    //             $detail->logs = $request->logs;
    //             $detail->updated_by = $request->updated_by;
    //             $detail->floors = $request->floors;
    //             $detail->department_id = $request->department_id;
    //             $detail->section_id = $request->section_id;
    //             $detail->team_id = $request->team_id;
    //             $detail->created_at = date('Y-m-d H:i:s');
    //             $detail->updated_at = date('Y-m-d H:i:s');
    //         } else {
    //             $detail->id = $request->details_id;
    //             $detail->customer_code = $request->customer_code;
    //             $detail->house_code = $request->house_code;
    //             $detail->house_type = $request->house_type;
    //             $detail->plan_no = $request->plan_no;
    //             $detail->plan_specification = $request->plan_specification;
    //             $detail->rev_no = $request->rev_no;
    //             $detail->type_id = $request->type_id;
    //             $detail->reason_id = $request->reason_id;
    //             $detail->logs = $request->logs;
    //             $detail->updated_by = $request->updated_by;
    //             $detail->floors = $request->floors;
    //             $detail->department_id = $request->department_id;
    //             $detail->section_id = $request->section_id;
    //             $detail->team_id = $request->team_id;
    //             $invoice->dodai_invoice = $request->dodai_invoice;
    //             $invoice->{'1f_panel_invoice'} = $request->{'1F_panel_invoice'};
    //             $invoice->{'1f_hari_invoice'} = $request->{'1F_hari_invoice'};
    //             $invoice->{'1f_iq_invoice'} = $request->{'1F_iq_invoice'};
    //             $invoice->customer_code = $request->customer_code;
    //             $construction_schedule->customer_code = $request->customer_code;
    //             $construction_schedule->joutou_date = $request->jouto_date;
    //             $construction_schedule->days_before_joutou = $request->days_before_joutou;
    //             $construction_schedule->kiso_start = $request->kiso_start;
    //             $construction_schedule->days_before_kiso_start = $request->before_kiso_start;
    //             $detail->created_at = date('Y-m-d H:i:s');
    //             $detail->updated_at = date('Y-m-d H:i:s');
    //             $construction_schedule->created_at = date('Y-m-d H:i:s');
    //             $construction_schedule->updated_at = date('Y-m-d H:i:s');
    //             $invoice->created_at = date('Y-m-d H:i:s');
    //             $invoice->updated_at = date('Y-m-d H:i:s');
    //             $invoice->save();
    //             $construction_schedule->save();
    //         }

    //         $detail->save();
    //     } catch (Exception $error) {
    //         Log::error($error);
    //     }
    // }
}
