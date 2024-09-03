<?php

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('actions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('ticket_id');
            $table->uuid('user_id');
            $table->string('description');
            $table->string('comment')->nullable();
            $table->enum('assigned_priority', [
                TicketPriority::HIGH->value,
                TicketPriority::NORMAL->value
            ])->nullable();
            $table->enum('assigned_status', [
                TicketStatus::SUBMITTED->value,
                TicketStatus::ON_HOLD->value,
                TicketStatus::ON_PROGRESS->value,
                TicketStatus::FINISHED_BY_ADMIN->value,
                TicketStatus::FINISHED_BY_DIVISION->value,
                TicketStatus::ASSIGNED_TO_DIVISION->value,
                TicketStatus::REVOKED_BY_USER->value,
                TicketStatus::REJECTED->value
            ])->nullable();

            $table->foreign('ticket_id')->references('id')->on('tickets')->onDelete('CASCADE');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('CASCADE');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actions');
    }
};
