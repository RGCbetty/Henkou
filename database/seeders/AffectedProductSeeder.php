<?php

namespace Database\Seeders;

use App\Models\AffectedProduct;
use Illuminate\Database\Seeder;

class AffectedProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $plan_statuses = array(
            /////////////////////////////* E-PLAN PROCESS *///////////////////////////////
            array('plan_status_id' => '1', 'sequence_no' => '1', 'product_category_id' => '11'),
            array('plan_status_id' => '1', 'sequence_no' => '2', 'product_category_id' => '62'),
            array('plan_status_id' => '1', 'sequence_no' => '3', 'product_category_id' => '230'),
            array('plan_status_id' => '1', 'sequence_no' => '4', 'product_category_id' => '35'),
            array('plan_status_id' => '1', 'sequence_no' => '5', 'product_category_id' => '1'),
            /////////////////////////////* E-PLAN PROCESS *///////////////////////////////
            /////////////////////////////* KOUZOU FINISHED WAKU *///////////////////////////////
            array('plan_status_id' => '2', 'sequence_no' => '1', 'product_category_id' => '11'),
            array('plan_status_id' => '2', 'sequence_no' => '2', 'product_category_id' => '62'),
            array('plan_status_id' => '2', 'sequence_no' => '3', 'product_category_id' => '230'),
            array('plan_status_id' => '2', 'sequence_no' => '4', 'product_category_id' => '35'),

            array('plan_status_id' => '2', 'sequence_no' => '5', 'product_category_id' => '152'),
            array('plan_status_id' => '2', 'sequence_no' => '6', 'product_category_id' => '237'),
            array('plan_status_id' => '2', 'sequence_no' => '7', 'product_category_id' => '67'),

            array('plan_status_id' => '2', 'sequence_no' => '8', 'product_category_id' => '299'),
            // array('plan_status_id' => '2', 'sequence_no' => '11', 'product_category_id' => '300'),
            // array('plan_status_id' => '2', 'sequence_no' => '11', 'product_category_id' => '297'),


            array('plan_status_id' => '2', 'sequence_no' => '9', 'product_category_id' => '257'),
            /* WALL DESIGN */
            array('plan_status_id' => '2', 'sequence_no' => '10', 'product_category_id' => '162'),
            /* WALL DESIGN */
            /* CEILING/ROOF DESIGN */
            array('plan_status_id' => '2', 'sequence_no' => '11', 'product_category_id' => '262'),
            // array('plan_status_id' => '2', 'sequence_no' => '14', 'product_category_id' => '285'),
            // array('plan_status_id' => '2', 'sequence_no' => '14', 'product_category_id' => '294'),
            // array('plan_status_id' => '2', 'sequence_no' => '14', 'product_category_id' => '303'),
            // array('plan_status_id' => '2', 'sequence_no' => '14', 'product_category_id' => '304'),
            // array('plan_status_id' => '2', 'sequence_no' => '14', 'product_category_id' => '309'),
            /* CEILING/ROOF DESIGN */

            array('plan_status_id' => '2', 'sequence_no' => '12', 'product_category_id' => '177'),

            array('plan_status_id' => '2', 'sequence_no' => '13', 'product_category_id' => '298'),
            array('plan_status_id' => '2', 'sequence_no' => '14', 'product_category_id' => '297'),
            // PILE PLAN OR PILE PLAN (JAPAN)
            array('plan_status_id' => '2', 'sequence_no' => '15', 'product_category_id' => '174'),
            // PILE PLAN OR PILE PLAN (JAPAN)

            array('plan_status_id' => '2', 'sequence_no' => '16', 'product_category_id' => '279'),
            array('plan_status_id' => '2', 'sequence_no' => '17', 'product_category_id' => '158'),
            array('plan_status_id' => '2', 'sequence_no' => '18', 'product_category_id' => '161'),

            array('plan_status_id' => '2', 'sequence_no' => '19', 'product_category_id' => '282'),

            /* WALL DESIGN */
            // array('plan_status_id' => '2', 'sequence_no' => '16', 'product_category_id' => '162'),

            /* WALL DESIGN */
            // array('plan_status_id' => '2', 'sequence_no' => '17', 'product_category_id' => '140'),
            // array('plan_status_id' => '2', 'sequence_no' => '18', 'product_category_id' => '298'),



            // array('plan_status_id' => '2', 'sequence_no' => '20', 'product_category_id' => '139'),

            // array('plan_status_id' => '2', 'sequence_no' => '22', 'product_category_id' => '238'),
            array('plan_status_id' => '2', 'sequence_no' => '20', 'product_category_id' => '1'),
            /////////////////////////////* KOUZOU FINISHED WAKU *///////////////////////////////

            /////////////////////////////* ONE TIME HENKOU JIKUGUMI *///////////////////////////
            array('plan_status_id' => '3', 'sequence_no' => '1', 'product_category_id' => '11'),
            array('plan_status_id' => '3', 'sequence_no' => '2', 'product_category_id' => '270'),

            array('plan_status_id' => '3', 'sequence_no' => '3', 'product_category_id' => '61'),
            array('plan_status_id' => '3', 'sequence_no' => '4', 'product_category_id' => '229'),
            array('plan_status_id' => '3', 'sequence_no' => '5', 'product_category_id' => '35'),
            array('plan_status_id' => '3', 'sequence_no' => '6', 'product_category_id' => '64'),
            array('plan_status_id' => '3', 'sequence_no' => '7', 'product_category_id' => '66'),
            array('plan_status_id' => '3', 'sequence_no' => '8', 'product_category_id' => '231'),
            array('plan_status_id' => '3', 'sequence_no' => '9', 'product_category_id' => '235'),
            array('plan_status_id' => '3', 'sequence_no' => '10', 'product_category_id' => '236'),
            array('plan_status_id' => '3', 'sequence_no' => '11', 'product_category_id' => '1'),
            /////////////////////////////* ONE TIME HENKOU JIKUGUMI *///////////////////////////

            /////////////////////////////* KOUZOU FINISHED JIKUGUMI *///////////////////////////
            array('plan_status_id' => '4', 'sequence_no' => '1', 'product_category_id' => '11'),
            array('plan_status_id' => '4', 'sequence_no' => '2', 'product_category_id' => '35'),
            array('plan_status_id' => '4', 'sequence_no' => '3', 'product_category_id' => '270'),
            array('plan_status_id' => '4', 'sequence_no' => '4', 'product_category_id' => '61'),
            array('plan_status_id' => '4', 'sequence_no' => '5', 'product_category_id' => '229'),
            array('plan_status_id' => '4', 'sequence_no' => '6', 'product_category_id' => '64'),
            array('plan_status_id' => '4', 'sequence_no' => '7', 'product_category_id' => '256'),
            array('plan_status_id' => '4', 'sequence_no' => '8', 'product_category_id' => '66'),
            array('plan_status_id' => '4', 'sequence_no' => '9', 'product_category_id' => '231'),
            array('plan_status_id' => '4', 'sequence_no' => '11', 'product_category_id' => '235'),
            array('plan_status_id' => '4', 'sequence_no' => '11', 'product_category_id' => '236'),

            array('plan_status_id' => '4', 'sequence_no' => '12', 'product_category_id' => '65'),
            array('plan_status_id' => '4', 'sequence_no' => '13', 'product_category_id' => '232'),
            array('plan_status_id' => '4', 'sequence_no' => '14', 'product_category_id' => '258'),
            array('plan_status_id' => '4', 'sequence_no' => '15', 'product_category_id' => '302'),
            array('plan_status_id' => '4', 'sequence_no' => '16', 'product_category_id' => '178'),
            array('plan_status_id' => '4', 'sequence_no' => '17', 'product_category_id' => '280'),
            array('plan_status_id' => '4', 'sequence_no' => '18', 'product_category_id' => '174'),
            array('plan_status_id' => '4', 'sequence_no' => '19', 'product_category_id' => '278'),
            array('plan_status_id' => '4', 'sequence_no' => '20', 'product_category_id' => '158'),
            array('plan_status_id' => '4', 'sequence_no' => '21', 'product_category_id' => '161'),
            array('plan_status_id' => '4', 'sequence_no' => '22', 'product_category_id' => '1'),
            /////////////////////////////* KOUZOU FINISHED JIKUGUMI *///////////////////////////
        );
        for ($i = 0; $i < count($plan_statuses); $i++) {
            AffectedProduct::create(array(
                'sequence_no' => $plan_statuses[$i]['sequence_no'],
                'updated_by' => '38610',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
                'plan_status_id' => $plan_statuses[$i]['plan_status_id'],
                'product_category_id' => $plan_statuses[$i]['product_category_id'],
            ));
        }
    }
}
