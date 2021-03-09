<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory;
    use SoftDeletes;
    public $timestamps = true;
    protected $fillable = ['id', 'product_key', 'supplier_key'];
    public function products()
    {
        return $this->belongsToMany(ProductCategory::class, 'suppliers', 'supplier_key', 'product_key');
    }
}
