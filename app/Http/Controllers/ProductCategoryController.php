<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use App\Models\Supplier;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function all()
    {
        return ProductCategory::all();
    }
    public function index(Request $request)
    {
        //
        // $per_page = $request->input('per_page');
        // return ProductCategory::paginate($per_page);
        return ProductCategory::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $product_category = DB::connection('sqlsrv')->select(DB::raw('SELECT * FROM M_ProductCategories'));
        try {
            foreach ($product_category as $data) {
                // $result = json_decode(json_encode($data), true);
                ProductCategory::create([
                    'id' => $data->ProductID,
                    'product_name' => $data->ProductName,
                    "sequence_no" =>  $data->ProductID,
                    "department_id" => $data->DeptCode,
                    "section_id" => $data->SectionCode,
                    "team_id" => $data->TeamCode,
                    'created_at' => $data->CreatedDate,
                    'updated_at' => null,
                    "updated_by" => null,
                    "details_id" => null
                ]);
                // Log::info();
            }
        } catch (Exception $e) {
            error_log($e);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProductCategory  $productCategory
     * @return \Illuminate\Http\Response
     */
    public function show(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProductCategory  $productCategory
     * @return \Illuminate\Http\Response
     */
    public function edit(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProductCategory  $productCategory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProductCategory $productCategory)
    {
        function unique_multidim_array($array, $key)
        {
            $temp_array = array();
            $i = 0;
            $key_array = array();

            foreach ($array as $val) {
                if (!in_array($val[$key], $key_array)) {
                    $key_array[$i] = $val[$key];
                    $temp_array[$i] = $val;
                }
                $i++;
            }
            return $temp_array;
        }


        // $data = $request->all();
        $products = $request->input('products');
        $product_key =  $request->input('product_key');


        $toUpdate = array();
        foreach ($products as $key => $value) {
            // info($value);
            $value['created_at'] = Carbon::now()->toDateTimeString();
            $value['updated_at'] = Carbon::now()->toDateTimeString();
            array_push($toUpdate, $value);
        }
        $suppliers = Supplier::select('last_touch', 'product_key', 'supplier_key')->where('product_key', $product_key)->get();
        $toEncode = json_decode(json_encode($suppliers), true);

        $suppliersToBeUpdated = array();
        $suppliersToBeCreated = array();
        $assocToBeCreated = array();
        $assocToBeUpdated = array();
        $tmp_array = array();
        foreach ($toEncode as $supplier_key => $supplier_val) {
            $duplicate = false;
            foreach ($products as $key => $products_val) {
                if ($products_val['product_key'] == $supplier_val['supplier_key']) {
                    $assocToBeUpdated['product_key'] = $product_key;
                    $assocToBeUpdated['supplier_key'] = $products_val['product_key'];
                    $assocToBeUpdated['last_touch'] = $products_val['last_touch'];
                    array_push($suppliersToBeUpdated, $assocToBeUpdated);
                } else if ($products_val['product_key'] !== $supplier_val['supplier_key']) {
                    $assocToBeCreated['product_key'] = $product_key;
                    $assocToBeCreated['supplier_key'] = $products_val['product_key'];
                    $assocToBeCreated['last_touch'] = $products_val['last_touch'];
                    array_push($suppliersToBeCreated, $assocToBeCreated);
                }


                // array_push($supplierToBeCreated, $products_val['product_key']);
            }
        }

        // $testProducts = array_udiff($toEncode, $products, function ($a, $b) {
        //     if ($a['supplier_key'] === $b['product_key']) {
        //         return 0;
        //     }
        //     return ($a['supplier_key'] > $b['product_key']) ? 1 : -1;
        // });
        $arrayToBeDeletedKeys = array_diff(array_column($toEncode, 'supplier_key'), array_column($products, 'product_key'));
        $arrayToBeCreatedKeys = array_diff(array_column($products, 'product_key'), array_column($toEncode, 'supplier_key'));
        $toArrayDeletedKeys = array_values($arrayToBeDeletedKeys);
        $toArrayCreatedKeys = array_values($arrayToBeCreatedKeys);
        $toCreate = array();
        if (count($arrayToBeDeletedKeys) > 0) {
            Supplier::where('product_key', $product_key)->whereIn('supplier_key', $toArrayDeletedKeys)->update(['deleted_at' => Carbon::now()->format('Y-m-d H:i:s')]);
        }
        if (count($toArrayCreatedKeys) > 0) {
            foreach ($toArrayCreatedKeys as $val) {
                array_push($toCreate, ['product_key' => $product_key, 'supplier_key' => $val, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()]);
            }
            Supplier::insert($toCreate);
        }


        // $uniqueSuppliersToBeCreated = unique_multidim_array($suppliersToBeCreated, 'supplier_key');
        // $last_touch = array_filter($suppliersToBeUpdated, function ($val) {
        //     if ($val['last_touch']) {
        //         return $val;
        //     }
        // });

        // info($uniqueSuppliersToBeCreated);
        // $result  = array_merge($suppliersToBeCreated, $suppliersToBeUpdated);
        // $uniqueResult = unique_multidim_array($result, 'supplier_key');
        // info('to be createeeeeeeeeeeeeeeeeeeeeeeeeeeeed');
        // info($suppliersToBeCreated);
        // info('to be updated');
        // info($suppliersToBeUpdated);
        // if (count($last_touch) > 0) {
        // info($last_touch);
        // LaravelBatch
        // Batch::update(Supplier::class, $suppliersToBeUpdated, $product_key);
        foreach ($suppliersToBeUpdated as $val) {
            Supplier::where('product_key', $product_key)->where('supplier_key', $val['supplier_key'])->update(['last_touch' => $val['last_touch']]);
        }
        // Supplier::where('product_key', $product_key)->where('supplier_key', $last_touch[0]['supplier_key'])->update($last_touch[0]);
        // }
        // return ProductCategory::all();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProductCategory  $productCategory
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProductCategory $productCategory)
    {
        //
    }
}
