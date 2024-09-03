<?php

use App\Http\Controllers\Customer\TicketController;
use Illuminate\Support\Facades\Route;

Route::group([
            'prefix' => 'customer',
            'as' => 'customer.',
            'middleware' => ['auth', 'role-check:customer']],
    function () {
        Route::get('/my-tickets', [ TicketController::class, 'index' ])
            ->name('my-tickets');
        Route::get('/create-ticket', [ TicketController::class, 'create' ])
            ->name('create-ticket');
        Route::post('/create-ticket', [ TicketController::class, 'store' ])
            ->name('create-ticket.store');
        Route::get('/edit-ticket/{id}', [ TicketController::class, 'edit' ])
            ->name('edit-ticket');
        Route::put('/update-ticket/{id}', [ TicketController::class, 'update' ])
            ->name('update-ticket');
        Route::patch('/revoke-ticket/{id}', [ TicketController::class, 'revoke' ])
            ->name('revoke-ticket');
    });
