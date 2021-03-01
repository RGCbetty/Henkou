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
            $userInfo = DB::connection('sqlsrv')->select(DB::raw("SELECT * FROM getUserInfo ('$id')"));
            $b = json_encode($userInfo, true);     // encode to string
            $array = json_decode($b, true); // decode to all array
            $flatten_array = collect($array)->flatMap(function ($item) {
                return $item;
            })->all();
            info($flatten_array);
            info(count($flatten_array));
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
            $credentials = request(['employee_no', 'password']);
            if (Auth::attempt($credentials)) {
                $user = User::where('employee_no', $request->employee_no)->first();

                if (!Hash::check($request->password, $user->password, [])) {
                    throw new \Exception('Error in Login');
                }
                $tokenResult = $user->createToken('authToken')->plainTextToken;
                return response()->json([
                    'status_code' => 200,
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
            info($request->user['employeecode']);
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
}
