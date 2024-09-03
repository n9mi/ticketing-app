<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

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
     * Roles that belong to the user
     */
    public function roles(): BelongsToMany {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    /**
     * Check if user has specific role, by match the role.id without role_
     */
    public function hasRole(string $role): bool {
        return $this->roles()->where('roles.id', 'role_'.$role)->exists();
    }

    /**
     * Divisions that user has been assigned to
     */
    public function divisions(): BelongsToMany {
        return $this->belongsToMany(Division::class, 'user_divisions', 'user_id', 'division_id');
    }

    /**
     * Check if user has belong to specific division, by match the division.id without div_
     */
    public function isBelongToDivision(string $division): bool {
        return $this->roles()->where('divisions.id', 'div_'.$division)->exists();
    }

    /**
     * Get user's tickets
     */
    public function tickets(): HasMany {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Get user's actions
     */
    public function actions(): HasMany {
        return $this->hasMany(Action::class);
    }
}
