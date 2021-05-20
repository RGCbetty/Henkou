<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanStatus extends Model
{
    use HasFactory;
    public $primaryKey  = 'id';
    public function products()
    {
        return $this->belongsToMany(ProductCategory::class, 'affected_products', 'plan_status_id', 'product_key')->withPivot('sequence_no', 'updated_by')->orderBy('affected_products.sequence_no');
    }
    public function affectedProducts()
    {
        return $this->hasMany(AffectedProduct::class, 'plan_status_id');
    }
}
