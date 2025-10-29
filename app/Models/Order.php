<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'table_number',
        'total_amount',
        'qr_code',
        'order_time',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function recalculateTotal()
    {
        $total = $this->items->sum(fn($item) => $item->quantity * $item->price);
        $this->update(['total_amount' => $total]);
    }
}
