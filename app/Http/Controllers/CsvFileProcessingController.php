<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Port\Reader\ArrayReader;
use Port\Csv\CsvReader;
use Illuminate\Support\Facades\Storage;
use App\Models\Person;

class CsvFileProcessingController extends Controller
{
    const PERSON_FILE_HEADERS = ['id', 'first_name', 'last_name', 'email_address', 'status', 'group_id'];
    const GROUP_FILE_HEADERS = ['id', 'group_name'];

    public function upload(Request $request)
    {
        $request->validate([
            'csv_file' => 'required'
        ]);

        Storage::disk('local')->put('file.csv', $request->get('csv_file'));
        $file = new \SplFileObject(\Storage::path('file.csv'));
        $reader = new CsvReader($file);
        $headers = $reader->getRow(0);
        $reader->setHeaderRowNumber(0);
        $is_person_file = $this->typeOfFile($headers, self::PERSON_FILE_HEADERS);
        $is_group_file = $this->typeOfFile($headers, self::GROUP_FILE_HEADERS);
        $result = [];

        foreach ($reader as $row) {
            $trimmed_keys = array_map('trim', array_keys($row));
            $trimmed_values = array_map('trim', $row);
            $cleaned_row = array_combine($trimmed_keys, $trimmed_values);

            if ($is_person_file) {
                // if exists -- update
                if ($this->isPersonRecord($cleaned_row['id'])) {
                    $person = Person::find($cleaned_row['id']);
                    unset($cleaned_row['id']);
                    $person->update($cleaned_row);
                    $result[] = $cleaned_row;
                    continue;
                }

                $person = Person::create($cleaned_row);
            }

            // check if is group file
            if ($is_group_file) {
                Group::create($cleaned_row);
            }

            $result[] = $cleaned_row;
        }
        Storage::disk('local')->delete('file.csv');

        return $result;
    }

    public function typeOfFile($file_headers, $model_headers)
    {
        return array_map('trim', $file_headers) === $model_headers;
    }

    public function isPersonRecord($csv_person_id)
    {
        $person = Person::find($csv_person_id);
        return !empty($person);
    }
}
