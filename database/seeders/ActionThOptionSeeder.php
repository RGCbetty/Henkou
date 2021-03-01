<?php

namespace Database\Seeders;

use App\Models\ThAction;
use Illuminate\Database\Seeder;

class ActionThOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $action_options = array("Cancel", "For CIP", "Borrow Form", "Release");
        $actions = array();
        for ($i = 0; $i < count($action_options); $i++) {
            array_push($actions, array(
                'action_name' => $action_options[$i],
                'updated_by' => '38610',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ));
        }
        ThAction::insert($actions);
    }
}
