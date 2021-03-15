<?php

namespace Database\Seeders;

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
            UsersTableSeeder::class, TypeSeeder::class,
            ReasonSeeder::class,
            ProductCategorySeeder::class,
            AssessmentSeeder::class,
            CustomerSeeder::class,
            SupplierSeeder::class,
            ActionThOptionSeeder::class,
            AssessmentThOptionSeeder::class,
            PlanStatusSeeder::class,
            AffectedProductSeeder::class
        ]);

        // \App\Models\User::factory(10)->create();
    }
}
