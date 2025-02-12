<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;
    protected $connection = 'company_information';
    protected $table = 'Sections';
    public function SectionTeamRelation()
    {
        return $this->belongsTo(SectionTeamRelation::class, 'SectionCode', 'SectionCode');
    }
}
