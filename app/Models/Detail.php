<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Detail extends Model
{
    use HasFactory;
    protected $primaryKey = 'customer_code';
    protected $keyType = 'string';
    public $incrementing = 'false';
    protected $fillable = [
        'customer_code',
        'plan_no',
        'house_code',
        'house_type',
        'method',
        'floors',
        'invoice_id',
        'construction_schedule_id',
        'plan_specs_id',
        'created_at',
        'updated_at',
        'updated_by'
    ];

    // protected $guarded = ['id'];
    // protected $primaryKey = 'details_id';
    public function construction_schedule()
    {
        return $this->belongsTo(ConstructionSchedule::class, 'customer_code', 'customer_code');
    }
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
