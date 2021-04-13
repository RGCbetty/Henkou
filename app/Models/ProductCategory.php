<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    protected $fillable = ['id', 'product_name', 'sequence_no', 'department_id', 'section_id', 'team_id', 'created_at', 'updated_at', 'updated_by'];
    public function customers()
    {
        return $this->hasMany(Customer::class, 'product_key', 'product_key');
    }
    public function planstatus()
    {
        return $this->belongsToMany(PlanStatus::class, 'affected_products', 'product_category_id', 'plan_status_id')->withPivot('sequence_no', 'updated_by');
    }
}
