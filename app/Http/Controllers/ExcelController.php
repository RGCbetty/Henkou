<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\StreamedResponse;


class ExcelController extends Controller
{
    //
    public function readxls()
    {

        try {
            // $contents = Storage::disk('local')->get('KouzoHenkouForm.xls');
            $path = storage_path('app\public\6230257-2019\AREA CALCULATION.xls');
            info($path);
            $reader = IOFactory::createReader('Xls');
            $spreadsheet = $reader->load($path);
            $spreadsheet->getActiveSheet()->setCellValue('C3', 12345.6789);
            // $worksheet = $spreadsheet->getActiveSheet();
            // info($worksheet->toArray());
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="result.xls"');
            /////////////

            $writer = IOFactory::createWriter($spreadsheet, 'Xls');
            ob_end_clean();
            $writer->save('php://output');
            exit();
            return base64_encode(ob_get_contents());;

            // $spreadsheet = json_decode(json_encode($spreadsheet), true);
            // info($worksheet);
        } catch (\PhpOffice\PhpSpreadsheet\Reader\Exception $e) {
            Log::error('Error loading file: ' . $e->getMessage());
        }
    }
}
