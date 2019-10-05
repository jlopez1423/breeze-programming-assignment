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
    const GROUP_FILE_HEADERS  = ['id', 'group_name'];

    public function upload(Request $request)
    {
        $request->validate([
            'csv_file' => 'required',
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
                    $person = new Person();
                    $result[] = $this->updateRecord($person, $cleaned_row);
                    continue;
                }
                Person::create($cleaned_row);
            }

            // check if is group file
            if ($is_group_file) {
                if ($this->isGroupRecord($cleaned_row['id'])) {
                    $group = new Group();
                    $result[] = $this->updateRecord($group, $cleaned_row);
                    continue;
                }
                Group::create($cleaned_row);
            }

            $result[] = $cleaned_row;
        }
        Storage::disk('local')->delete('file.csv');

        return response()->json([
            'result'         => $result,
            'is_person_file' => $is_person_file,
            'is_group_file'  => $is_group_file,
        ]);
    }

    public function typeOfFile($file_headers, $model_headers)
    {
        $trimmed_headers = array_map('trim', $file_headers);
        foreach ($trimmed_headers as $trimmed_header) {
            if (!in_array($trimmed_header, $model_headers)) {
                return false;
            }
        }
        return true;
    }

    public function isPersonRecord($csv_person_id)
    {
        $person = Person::find($csv_person_id);
        return !empty($person);
    }

    public function isGroupRecord($csv_group_id)
    {
        $group = Group::find($csv_group_id);
        return !empty($group);
    }

    public function updateRecord($model, $cleaned_row)
    {
        $found_object = $model::find($cleaned_row['id']);
        unset($cleaned_row['id']);
        $found_object->update($cleaned_row);
        return $cleaned_row;
    }
}
