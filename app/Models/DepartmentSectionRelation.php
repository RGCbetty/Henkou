<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DepartmentSectionRelation extends Model
{
    use HasFactory;
    protected $connection = 'company_information';
    protected $table = 'DepartmentSectionRelations as A';
}
