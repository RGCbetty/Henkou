<?php

namespace Database\Seeders;

use App\Models\PlanTypes;
use Illuminate\Database\Seeder;

class PlanTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        PlanTypes::create([
            'id' => 1,
            'type_name' => 'Kouzou Henkou'
        ]);
        PlanTypes::create([
            'id' => 2,
            'type_name' => 'TH'
        ]);
    }
}
