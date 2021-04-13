<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function users()
    {
        $users = User::all();
        return response()->json($users);
    }
    public function employee($id)
    {
        try {
            $userInfo = DB::connection('sqlsrv')->select(DB::raw("SELECT E.EmployeeCode ,E.EmployeeName,
            E.DepartmentCode,D.DepartmentName,
            E.SectionCode,S.SectionName,
            E.TeamCode,T.TeamName,
            E.DesignationCode,DS.DesignationName,
            E.ContractStatus,E.Gender,E.DateBirth
            FROM  hrdsql.CompanyInformation.dbo.Employees E
            LEFT	JOIN hrdsql.CompanyInformation.dbo.Departments D
            ON E.DepartmentCode=D.DepartmentCode
            LEFT JOIN hrdsql.CompanyInformation.dbo.Sections S
            ON E.SectionCode=S.SectionCode
            LEFT JOIN hrdsql.CompanyInformation.dbo.Teams T
            ON E.TeamCode =T.TeamCode
            LEFT JOIN hrdsql.CompanyInformation.dbo.Designations DS
            ON E.DesignationCode= DS.DesignationCode
            WHERE    E.RetiredDate IS NULL
                    AND D.DeletedDate IS NULL AND S.DeletedDate IS NULL
                    AND T.Deleteddate IS NULL AND DS.DeletedDate IS NULL
            AND E.EmployeeCode= :employee_no"), array('employee_no' => $id));
            $b = json_encode($userInfo, true);     // encode to string
            $array = json_decode($b, true); // decode to all array
            $flatten_array = collect($array)->flatMap(function ($item) {
                return $item;
            })->all();

            if (count($flatten_array) <= 0) {
                throw new Exception('User not found!');
            }
            return response()->json($flatten_array, 200);
        } catch (Exception $error) {
            return response()->json([
                'status_code' => 404,
                'message' => $error->getMessage()
            ]);
        }
    }
    public function login(Request $request)
    {
        try {
            $request->validate([
                'employee_no' => 'required',
                'password' => 'required',
            ]);
            // , $request->only('remember')
            info($request->employee_no);
            $credentials = request(['employee_no', 'password']);
            if (Auth::attempt($credentials)) {
                $user = User::where('employee_no', $request->employee_no)->first();
                $userInfo = DB::connection('sqlsrv')->select(DB::raw("SELECT E.EmployeeCode ,E.EmployeeName,
                        E.DepartmentCode,D.DepartmentName,
                        E.SectionCode,S.SectionName,
                        E.TeamCode,T.TeamName,
                        E.DesignationCode,DS.DesignationName,
                        E.ContractStatus,E.Gender,E.DateBirth
                FROM  hrdsql.CompanyInformation.dbo.Employees E
                LEFT	JOIN hrdsql.CompanyInformation.dbo.Departments D
                ON E.DepartmentCode=D.DepartmentCode
                LEFT JOIN hrdsql.CompanyInformation.dbo.Sections S
                ON E.SectionCode=S.SectionCode
                LEFT JOIN hrdsql.CompanyInformation.dbo.Teams T
                ON E.TeamCode =T.TeamCode
                LEFT JOIN hrdsql.CompanyInformation.dbo.Designations DS
                ON E.DesignationCode= DS.DesignationCode
                WHERE    E.RetiredDate IS NULL
                        AND D.DeletedDate IS NULL AND S.DeletedDate IS NULL
                        AND T.Deleteddate IS NULL AND DS.DeletedDate IS NULL
                 AND E.EmployeeCode= :employee_no"), array('employee_no' => $request->employee_no))[0];
                if (!Hash::check($request->password, $user->password, [])) {
                    throw new \Exception('Error in Login');
                }
                if (User::where('employee_no', $request->employee_no)->where('is_registered', null)->first()) {
                    return response()->json([
                        'status_code' => 500,
                        'message' => 'Unauthorized'
                    ]);
                }
                $tokenResult = $user->createToken('authToken')->plainTextToken;
                return response()->json([
                    'status_code' => 200,
                    'user' => $userInfo,
                    'access_token' => $tokenResult,
                    'token_type' => 'Bearer',
                ]);
            } else {
                return response()->json([
                    'status_code' => 500,
                    'message' => 'Unauthorized'
                ]);
            }
        } catch (Exception $error) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Error in Login',
                'error' => $error,
            ]);
        }
    }
    public function logout(Request $request)
    {
        return $request->user()->currentAccessToken()->delete();
    }
    public function register(Request $request)
    {

        try {
            User::create([
                'employee_no' => $request->user['employeecode'],
                'access_level' => 3,
                'is_registered' => false,
                'password' => bcrypt($request->user['password']),
            ]);
            return response()->json([
                'status_code' => 200,
                'message' => 'Account successfully created. Wait for admin to approve'
            ]);
        } catch (Exception $error) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Employee already registered.',
                'error' => $error,
            ]);
        }
    }
    public function verify(Request $request)
    {
        try {
            $user = User::find($request->id);
            $user->is_registered = $request->is_registered;
            $user->save();
            return response()->json([
                'status_code' => 200,
                'message' => 'Verified Account!'
            ]);
        } catch (Exception $error) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Cannot verify.',
                'error' => $error,
            ]);
        }
    }
}
