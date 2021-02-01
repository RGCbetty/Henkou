<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    protected $fillable = ['id', 'product_name', 'sequence_no', 'department_id', 'section_id', 'team_id', 'created_at', 'updated_at', 'updated_by'];
}
