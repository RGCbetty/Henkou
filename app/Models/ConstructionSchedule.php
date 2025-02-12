<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConstructionSchedule extends Model
{
    use HasFactory;
    protected $primaryKey = 'customer_code';
    protected $keyType = 'string';
    public $incrementing = 'false';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'customer_code',
        'plan_no',
        'joutou_date',
        'days_before_joutou',
        'kiso_start',
        'days_before_kiso_start',
    ];
    public function detail()
    {
        return $this->hasMany(Detail::class);
    }
}
