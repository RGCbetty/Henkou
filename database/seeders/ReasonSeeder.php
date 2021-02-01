<?php

namespace Database\Seeders;

use App\Models\Reason;
use Illuminate\Database\Seeder;

class ReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //

        $reason_lists = array("HRD Mistake", "Japan Mistake", "Planner's Request", "New Rule", "System Error", "Rule Conflict");
        for ($i = 0; $i < count($reason_lists); $i++) {
            Reason::create([
                'id' => $i + 1,
                'reason_name' => $reason_lists[$i],
            ]);
        }


        // Japan Mistake
        // Planner's Request
        // New Rule
        // System Error
        // Rule Conflict

    }
}
