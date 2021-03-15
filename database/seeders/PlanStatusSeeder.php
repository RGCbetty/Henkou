<?php

namespace Database\Seeders;

use App\Models\PlanStatus;
use Illuminate\Database\Seeder;

class PlanStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $plan_statuses = array("E-PLAN PROCESS", "KOUZOU FINISHED-WAKU", "ONE TIME HENKOU", "KOUZOU FINISHED-JIKU");
        for ($i = 0; $i < count($plan_statuses); $i++) {
            PlanStatus::create(array(
                'plan_status_name' => $plan_statuses[$i],
                'updated_by' => '38610',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ));
        }
    }
}
