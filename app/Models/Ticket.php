<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Ticket extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subject',
        'description',
        'category_id',
        'priority',
        'status',
        'user_id',
        'comment'
    ];

    /**
     * The data type of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The "booting" function of model
     *
     * @return void
     */
    protected static function boot() {
        parent::boot();
        static::creating(function ($model) {
            if (!$model->getKey()) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the category ticket belongs to
     */
    public function category(): BelongsTo {
        return $this->belongsTo(Category::class,'category_id');
    }

    /**
     * Get ticket's actions
     */
    public function actions(): HasMany {
        return $this->hasMany(Action::class);
    }
}
