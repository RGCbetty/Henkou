<?php

namespace App\Http\Controllers;

use App\Models\PlanStatus;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
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
    public function table(Request $request, $sort_by = null, $order = 'asc')
    {
        try {
            info($request);
            $assocConstructionCode = $request->only('ConstructionCode');
            $assocNameCode = $request->only('NameCode');
            $constructionCodeVal = $request->query('ConstructionCode');
            $nameCodeVal = $request->query('NameCode');

            $constructionCodeKey = array_key_first($assocConstructionCode);
            $nameCodeKey = array_key_first($assocNameCode);
            // info($input[$key]);
            $conditionalQueryConstructionCode = count($assocConstructionCode) > 0 ? "AND {$constructionCodeKey} = '{$constructionCodeVal}'" : null;
            $conditionalQueryNameCode = count($assocNameCode) > 0 ? "B.{$nameCodeKey} = '{$nameCodeVal}' AND" : null;
            // $paramsKey = array_key_first($request->query());

            $pagination = DB::connection('information_service')->select(DB::raw("SELECT A.*,B.NameCode,B.PlanNo,D.ConstructionTypeName,D.Method,E.StoppedProcessingDate,E.ResumedProcessingDate FROM
            (
            SELECT ConstructionCode,CONVERT(VARCHAR(10),RequestAcceptedDate,120) as RequestAcceptedDate, RequestNo FROM SpecificationChangingDetails
            WHERE  RequestAcceptedDate BETWEEN CONVERT(VARCHAR(15),dateadd(day,-1,GETDATE()),111) AND CONVERT(VARCHAR(15),GETDATE(),111)
            {$conditionalQueryConstructionCode}
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
            WHERE  {$conditionalQueryNameCode} (E.StoppedProcessingDate IS NULL OR E.ResumedProcessingDate IS NOT NULL)
            ORDER BY A.RequestAcceptedDate ASC"));
            $currentPage = $request->input("current");
            $pageSize =  $conditionalQueryConstructionCode || $conditionalQueryNameCode  ? count($pagination) : $request->input("pageSize");
            $collection = collect($pagination);
            // if ($sort_by) {

            //     if ($order == 'desc') {
            //         $sorted = $collection->sortBy(function ($role) use ($sort_by) {
            //             return $role->{$sort_by};
            //         })->reverse();
            //     } else if ($order == 'asc') {
            //         $sorted = $collection->sortBy(function ($role) use ($sort_by) {
            //             return $role->{$sort_by};
            //         });
            //     }
            // } else {
            //     $sorted = $collection;
            // }
            // $num_per_page = 20;
            // if (!$currentPage) {
            //     $currentPage = 1;
            // }
            // $offset = ($currentPage - 1) * $pageSize;
            // $sorted = $sorted->splice($offset, $pageSize);
            // $paginator = new LengthAwarePaginator($sorted, count($pagination), $num_per_page, $currentPage);
            return json_encode($collection);
        } catch (Exception $error) {
            info($error);
            return response()->json([
                'status_code' => 500,
                'error' => $error,
            ]);
        }
    }
    public function specs($id)
    {
        try {
            $construction_schedule = DB::connection('information_service')->select(DB::raw("SELECT ExpectedHouseRaisingDate, StartedFoundationWorkDate FROM ConstructionSchedule WHERE ConstructionCode = :constructioncode"), array('constructioncode' => $id));

            $house = DB::connection('information_service')->select(DB::raw("SELECT A.Floors,B.ConstructionTypeName,B.Method,C.NameCode,C.PlanNo FROM Houses AS A
                LEFT JOIN ConstructionTypes B
                ON A.ConstructionTypeCode = B.ConstructionTypeCode
                LEFT JOIN Constructions C
                ON A.ConstructionCode = C.ConstructionCode
                WHERE A.ConstructionCode = :constructioncode"), array('constructioncode' => $id));

            // $menshin = DB::connection('information_service')->select(DB::raw("SELECT
            // (SELECT Count(*)
            // FROM             hrdsql.hrdinformationservice.dbo.BasicSpecificationDetails
            // WHERE           (BasicSpecificationDetails.BasicSpecificationCode = '0104')
            // AND              (BasicSpecificationDetails.SpecificationDetailCode = '0020')
            // AND ConstructionCode= :constructioncode
            // ) AS Menshin "), array('constructioncode' => $id));
            $invoice = DB::connection('sqlsrv')->select(DB::raw("SELECT * FROM getInvoice ('$id')"));
            $plan_specs = DB::connection('sqlsrv')->select(DB::raw("SELECT * FROM getPlanSpecs ('$id')"));
            return response()->json([
                'construction_schedule' => $construction_schedule,
                'invoice' => $invoice,
                'house' => $house,
                'plan_specs' => $plan_specs,
            ]);
        } catch (Exception $error) {
            return response()->json([
                'status_code' => 500,
                'error' => $error,
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
