<?php

namespace Database\Seeders;

use App\Models\Division;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
            Seed roles
        */
        $adminRole = Role::create([
            'id'=> 'role_admin',
            'display_name' => 'Admin'
        ]);
        $customerRole = Role::create([
            'id'=> 'role_customer',
            'display_name' => 'Customer'
        ]);
        $divRole = Role::create([
            'id' => 'role_div',
            'display_name' => 'Division'
        ]);

        /*
            Seed divisions
        */
        $techDiv = Division::create([
            'id' => 'div_tech',
            'display_name' => 'Tech Division'
        ]);
        $shippingDiv = Division::create([
            'id' => 'div_shipping',
            'display_name' => 'Shipping Division'
        ]);

        /*
            Seed admin
        */
        $adminUser = User::create([
            'name' => 'Admin 1',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
        ]);
        $adminUser->roles()->attach($adminRole);

        /*
            Seed customer
        */
        for ($i = 1; $i <= 3; $i++) {
            $customerUser = User::create([
                'name' => 'Customer '.$i,
                'email' => 'customer'.$i.'@test.com',
                'password' => Hash::make('password'),
            ]);
            $customerUser->roles()->attach($customerRole);
        }

        /*
            Seed division user
        */
        $techDivUser = User::create([
            'name' => 'Tech Divison 1',
            'email' => 'div.tech@test.com',
            'password'=> Hash::make('password'),
        ]);
        $techDivUser->roles()->attach($divRole);
        $techDivUser->divisions()->attach($techDiv);

        $shippingDivUser = User::create([
            'name' => 'Product Divison 1',
            'email' => 'div.product@test.com',
            'password'=> Hash::make('password'),
        ]);
        $shippingDivUser->roles()->attach($divRole);
        $shippingDivUser->divisions()->attach($shippingDiv);
    }
}
