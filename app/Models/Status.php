<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
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
        'detail_id'
    ];
    public function details()
    {
        return $this->belongsTo(Detail::class, 'detail_id');
    }
    public function pending()
    {
        return $this->hasMany(Pending::class);
    }
    public function affectedProduct()
    {
        return $this->belongsTo(AffectedProduct::class, 'affected_id');
    }
}
