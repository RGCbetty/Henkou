<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;
    // protected $primaryKey = 'customer_code';
    // protected $keyType = 'string';
    // public $incrementing = 'false';
    protected $fillable = [
        'customer_code',
        'rev_no',
        'th_no',
        'logs',
        'created_at',
        'updated_at',
        'updated_by',
        'department_id',
        'reason_id',
        'type_id',
        'plan_status_id',

    ];

    // protected $guarded = ['id'];
    // protected $primaryKey = 'details_id';
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'updated_by', 'EmployeeCode');
    }
    public function details()
    {
        return $this->belongsTo(Detail::class, 'customer_code', 'customer_code');
    }
    public function reason()
    {
        return $this->belongsTo(Reason::class);
    }
    public function type()
    {
        return $this->belongsTo(PlanTypes::class);
    }
    public function planStatus()
    {
        return $this->belongsTo(PlanStatus::class, 'plan_status_id');
    }
    public function attachment()
    {
        return $this->hasMany(Attachment::class);
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
