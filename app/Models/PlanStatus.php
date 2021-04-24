<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanStatus extends Model
{
    use HasFactory;
    public $primaryKey  = 'id';
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    public function products()
    {
        return $this->belongsToMany(ProductCategory::class, 'affected_products', 'plan_status_id', 'product_category_id')->withPivot('sequence_no', 'updated_by')->orderBy('affected_products.sequence_no');
    }
}
