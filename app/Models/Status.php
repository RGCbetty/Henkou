<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'log',
        'updated_by',
        'product_id',
        'start_date',
        'finished_date',
        'received_date',
        'created_at',
        'updated_at',
        'assessment_id',
        'detail_id'
    ];
    public function details()
    {
        return $this->belongsTo(Detail::class);
    }
    public function pendings()
    {
        return $this->hasMany(Pending::class);
    }
}
