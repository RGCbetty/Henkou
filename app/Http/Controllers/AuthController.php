<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function users()
    {
        $users = User::all();
        return response()->json($users);
    }
    public function userinfo($id)
    {
        $userInfo = DB::connection('sqlsrv')->select(DB::raw("SELECT * FROM getUserInfo ('$id')"));

        return $userInfo;
    }
    public function login(Request $request)
    {
        try {
            $request->validate([
                'employee_no' => 'required',
                'password' => 'required',
            ]);
            // , $request->only('remember')
            $credentials = request(['employee_no', 'password']);
            if (Auth::attempt($credentials)) {
                $user = User::where('employee_no', $request->employee_no)->first();
                $userInfo = DB::connection('sqlsrv')->select(DB::raw("SELECT * FROM getUserInfo ('$request->employee_no')"));

                if (!Hash::check($request->password, $user->password, [])) {
                    throw new \Exception('Error in Login');
                }
                $tokenResult = $user->createToken('authToken')->plainTextToken;
                return response()->json([
                    'status_code' => 200,
                    'access_token' => $tokenResult,
                    'token_type' => 'Bearer',
                    'user' => $userInfo,
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
}
