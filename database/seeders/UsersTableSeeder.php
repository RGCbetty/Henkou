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
            'employee_no' => '35855',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('35855'),
        ]);
        User::create([
            'employee_no' => '05705',
            'access_level' => 2,
            'is_registered' => true,
            'password' => bcrypt('05705'),
        ]);
        User::create([
            'employee_no' => '05510',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('admin'),
        ]);
        User::create([
            'employee_no' => '09005',
            'access_level' => 1,
            'is_registered' => true,
            'password' => bcrypt('admin'),
        ]);
        User::create([
            'employee_no' => '00629',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('admin'),
        ]);
        User::create([
            'employee_no' => '26221',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('26221'),
        ]);
        User::create([
            'employee_no' => '33557',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('33557'),
        ]);
        User::create([
            'employee_no' => '36883',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('36883'),
        ]);
        //         "DepartmentName": "Exterior",
        // "SectionCode": "329",
        // "SectionName": "Balcony Floor",
        // "TeamCode": "0323",
        // "TeamName": "Balcony Handrail"
        User::create([
            'employee_no' => '20482',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('20482'),
        ]);
        //         "DepartmentCode": "57",
        // "DepartmentName": "HACCHU",
        // "SectionCode": "408",
        // "SectionName": "Zousaku Hiroi",
        // "TeamCode": "0357",
        // "TeamName": "Western Frame 2"
        User::create([
            'employee_no' => '21492',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('21492'),
        ]);
        //         "DepartmentCode": "57",
        // "DepartmentName": "HACCHU",
        // "SectionCode": "408",
        // "SectionName": "Zousaku Hiroi",
        // "TeamCode": "0358",
        // "TeamName": "Japanese Frame"

        User::create([
            'employee_no' => '28527',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('28527'),
        ]);
        //         "DepartmentCode": "57",
        // "DepartmentName": "HACCHU",
        // "SectionCode": "248",
        // "SectionName": "Kensetsu",
        // "TeamCode": "0359",
        // "TeamName": "Tategu"
        User::create([
            'employee_no' => '28634',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('28634'),
        ]);

        //         "DepartmentCode": "57",
        // "DepartmentName": "HACCHU",
        // "SectionCode": "409",
        // "SectionName": "Setsubi Hiroi",
        // "TeamCode": "0124",
        // "TeamName": "Oshiire"
        User::create([
            'employee_no' => '23578',
            'access_level' => 2,
            'is_registered' => true,
            'password' => bcrypt('23578'),
        ]);
        // Foundation	Foundation Calculation	Porch Design
        User::create([
            'employee_no' => '34465',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('34465'),
        ]);

        // UNIT WIRING	PS5 Denki Ceiling	PS5 Ceiling 1
        User::create([
            'employee_no' => '33897',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('33897'),
        ]);
        // HACCHU	Shitaji Hiroi	Jiku Shitaji
        User::create([
            'employee_no' => '20167',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('20167'),
        ]);
        // Panel Assembly	Yukadanbou A	Evaluation
        User::create([
            'employee_no' => '25457',
            'access_level' => 3,
            'is_registered' => true,
            'password' => bcrypt('25457'),
        ]);
    }
}
