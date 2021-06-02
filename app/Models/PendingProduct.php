<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PendingProduct extends Model
{
    use HasFactory;
    // protected $with = ['products: id, product_name'];
    protected $fillable = [
        'product_key',
        'product_id',
        'rev_no',
        'start_date',
        'reason',
        'resume_date',
        'duration',
        'created_at',
        'updated_by',
        'updated_at'
    ];
    // public function product(){

    // }
    public function products()
    {
        return $this->belongsTo(Product::class);
    }
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'updated_by', 'EmployeeCode');
    }
}
