<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;
    protected $fillable = [
        'customer_code',
        'name',
        'path'
    ];
    public $timestamps = false;

    public function detail()
    {
        return $this->belongsTo(Detail::class);
    }
}
