<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AffectedProduct extends Model
{
    use HasFactory;
    protected $hidden = ['created_at', 'updated_at'];
    use SoftDeletes;
    protected $guarded = [];
    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class, 'product_key');
    }
    public function pendings()
    {
        return $this->hasMany(PendingProduct::class, 'affected_id');
    }

    // public function planStatus()
    // {
    //     return $this->belongsTo(PlanStatus::class, 'plan_status_id');
    // }
}
