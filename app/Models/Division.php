<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Division extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'display_name',
    ];

    /**
     * The data type of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Users that belong to the divisions
     */
    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class, 'user_divisions', 'division_id', 'user_id');
    }

    /**
     * Get division's tickets
     */
    public function tickets(): HasMany {
        return $this->hasMany(Ticket::class);
    }
}
