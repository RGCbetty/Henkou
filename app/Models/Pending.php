<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pending extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_key',
        'status_id',
        'rev_no',
        'start_date',
        'reason',
        'resume_date',
        'duration',
        'created_at',
        'updated_by',
        'updated_at'
    ];
    public function statuses()
    {
        return $this->belongsTo(Status::class);
    }
}
