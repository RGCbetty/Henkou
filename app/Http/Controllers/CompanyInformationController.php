<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\DepartmentSectionRelation;
use App\Models\SectionTeamRelation;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class CompanyInformationController extends Controller
{
    //
    public function departments()
    {
        try {
            $departments = Department::all(['DepartmentCode', 'DepartmentName']);
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
            $teams = DB::connection('company_information')->select(
                DB::raw('SELECT TeamCode,TeamName FROM Teams WHERE DeletedDate IS NULL')
            );
            return response()->json($teams);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 404);
        }
    }
    public function SectionByDepartment(Request $request)
    {
        try {
            info($request->dep_id);
            $sections = DepartmentSectionRelation::leftJoin('Departments as B', 'A.DepartmentCode', '=', 'B.DepartmentCode')
                ->leftJoin('Sections as C', 'A.SectionCode', '=', 'C.SectionCode')
                ->whereNull('A.DeletedDate')
                ->whereNull('B.DeletedDate')
                ->whereNull('C.DeletedDate')
                ->where('A.DepartmentCode', $request->dep_id)->get(['C.SectionCode', 'C.SectionName']);
            return response()->json($sections, 200);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 404);
        }
    }
    public function TeamByDepartmentAndSection(Request $request)
    {
        try {
            $teams = SectionTeamRelation::leftJoin('Departments as B', 'SectionTeamRelations.DepartmentCode', '=', 'B.DepartmentCode')
                ->leftJoin('Sections as C', 'SectionTeamRelations.SectionCode', '=', 'C.SectionCode')
                ->leftJoin('Teams as D', 'SectionTeamRelations.TeamCode', '=', 'D.TeamCode')
                ->whereNull('SectionTeamRelations.DeletedDate')
                ->whereNull('B.DeletedDate')
                ->whereNull('C.DeletedDate')
                ->whereNull('D.DeletedDate')
                ->where('SectionTeamRelations.DepartmentCode', $request->dep_id)
                ->where('SectionTeamRelations.SectionCode', $request->sec_id)->get(['D.TeamCode', 'D.TeamName']);
            return response()->json($teams, 200);
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 404);
        }
    }
    public function TeamByDepartmentAndSections(Request $request)
    {
        try {
            // info(collect($request->sec_id)->all());
            if (isset($request->sec_id) && isset($request->dep_id)) {
                $teams = SectionTeamRelation::leftJoin('Departments as B', 'SectionTeamRelations.DepartmentCode', '=', 'B.DepartmentCode')
                    ->leftJoin('Sections as C', 'SectionTeamRelations.SectionCode', '=', 'C.SectionCode')
                    ->leftJoin('Teams as D', 'SectionTeamRelations.TeamCode', '=', 'D.TeamCode')
                    ->whereNull('SectionTeamRelations.DeletedDate')
                    ->whereNull('B.DeletedDate')
                    ->whereNull('C.DeletedDate')
                    ->whereNull('D.DeletedDate')
                    ->where('SectionTeamRelations.DepartmentCode', $request->dep_id)
                    ->whereIn('SectionTeamRelations.SectionCode', $request->sec_id)->get(['D.TeamCode', 'D.TeamName']);
                info($teams);
                // $sections = "'" . implode("','", $request->sec_id) . "'";
                // $teams = DB::connection('company_information')->select(DB::raw("SELECT D.TeamCode, D.TeamName FROM SectionTeamRelations A
                // LEFT JOIN Departments B ON A.DepartmentCode = B.DepartmentCode
                // LEFT JOIN Sections C ON A.SectionCode = C.SectionCode
                // LEFT JOIN Teams D ON A.TeamCode = D.TeamCode
                // WHERE A.DeletedDate IS NULL
                // AND B.DeletedDate IS NULL
                // AND C.DeletedDate IS NULL
                // AND D.DeletedDate IS NULL
                // AND A.DepartmentCode = :department_id
                // AND A.SectionCode IN (:section_id)
                // "), array('department_id' => $request->dep_id, 'section_id' => $sections));
                // info(
                //     dd($teams)
                // );
                return response()->json($teams, 200);
            }
            return array();
        } catch (Exception $error) {
            return response()->json(['message' => $error->getMessage()], 404);
        }
    }
}
