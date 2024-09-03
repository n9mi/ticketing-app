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
        Schema::create('tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('subject');
            $table->string('description');
            $table->foreignId('category_id')->constrained();
            $table->enum('priority', [
                TicketPriority::HIGH->value,
                TicketPriority::NORMAL->value
            ]);
            $table->enum('status', [
                TicketStatus::SUBMITTED->value,
                TicketStatus::ON_HOLD->value,
                TicketStatus::ON_PROGRESS->value,
                TicketStatus::FINISHED_BY_ADMIN->value,
                TicketStatus::FINISHED_BY_DIVISION->value,
                TicketStatus::ASSIGNED_TO_DIVISION->value,
                TicketStatus::REVOKED_BY_USER->value,
                TicketStatus::REJECTED->value
            ]);
            $table->uuid('user_id');
            $table->string('division_id')->nullable();
            $table->string('comment')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('CASCADE');
            $table->foreign('division_id')->references('id')->on('divisions')->onDelete('CASCADE');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
