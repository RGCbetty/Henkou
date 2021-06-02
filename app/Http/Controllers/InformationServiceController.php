<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Department;
use App\Models\Plan;
use App\Models\PlanStatus;
use App\Models\PlanTypes;
use App\Models\Product;
use App\Models\Reason;
use App\Models\ThAction;
use App\Models\ThAssessment;
use App\Models\ThPlanTemporary;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Notifications\Action;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class InformationServiceController extends Controller
{
    public function filteredplans(Request $request, $sort_by = null, $order = 'asc')
    {
        try {
            $requestToArray = json_decode(json_encode($request), true);
            $paramsKey = array_key_first($request->query());
            $currentPage = $request->input("current");
            $pageSize = $request->input("pageSize");
            // $paramsKey = key($request);
            $paramsVal = $request->input("{$paramsKey}");

            $filteredTHplans = DB::connection('information_service')->select(DB::raw("SELECT A.*,B.NameCode,B.PlanNo,D.ConstructionTypeName,D.Method,E.StoppedProcessingDate,E.ResumedProcessingDate FROM
            (
            SELECT ConstructionCode,CONVERT(VARCHAR(10),RequestAcceptedDate,120) as RequestAcceptedDate, RequestNo FROM SpecificationChangingDetails
            WHERE  RequestAcceptedDate BETWEEN CONVERT(VARCHAR(15),dateadd(day,-1,GETDATE()),111) AND CONVERT(VARCHAR(15),GETDATE(),111)
            AND {$paramsKey} LIKE '%{$paramsVal}%'
            GROUP BY ConstructionCode,RequestAcceptedDate,RequestNo
            HAVING max(SequentialNo)>0
            ) A

            LEFT JOIN Constructions B
            ON A.ConstructionCode = B.ConstructionCode

            LEFT JOIN Houses C
            ON A.ConstructionCode = C.ConstructionCode

            LEFT JOIN ConstructionTypes D
            ON C.ConstructionTypeCode =D.ConstructionTypeCode

            LEFT JOIN ConstructionSchedule E
            ON A.ConstructionCode =E.ConstructionCode
            WHERE E.StoppedProcessingDate IS NULL OR E.ResumedProcessingDate IS NOT NULL
            ORDER BY A.RequestAcceptedDate ASC"));


            $collection = collect($filteredTHplans);
            if ($sort_by) {

                if ($order == 'desc') {
                    $sorted = $collection->sortBy(function ($role) use ($sort_by) {
                        return $role->{$sort_by};
                    })->reverse();
                } else if ($order == 'asc') {
                    $sorted = $collection->sortBy(function ($role) use ($sort_by) {
                        return $role->{$sort_by};
                    });
                }
            } else {
                $sorted = $collection;
            }

            $num_per_page = 20;
            if (!$currentPage) {
                $currentPage = 1;
            }

            $offset = ($currentPage - 1) * $pageSize;
            $sorted = $sorted->splice($offset, $pageSize);
            $paginator = new LengthAwarePaginator($sorted, count($filteredTHplans), $num_per_page, $currentPage);
            return response()->json($paginator);

            // return $registration_table;
        } catch (Exception $error) {
            return response()->json([
                'status_code' => 500,
                'error' => $error,
            ]);
        }
    }
    public function table()
    {
        try {
            $THshiyousho = DB::connection('information_service')->select(DB::raw("SELECT A.*,B.NameCode,B.PlanNo,D.ConstructionTypeName,D.Method,CONVERT(VARCHAR(10),E.StoppedProcessingDate,120) AS StoppedProcessingDate,CONVERT(VARCHAR(10),E.ResumedProcessingDate,120) AS ResumedProcessingDate  FROM
            (
            SELECT ConstructionCode,CONVERT(VARCHAR(10),RequestAcceptedDate,120) as RequestAcceptedDate, RequestNo FROM SpecificationChangingDetails
            WHERE  RequestAcceptedDate BETWEEN CONVERT(VARCHAR(15),dateadd(day,-1,GETDATE()),111) AND CONVERT(VARCHAR(15),GETDATE(),111)
            GROUP BY ConstructionCode,RequestAcceptedDate,RequestNo
            HAVING max(SequentialNo)>0
            ) A

            LEFT JOIN Constructions B
            ON A.ConstructionCode = B.ConstructionCode

            LEFT JOIN Houses C
            ON A.ConstructionCode = C.ConstructionCode

            LEFT JOIN ConstructionTypes D
            ON C.ConstructionTypeCode =D.ConstructionTypeCode

            LEFT JOIN ConstructionSchedule E
            ON A.ConstructionCode =E.ConstructionCode
            WHERE E.StoppedProcessingDate IS NULL OR E.ResumedProcessingDate IS NOT NULL
            ORDER BY A.RequestAcceptedDate ASC"));
            $THtemp = ThPlanTemporary::select()->whereDate('received_date', '=', Carbon::today()->subDay())->orWhere('received_date', '=', Carbon::today())->get();
            $PlanStatus = PlanStatus::all();
            $HenkouReason = Reason::all();
            $THAction = ThAction::all();
            $THAssessment = ThAssessment::all();
            return response()->json([
                'THtemp' =>  $THtemp,
                'THshiyousho' => $THshiyousho,
                'PlanStatus' => $PlanStatus,
                'HenkouReason' =>  $HenkouReason,
                'THAction' => $THAction,
                'THAssessment' => $THAssessment
            ]);
        } catch (Exception $error) {
            info($error);
            return response()->json([
                'status_code' => 500,
                'error' => $error,
            ]);
        }
    }
    public function specs($customer_code)
    {
        try {
            // $construction_schedule = DB::connection('information_service')->select(DB::raw("SELECT datediff(day,getdate(),StartedFoundationWorkDate) AS before_kiso_start,
            // datediff(day,getdate(),ExpectedHouseRaisingDate) AS days_before_joutou, ExpectedHouseRaisingDate, StartedFoundationWorkDate FROM ConstructionSchedule WHERE ConstructionCode = :constructioncode"), array('constructioncode' => $id));

            // $house = DB::connection('information_service')->select(DB::raw("SELECT A.Floors,B.ConstructionTypeName,B.Method,C.NameCode,C.PlanNo FROM Houses AS A
            //     LEFT JOIN ConstructionTypes B
            //     ON A.ConstructionTypeCode = B.ConstructionTypeCode
            //     LEFT JOIN Constructions C
            //     ON A.ConstructionCode = C.ConstructionCode
            //     WHERE A.ConstructionCode = :constructioncode"), array('constructioncode' => $id));

            // $plan_details = DB::connection('information_service')->select(DB::raw("SELECT A.Floors,B.ConstructionTypeName,B.Method,C.NameCode,C.PlanNo FROM Houses AS A
            //    LEFT JOIN ConstructionTypes B
            //    ON A.ConstructionTypeCode = B.ConstructionTypeCode
            //     LEFT JOIN Constructions C
            //     ON A.ConstructionCode = C.ConstructionCode
            //    WHERE A.ConstructionCode = :constructioncode"), array('constructioncode' => $id));
            $plan_details = DB::connection('information_service')->select(DB::raw("SELECT    A.NameCode AS house_code,
            A.PlanNo AS plan_no,
            A.ConstructionCode AS construction_code,
            B.received_date,
            B.th_no,
            C.Floors AS floors,
            D.ConstructionTypeName AS house_type,
            D.Method AS method,
            E.ExpectedHouseRaisingDate AS joutou_date,
            E.StartedFoundationWorkDate AS kiso_start,
               datediff(day,getdate(),E.ExpectedHouseRaisingDate) AS days_before_joutou,
               datediff(day,getdate(),E.StartedFoundationWorkDate)AS before_kiso_start
            FROM
            Constructions A
                    LEFT JOIN (
                    SELECT  ConstructionCode AS construction_code,
                    CONVERT(VARCHAR(10),RequestAcceptedDate,120)AS received_date,
                    RequestNo AS th_no
                                FROM SpecificationChangingDetails
                               --	WHERE ConstructionCode = '4510289-2019'
                                GROUP BY ConstructionCode,RequestNo, RequestAcceptedDate
                                HAVING MAX(SequentialNo) > 0
                    ) B
                    ON A.ConstructionCode = B.construction_code

                    LEFT JOIN Houses C
                    ON A.ConstructionCode = C.ConstructionCode

                    LEFT JOIN ConstructionTypes D
                    ON C.ConstructionTypeCode =D.ConstructionTypeCode

                    LEFT JOIN ConstructionSchedule E
                    ON A.ConstructionCode =E.ConstructionCode

                    WHERE A.ConstructionCode = '{$customer_code}' AND (E.StoppedProcessingDate IS NULL OR E.ResumedProcessingDate IS NOT NULL)
                    ORDER BY B.received_date DESC"))[0];
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
            $latest_revision =  Plan::where('customer_code', $customer_code)->max('rev_no');
            $latest_plan = Plan::with('planStatus')->where(['customer_code' => $customer_code, 'rev_no' => $latest_revision])->first();
            $plan_status = PlanStatus::all();
            $departments = Department::all(['DepartmentCode', 'DepartmentName']);
            $types = PlanTypes::all();
            $reason = Reason::all();
            if ($latest_revision) {
                $revision_index = explode('-', $latest_revision);
                $productsLogs = Product::with(['plan.employee', 'employee', 'affectedProduct.productCategory.designations', 'pendings.employee', 'pendings.products' => function ($query) use ($customer_code, $revision_index) {
                    $query->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index);
                }])->where('customer_code', $customer_code)->whereRaw("SUBSTRING_INDEX(rev_no, '-',1) = ?", $revision_index[0])->get();
                $products = Product::with(['affectedProduct', 'employee', 'affectedProduct.pendings', 'pendings', 'affectedProduct.productCategory.designations'])->where(['plan_id' => $latest_plan->id, 'customer_code' => $customer_code])->get();
                return response()->json([
                    'invoice' => $invoice,
                    'details' => $plan_details,
                    'specification' => $plan_specification,
                    'latest' => $latest_plan,
                    'productslogs' => $productsLogs,
                    'products' => $products,
                    'process' => $plan_status,
                    'departments' => $departments,
                    'types' => $types,
                    'reasons' => $reason
                ]);
            } else {
                return response()->json([
                    'invoice' => $invoice,
                    'details' => $plan_details,
                    'specification' => $plan_specification,
                    'latest' => $latest_plan,
                    'process' => $plan_status,
                    'departments' => $departments,
                    'types' => $types,
                    'reasons' => $reason
                ]);
            }
            // Product::with()
            // DB::connection('mysql')->select(DB::raw("SELECT A.*,B.*, C.* FROM henkou.details as A
            // INNER JOIN henkou.construction_schedules as B
            //     ON A.customer_code = B.customer_code
            //         INNER JOIN henkou.invoices AS C
            //             ON A.customer_code = C.customer_code
            //             WHERE A.rev_no = (SELECT MAX(rev_no) FROM henkou.details)
            //             AND A.customer_code = '{$customer_code}';"));
            // $max = Detail::where('customer_code', $customer_code)->max('rev_no');
            // $found = (empty($max)) ? null :  Detail::where('customer_code', $customer_code)->where('rev_no', $max)->first()->invoice()->where('customer_code', $customer_code)->first();
            //  return $result;

        } catch (Exception $error) {
            return response()->json([
                'status_code' => 500,
                'error' => $error->getMessage(),
            ]);
        }
    }
    public function stop()
    {
        try {
            $stop_plans = DB::connection('information_service')->select(DB::raw("SELECT A.*,B.NameCode,B.PlanNo,D.ConstructionTypeName,E.StoppedProcessingDate,E.ResumedProcessingDate FROM
                (
                SELECT ConstructionCode,CONVERT(VARCHAR(10),RequestAcceptedDate,120) as RequestAcceptedDate, RequestNo FROM SpecificationChangingDetails
                WHERE  RequestAcceptedDate BETWEEN CONVERT(VARCHAR(15),dateadd(day,-1,GETDATE()),111) AND CONVERT(VARCHAR(15),GETDATE(),111)
                GROUP BY ConstructionCode,RequestAcceptedDate,RequestNo
                HAVING max(SequentialNo)>0
                ) A

                LEFT JOIN Constructions B
                ON A.ConstructionCode = B.ConstructionCode

                LEFT JOIN Houses C
                ON A.ConstructionCode = C.ConstructionCode

            LEFT JOIN ConstructionTypes D
            ON C.ConstructionTypeCode =D.ConstructionTypeCode

            LEFT JOIN ConstructionSchedule E
            ON A.ConstructionCode =E.ConstructionCode
            WHERE E.StoppedProcessingDate IS NOT NULL
            ORDER BY A.RequestAcceptedDate ASC"));
            return $stop_plans;
        } catch (Exception $error) {
            return response()->json([
                'status_code' => 500,
                'error' => $error,
            ]);
        }
    }
}
