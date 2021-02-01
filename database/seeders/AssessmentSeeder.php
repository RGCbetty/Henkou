<?php

namespace Database\Seeders;

use App\Models\Assessment;
use Illuminate\Database\Seeder;

class AssessmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $reason_lists = array("Affected", "Not Affected", "No Work");
        for ($i = 0; $i < count($reason_lists); $i++) {
            Assessment::create([
                'id' => $i + 1,
                'assessment_name' => $reason_lists[$i],
                'updated_by' => '38610'
            ]);
        }
    }
}
