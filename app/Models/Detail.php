<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Detail extends Model
{
    use HasFactory;
    protected $fillable = [
        'customer_code',
        'plan_no',
        'rev_no',
        'plan_specification',
        'house_code',
        'house_type',
        'method',
        'logs',
        'th_no',
        'floors',
        'reason_id',
        'type_id',
        'invoice_id',
        'construction_schedule_id',
        'created_at',
        'updated_at',
        'updated_by'
    ];

    // protected $guarded = ['id'];
    // protected $primaryKey = 'details_id';
    public function construction_schedule()
    {
        return $this->belongsTo(ConstructionSchedule::class);
    }
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
    public function attachment()
    {
        return $this->hasMany(Attachment::class);
    }
}
