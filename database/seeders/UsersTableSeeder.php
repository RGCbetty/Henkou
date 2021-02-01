<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        // $faker = \Faker\Factory::create();
        User::create([
            'employee_no' => '36301',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('1'),
        ]);
        User::create([
            'employee_no' => '38610',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('admin'),
        ]);
        User::create([
            'employee_no' => '05510',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('admin'),
        ]);
        User::create([
            'employee_no' => '09005',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('admin'),
        ]);
        User::create([
            'employee_no' => '00629',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('admin'),
        ]);
    }
}
