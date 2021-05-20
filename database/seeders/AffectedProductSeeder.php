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
            array('plan_status_id' => '1', 'sequence_no' => '1', 'product_key' => 'aPi@wUk3D'),
            array('plan_status_id' => '1', 'sequence_no' => '2', 'product_key' => 'EZUfxwTF3m'),
            array('plan_status_id' => '1', 'sequence_no' => '3', 'product_key' => 'iTJq1UgNMJr'),
            array('plan_status_id' => '1', 'sequence_no' => '4', 'product_key' => 'GY6Mp2NOVYP'),
            array('plan_status_id' => '1', 'sequence_no' => '5', 'product_key' => 'KYNvAowJs'),
            /////////////////////////////* E-PLAN PROCESS *///////////////////////////////
            /////////////////////////////* KOUZOU FINISHED WAKU *///////////////////////////////
            array('plan_status_id' => '2', 'sequence_no' => '1', 'product_key' => 'aPi@wUk3D'),
            array('plan_status_id' => '2', 'sequence_no' => '2', 'product_key' => 'EZUfxwTF3m'),
            array('plan_status_id' => '2', 'sequence_no' => '3', 'product_key' => 'iTJq1UgNMJr'),
            array('plan_status_id' => '2', 'sequence_no' => '4', 'product_key' => 'GY6Mp2NOVYP'),

            array('plan_status_id' => '2', 'sequence_no' => '5', 'product_key' => '5BvN6w6$q5'),
            array('plan_status_id' => '2', 'sequence_no' => '6', 'product_key' => 'ayOUXpwEYbk'),
            array('plan_status_id' => '2', 'sequence_no' => '7', 'product_key' => 'xQmqAV8x$uY'),

            array('plan_status_id' => '2', 'sequence_no' => '8', 'product_key' => '2XzIlNEkCn7'),
            // array('plan_status_id' => '2', 'sequence_no' => '11', 'product_key' => '300'),
            // array('plan_status_id' => '2', 'sequence_no' => '11', 'product_key' => '297'),


            array('plan_status_id' => '2', 'sequence_no' => '9', 'product_key' => 'CNyofOmRvEE'),
            /* WALL DESIGN */
            array('plan_status_id' => '2', 'sequence_no' => '10', 'product_key' => 'XCxmY@VBuY6'),
            /* WALL DESIGN */
            /* CEILING/ROOF DESIGN */
            array('plan_status_id' => '2', 'sequence_no' => '11', 'product_key' => 'oVbLu5$072C'),
            // array('plan_status_id' => '2', 'sequence_no' => '14', 'product_key' => '285'),
            // array('plan_status_id' => '2', 'sequence_no' => '14', 'product_key' => '294'),
            // array('plan_status_id' => '2', 'sequence_no' => '14', 'product_key' => '303'),
            // array('plan_status_id' => '2', 'sequence_no' => '14', 'product_key' => '304'),
            // array('plan_status_id' => '2', 'sequence_no' => '14', 'product_key' => '309'),
            /* CEILING/ROOF DESIGN */

            array('plan_status_id' => '2', 'sequence_no' => '12', 'product_key' => 'TAGRDazjXr4'),

            array('plan_status_id' => '2', 'sequence_no' => '13', 'product_key' => 'BybhBtsK'),
            array('plan_status_id' => '2', 'sequence_no' => '14', 'product_key' => '2Mu6C6KK'),
            // PILE PLAN OR PILE PLAN (JAPAN)
            array('plan_status_id' => '2', 'sequence_no' => '15', 'product_key' => 'HdbgcEvkN7H'),
            // PILE PLAN OR PILE PLAN (JAPAN)

            array('plan_status_id' => '2', 'sequence_no' => '16', 'product_key' => 'vOKoJ63CVxr'),
            array('plan_status_id' => '2', 'sequence_no' => '17', 'product_key' => 'zcqOMJyMDF8'),
            array('plan_status_id' => '2', 'sequence_no' => '18', 'product_key' => 'jOSpwAAg1YK'),

            array('plan_status_id' => '2', 'sequence_no' => '19', 'product_key' => 'r4cvmV0U4VG'),

            /* WALL DESIGN */
            // array('plan_status_id' => '2', 'sequence_no' => '16', 'product_key' => '162'),

            /* WALL DESIGN */
            // array('plan_status_id' => '2', 'sequence_no' => '17', 'product_key' => '140'),
            // array('plan_status_id' => '2', 'sequence_no' => '18', 'product_key' => '298'),



            // array('plan_status_id' => '2', 'sequence_no' => '20', 'product_key' => '139'),

            // array('plan_status_id' => '2', 'sequence_no' => '22', 'product_key' => '238'),
            array('plan_status_id' => '2', 'sequence_no' => '20', 'product_key' => 'KYNvAowJs'),
            /////////////////////////////* KOUZOU FINISHED WAKU *///////////////////////////////

            /////////////////////////////* ONE TIME HENKOU JIKUGUMI *///////////////////////////
            array('plan_status_id' => '3', 'sequence_no' => '1', 'product_key' => 'aPi@wUk3D'),
            array('plan_status_id' => '3', 'sequence_no' => '2', 'product_key' => 'MI63Kv978Hm'),

            array('plan_status_id' => '3', 'sequence_no' => '3', 'product_key' => 'XFE2IFJEByj'),
            array('plan_status_id' => '3', 'sequence_no' => '4', 'product_key' => 'BdqSI1DQXtT'),
            array('plan_status_id' => '3', 'sequence_no' => '5', 'product_key' => 'GY6Mp2NOVYP'),
            array('plan_status_id' => '3', 'sequence_no' => '6', 'product_key' => 'cLYHjeT6Y9d'),
            array('plan_status_id' => '3', 'sequence_no' => '7', 'product_key' => 'GJlfz3TEcJt'),
            array('plan_status_id' => '3', 'sequence_no' => '8', 'product_key' => 'OllxJxLvFhH'),
            array('plan_status_id' => '3', 'sequence_no' => '9', 'product_key' => 'UJJIgQlcy'),
            array('plan_status_id' => '3', 'sequence_no' => '10', 'product_key' => 'WQz0k4no5B9'),
            array('plan_status_id' => '3', 'sequence_no' => '11', 'product_key' => 'KYNvAowJs'),
            /////////////////////////////* ONE TIME HENKOU JIKUGUMI *///////////////////////////

            /////////////////////////////* KOUZOU FINISHED JIKUGUMI *///////////////////////////
            array('plan_status_id' => '4', 'sequence_no' => '1', 'product_key' => 'aPi@wUk3D'),
            array('plan_status_id' => '4', 'sequence_no' => '2', 'product_key' => 'GY6Mp2NOVYP'),
            array('plan_status_id' => '4', 'sequence_no' => '3', 'product_key' => 'MI63Kv978Hm'),
            array('plan_status_id' => '4', 'sequence_no' => '4', 'product_key' => 'XFE2IFJEByj'),
            array('plan_status_id' => '4', 'sequence_no' => '5', 'product_key' => 'BdqSI1DQXtT'),
            array('plan_status_id' => '4', 'sequence_no' => '6', 'product_key' => 'cLYHjeT6Y9d'),
            array('plan_status_id' => '4', 'sequence_no' => '7', 'product_key' => '5DV0KFSycF6'),
            array('plan_status_id' => '4', 'sequence_no' => '8', 'product_key' => 'GJlfz3TEcJt'),
            array('plan_status_id' => '4', 'sequence_no' => '9', 'product_key' => 'OllxJxLvFhH'),
            array('plan_status_id' => '4', 'sequence_no' => '10', 'product_key' => 'UJJIgQlcy'),
            array('plan_status_id' => '4', 'sequence_no' => '11', 'product_key' => 'WQz0k4no5B9'),

            array('plan_status_id' => '4', 'sequence_no' => '12', 'product_key' => 'DbwGj5G8Y'),
            array('plan_status_id' => '4', 'sequence_no' => '13', 'product_key' => 'xmfEHcKFIc4'),
            array('plan_status_id' => '4', 'sequence_no' => '14', 'product_key' => 'sSl9lQgciB1'),
            array('plan_status_id' => '4', 'sequence_no' => '15', 'product_key' => 'RWdg4PmUB'),
            array('plan_status_id' => '4', 'sequence_no' => '16', 'product_key' => 'sAYp8v0Kae@'),
            array('plan_status_id' => '4', 'sequence_no' => '17', 'product_key' => 'aHDBSpTmo'),
            array('plan_status_id' => '4', 'sequence_no' => '18', 'product_key' => 'HdbgcEvkN7H'),
            array('plan_status_id' => '4', 'sequence_no' => '19', 'product_key' => 'LUoqLiJ@D'),
            array('plan_status_id' => '4', 'sequence_no' => '20', 'product_key' => 'zcqOMJyMDF8'),
            array('plan_status_id' => '4', 'sequence_no' => '21', 'product_key' => 'jOSpwAAg1YK'),
            array('plan_status_id' => '4', 'sequence_no' => '22', 'product_key' => 'KYNvAowJs'),
            /////////////////////////////* KOUZOU FINISHED JIKUGUMI *///////////////////////////
        );
        for ($i = 0; $i < count($plan_statuses); $i++) {
            AffectedProduct::create(array(
                'sequence_no' => $plan_statuses[$i]['sequence_no'],
                'updated_by' => '38610',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
                'plan_status_id' => $plan_statuses[$i]['plan_status_id'],
                'product_key' => $plan_statuses[$i]['product_key'],
            ));
        }
    }
}
