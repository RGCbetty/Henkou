<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\ProductCategory;
use App\Models\Supplier;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // info(ProductCategory::with('customers')->get());
        // info(Customer::with('product:id,product_key')->get());
        info(Supplier::with('products')->get());
        // info(Customer::with('product')->get());
        // $products = ProductCategory::select('id', 'product_key')->with('customers:id,product_key')->get();
        // info($products);
        // info(Customer::with('pro'))
        // foreach ($products->flatMap->customers as $customer) {
        //     info($customer);
        // }
        return json_encode(Customer::with('product:id,product_key')->get());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function show(Customer $customer, Request $request)
    {
        info('test');
        // $request_arr = (array) $request;
        // $request_array =  json_decode(json_encode($request), true);
        $product_keys = array_values($request->all());
        // info($product_keys);

        $customer_keys = Customer::select('product_key', 'customer_key')->whereIn('product_key', $product_keys)->get();
        // $supplier_keys = Supplier::whereIn('product_key', $product_keys)->pluck('supplier_key')->toArray();
        info($customer_keys);
        return json_encode($customer_keys);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function edit(Customer $customer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Customer $customer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function destroy(Customer $customer)
    {
        //
    }
}
