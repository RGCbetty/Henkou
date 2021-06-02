<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductCategory extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $primaryKey = 'product_key';
    protected $keyType = 'string';
    public $incrementing = 'false';
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    protected $fillable = ['product_name', 'product_key', 'created_at', 'updated_at', 'updated_by'];
    public function customers()
    {
        return $this->hasMany(Customer::class, 'product_key', 'product_key');
    }
    public function planstatus()
    {
        return $this->belongsToMany(PlanStatus::class, 'affected_products', 'product_key', 'plan_status_id')->withPivot('sequence_no', 'updated_by');
    }
    public function designations()
    {
        return $this->hasMany(ProductDesignation::class, 'product_key');
    }
}
