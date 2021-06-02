<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    //
    public function index(Request $request)
    {
        info($request->user());

        $users = User::all();
        // $names = User::all()->reject(function ($user) {
        //     return $user->deleted_at !== null;
        // })->map(function ($user) {
        //     return $user->employee_no;
        // })->toArray();
        // // $employeeCode = array_map(function ($user) {
        // //     return "employee_no" => $user;
        // // }, $users);
        // $namesToString = "'" . implode("','", $names) . "'";
        // $userInfo = DB::connection('sqlsrv')->select(DB::raw("SELECT E.EmployeeCode ,E.EmployeeName,
        //     E.DepartmentCode,D.DepartmentName,
        //     E.SectionCode,S.SectionName,
        //     E.TeamCode,T.TeamName,
        //     E.DesignationCode,DS.DesignationName,
        //     E.ContractStatus,E.Gender,E.DateBirth
        //     FROM  hrdsql.CompanyInformation.dbo.Employees E
        //     LEFT	JOIN hrdsql.CompanyInformation.dbo.Departments D
        //     ON E.DepartmentCode=D.DepartmentCode
        //     LEFT JOIN hrdsql.CompanyInformation.dbo.Sections S
        //     ON E.SectionCode=S.SectionCode
        //     LEFT JOIN hrdsql.CompanyInformation.dbo.Teams T
        //     ON E.TeamCode =T.TeamCode
        //     LEFT JOIN hrdsql.CompanyInformation.dbo.Designations DS
        //     ON E.DesignationCode= DS.DesignationCode
        //     WHERE    E.RetiredDate IS NULL
        //             AND D.DeletedDate IS NULL AND S.DeletedDate IS NULL
        //             AND T.Deleteddate IS NULL AND DS.DeletedDate IS NULL
        //     AND E.EmployeeCode IN ({$namesToString})"));
        // $array = array_map(function ($obj) {
        //     $user = User::where('employee_no', $obj->EmployeeCode)->first();
        //     if ($user) {
        //         return (array) array(
        //             'EmployeeCode' => $obj->EmployeeCode,
        //             'EmployeeName' => $obj->EmployeeName,
        //             'DepartmentName' => $obj->DepartmentName,
        //             'SectionName' => $obj->SectionName,
        //             'TeamName' => $obj->TeamName,
        //             'DesignationName' => $obj->DesignationName,
        //             'access_level' => $user->access_level,
        //             'is_registered' => $user->is_registered,
        //             'id' => $user->id

        //         );
        //     } else {
        //         return (array) $obj;
        //     }
        // }, $userInfo);
        return $users;
    }
}
