<?php

namespace Database\Seeders;

use App\Models\PlanTypes;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            ProductCategorySeeder::class,
            UsersTableSeeder::class,
            PlanTypesSeeder::class,
            ReasonSeeder::class,
            AssessmentSeeder::class,
            ActionThOptionSeeder::class,
            AssessmentThOptionSeeder::class,
            PlanStatusSeeder::class,
            AffectedProductSeeder::class,
            ProductDesignationSeeder::class
        ]);

        // \App\Models\User::factory(10)->create();
    }
}
