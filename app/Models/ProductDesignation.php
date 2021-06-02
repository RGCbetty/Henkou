<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDesignation extends Model
{
    use HasFactory;
    protected $with = ['department:DepartmentCode,DepartmentName', 'section:SectionCode,SectionName', 'team:TeamCode,TeamName'];
    protected $fillable = ['product_key', 'department_id', 'section_id', 'team_id', 'created_at', 'updated_at', 'updated_by'];
    protected $guarded = [];
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'DepartmentCode');
    }
    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id', 'SectionCode');
    }
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'TeamCode');
    }
}
