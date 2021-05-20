<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'log',
        'updated_by',
        'product_key',
        'start_date',
        'finished_date',
        'received_date',
        'created_at',
        'updated_at',
        'assessment_id',
        'plan_id',
        'rev_no'
    ];
    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }
    public function pendings()
    {
        return $this->hasMany(PendingProduct::class);
    }
    public function affectedProduct()
    {
        return $this->belongsTo(AffectedProduct::class, 'affected_id');
    }
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'updated_by', 'EmployeeCode');
    }
}
