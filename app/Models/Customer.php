<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = ['id', 'product_key', 'customer_key'];
    public function product()
    {
        return $this->belongsTo(ProductCategory::class, 'customer_key', 'product_key');
    }
}
