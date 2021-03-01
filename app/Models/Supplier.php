<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['id', 'product_key', 'supplier_key'];
    public function products()
    {
        return $this->belongsToMany(ProductCategory::class, 'suppliers', 'supplier_key', 'product_key');
    }
}
