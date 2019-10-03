<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = [
        'group_name',
        'id'
    ];

    /**
     * Get the persons for the group
     */
    public function persons() {
        return $this->hasMany('App\Models\Person');
    }
}
