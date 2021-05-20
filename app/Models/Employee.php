<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $connection = 'company_information';
    protected $table = 'Employees';
    protected $with = ['department:DepartmentCode,DepartmentName', 'section:SectionCode,SectionName', 'team:TeamCode,TeamName'];
    public function department()
    {
        return $this->belongsTo(Department::class, 'DepartmentCode', 'DepartmentCode');
    }
    public function section()
    {
        return $this->belongsTo(Section::class, 'SectionCode', 'SectionCode');
    }
    public function team()
    {
        return $this->belongsTo(Team::class, 'TeamCode', 'TeamCode');
    }
}
