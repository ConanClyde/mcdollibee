<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;

// Default homepage -> show menu items list (admin side)
Route::get('/', [MenuItemController::class, 'index']);

// CRUD for menu items (admin side)
Route::resource('menu_items', MenuItemController::class);

// Ordering (user side)
Route::get('/order/cart', [OrderController::class, 'viewCart'])->name('orders.cart'); // 👈 move this UP
Route::post('/order/add/{id}', [OrderController::class, 'addToCart'])->name('orders.add');
Route::post('/order/update/{id}', [OrderController::class, 'updateCart'])->name('orders.update');
Route::post('/order/remove/{id}', [OrderController::class, 'removeFromCart'])->name('orders.remove');
Route::post('/order/confirm', [OrderController::class, 'confirmOrder'])->name('orders.confirm');

// This must stay last so it doesn’t override other routes
Route::get('/order/{category?}', [OrderController::class, 'create'])->name('orders.create');
