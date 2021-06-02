<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SectionTeamRelation extends Model
{
    use HasFactory;
    protected $table = 'SectionTeamRelations';
    protected $connection = 'company_information';
    public function Departments()
    {
        return $this->hasOne(Department::class, 'DepartmentCode', 'DepartmentCode');
    }
    public function Sections()
    {
        return $this->hasOne(Section::class, 'SectionCode', 'SectionCode');
    }
    public function Teams()
    {
        return $this->hasOne(Team::class, 'TeamCode', 'TeamCode');
    }
}
