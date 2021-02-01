<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'customer_code',
        'dodai_invoice',
        '1f_panel_invoice',
        '1f_hari_invoice',
        '1f_iq_invoice',
    ];
    public function detail()
    {
        return $this->hasMany(Detail::class);
    }
}
