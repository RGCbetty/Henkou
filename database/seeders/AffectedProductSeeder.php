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
            array('plan_status_id' => '1', 'sequence_no' => '1', 'product_category_id' => '10'),
            array('plan_status_id' => '1', 'sequence_no' => '2', 'product_category_id' => '61'),
            array('plan_status_id' => '1', 'sequence_no' => '3', 'product_category_id' => '229'),
            array('plan_status_id' => '1', 'sequence_no' => '4', 'product_category_id' => '34'),

            array('plan_status_id' => '2', 'sequence_no' => '1', 'product_category_id' => '10'),
            array('plan_status_id' => '2', 'sequence_no' => '2', 'product_category_id' => '61'),
            array('plan_status_id' => '2', 'sequence_no' => '3', 'product_category_id' => '229'),
            array('plan_status_id' => '2', 'sequence_no' => '4', 'product_category_id' => '34'),

            array('plan_status_id' => '2', 'sequence_no' => '5', 'product_category_id' => '229'),
            array('plan_status_id' => '2', 'sequence_no' => '6', 'product_category_id' => '151'),
            array('plan_status_id' => '2', 'sequence_no' => '7', 'product_category_id' => '236'),
            array('plan_status_id' => '2', 'sequence_no' => '8', 'product_category_id' => '66'),

            array('plan_status_id' => '2', 'sequence_no' => '9', 'product_category_id' => '298'),
            array('plan_status_id' => '2', 'sequence_no' => '10', 'product_category_id' => '299'),
            array('plan_status_id' => '2', 'sequence_no' => '11', 'product_category_id' => '299'),
            array('plan_status_id' => '2', 'sequence_no' => '12', 'product_category_id' => '296'),

            array('plan_status_id' => '2', 'sequence_no' => '13', 'product_category_id' => '281'),
            array('plan_status_id' => '2', 'sequence_no' => '14', 'product_category_id' => '256'),
            /* CEILING/ROOF DESIGN */
            array('plan_status_id' => '2', 'sequence_no' => '15', 'product_category_id' => '261'),
            array('plan_status_id' => '2', 'sequence_no' => '15', 'product_category_id' => '284'),
            array('plan_status_id' => '2', 'sequence_no' => '15', 'product_category_id' => '293'),
            array('plan_status_id' => '2', 'sequence_no' => '15', 'product_category_id' => '302'),
            array('plan_status_id' => '2', 'sequence_no' => '15', 'product_category_id' => '303'),
            array('plan_status_id' => '2', 'sequence_no' => '15', 'product_category_id' => '308'),
            /* CEILING/ROOF DESIGN */

            array('plan_status_id' => '2', 'sequence_no' => '16', 'product_category_id' => '176'),

            /* WALL DESIGN */
            array('plan_status_id' => '2', 'sequence_no' => '16', 'product_category_id' => '161'),
            array('plan_status_id' => '2', 'sequence_no' => '16', 'product_category_id' => '162'),
            array('plan_status_id' => '2', 'sequence_no' => '16', 'product_category_id' => '163'),
            array('plan_status_id' => '2', 'sequence_no' => '16', 'product_category_id' => '164'),
            array('plan_status_id' => '2', 'sequence_no' => '16', 'product_category_id' => '165'),
            /* WALL DESIGN */
            array('plan_status_id' => '2', 'sequence_no' => '18', 'product_category_id' => '139'),
            array('plan_status_id' => '2', 'sequence_no' => '19', 'product_category_id' => '297'),

            // PILE PLAN OR PILE PLAN (JAPAN)
            array('plan_status_id' => '2', 'sequence_no' => '20', 'product_category_id' => '173'),

            array('plan_status_id' => '2', 'sequence_no' => '21', 'product_category_id' => '138'),
            array('plan_status_id' => '2', 'sequence_no' => '22', 'product_category_id' => '278'),
            array('plan_status_id' => '2', 'sequence_no' => '23', 'product_category_id' => '237'),
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
