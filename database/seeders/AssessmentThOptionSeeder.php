<?php

namespace Database\Seeders;

use App\Models\ThAssessment;
use Illuminate\Database\Seeder;

class AssessmentThOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $assessment_th_options = array("plan detail", "location", "plan detail & location", "PEL", "Denki TH");
        for ($i = 0; $i < count($assessment_th_options); $i++) {
            THassessment::create([
                'assessment_th_name' => $assessment_th_options[$i],
                'updated_by' => '38610'
            ]);
        }
    }
}
