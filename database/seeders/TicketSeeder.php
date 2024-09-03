<?php

namespace Database\Seeders;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Category;
use App\Models\Division;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
         *  Seed categories
         */
        $categoryNames = [
            'account',
            'device',
            'delivery'
        ];
        $categories = [];

        foreach ($categoryNames as $c) {
            array_push($categories, Category::create(['name'=> $c]));
        }

        /*
         *  Get customer users
         */
        $customerUsers = User::whereHas('roles', function ($q) {
            $q->where('roles.id', '=', 'role_customer');
        })->get();

        /*
         *  Seed tickets with account category
         */
        $ticketAccount1 = Ticket::create([
            'subject' => "Can't login into my account",
            'description' => "I can't login into my account after I change my password",
            'category_id' => $categories[0]->id,
            'priority' => TicketPriority::HIGH,
            'status' => TicketStatus::ON_PROGRESS,
            'user_id' => $customerUsers[0]->id,
            'comment' => 'Probably related to recent update on our server'
        ]);
        $ticketAccount2 = Ticket::create([
            'subject' => "Dashboard error",
            'description' => "I can't view my logs on dahsboard",
            'category_id' => $categories[0]->id,
            'priority' => TicketPriority::NORMAL,
            'status' => TicketStatus::SUBMITTED,
            'user_id' => $customerUsers[1]->id,
        ]);

        /*
         *  Seed tickets with device category
         */
        $techDiv = Division::where('id', 'div_tech')->first();
        $ticketDevice1 = Ticket::create([
            'subject' => "Automatically disabled device when driving",
            'description' => "Hello, my devices is automatically disabled when I'm driving",
            'category_id' => $categories[1]->id,
            'priority' => TicketPriority::HIGH,
            'status' => TicketStatus::FINISHED_BY_DIVISION,
            'user_id' => $customerUsers[2]->id,
            'division_id' => $techDiv->id
        ]);
        $ticketDevice2 = Ticket::create([
            'subject' => "Device connectivity",
            'description' => "My phone can't connect into my device via bluetooth",
            'category_id' => $categories[1]->id,
            'priority' => TicketPriority::NORMAL,
            'status' => TicketStatus::ON_HOLD,
            'user_id' => $customerUsers[0]->id,
            'comment' => "There's a high possibility on user's side incompatible device problem"
        ]);

        /*
         *  Seed tickets with device category
         */
        $shippingDiv = Division::where('id', 'div_shipping')->first();
        $ticketMarketplace1 = Ticket::create([
            'subject' => "Shipping cost",
            'description' => "Seems like I got different shipping cost on each reload",
            'category_id' => $categories[2]->id,
            'priority' => TicketPriority::HIGH,
            'status' => TicketStatus::ASSIGNED_TO_DIVISION,
            'user_id' => $customerUsers[1]->id,
            'division_id' => $shippingDiv->id,
            'comment' => "It's related to our third party API integration"
        ]);
        $ticketMarketplace2 = Ticket::create([
            'subject' => "Shopee",
            'description' => "Please sell this device on shopee!",
            'category_id' => $categories[2]->id,
            'priority' => TicketPriority::NORMAL,
            'user_id' => $customerUsers[2]->id,
            'status' => TicketStatus::REJECTED,
            'comment' => "Spam"
        ]);
    }
}
