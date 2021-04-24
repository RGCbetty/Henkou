<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class CompanyInformationController extends Controller
{
    //
    public function departments()
    {
        try {
            $departments = DB::connection('company_information')->select(
                DB::raw('SELECT DepartmentCode,DepartmentName FROM Departments WHERE DeletedDate IS NULL')
            );
            return response()->json($departments);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 404);
        }
    }
    public function sections()
    {
        try {
            $sections = DB::connection('company_information')->select(
                DB::raw('SELECT SectionCode,SectionName FROM Sections WHERE DeletedDate IS NULL')
            );
            return response()->json($sections);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 404);
        }
    }
    public function teams()
    {
        try {
            $sections = DB::connection('company_information')->select(
                DB::raw('SELECT TeamCode,TeamName FROM Teams WHERE DeletedDate IS NULL')
            );
            return response()->json($sections);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 404);
        }
    }
    public function sectionsByDepartment(Request $request)
    {
        try {
            $sections = DB::connection('company_information')->select(DB::raw('SELECT C.SectionCode,C.SectionName FROM DepartmentSectionRelations A
            LEFT JOIN Departments B ON A.DepartmentCode = B.DepartmentCode
            LEFT JOIN Sections C ON A.SectionCode = C.SectionCode
            WHERE A.DeletedDate IS NULL
            AND B.DeletedDate IS NULL
            AND C.DeletedDate IS NULL
            AND A.DepartmentCode = :department_id'), array('department_id' => $request->dep_id));
            return response()->json($sections, 200);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 404);
        }
    }
    public function teamsByDepartmentAndSections(Request $request)
    {
        try {
            $teams = DB::connection('company_information')->select(DB::raw('SELECT D.TeamCode, D.TeamName FROM SectionTeamRelations A
            LEFT JOIN Departments B ON A.DepartmentCode = B.DepartmentCode
            LEFT JOIN Sections C ON A.SectionCode = C.SectionCode
            LEFT JOIN Teams D ON A.TeamCode = D.TeamCode
            WHERE A.DeletedDate IS NULL
            AND B.DeletedDate IS NULL
            AND C.DeletedDate IS NULL
            AND D.DeletedDate IS NULL
            AND A.DepartmentCode = :department_id
            AND A.SectionCode = :section_id
            '), array('department_id' => $request->dep_id, 'section_id' => $request->sec_id));
            return response()->json($teams, 200);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 404);
        }
    }
}
