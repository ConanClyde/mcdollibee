<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Setting;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
// use SimpleSoftwareIO\QrCode\Facades\QrCode;
use SimpleSoftwareIO\QrCode\Generator;


class OrderController extends Controller
{
    /**
     * Show menu for ordering (with categories).
     */
    public function create($categoryId = null)
    {
        $categories = Category::all();

        if ($categoryId) {
            $selectedCategory = Category::findOrFail($categoryId);
            $menuItems = $selectedCategory->menuItems()->where('status', 'Available')->get();
        } else {
            $selectedCategory = $categories->first();
            $menuItems = $selectedCategory
                ? $selectedCategory->menuItems()->where('status', 'Available')->get()
                : collect();
        }

        return view('orders.create', compact('categories', 'menuItems', 'selectedCategory'));
    }


    /**
     * Add item to cart (session).
     */
    public function addToCart(Request $request, $id)
    {
        $menuItem = MenuItem::findOrFail($id);

        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id]['quantity']++;
        } else {
            $cart[$id] = [
                "name"     => $menuItem->name,
                "price"    => $menuItem->price,
                "image"    => $menuItem->image, // âœ… store image path
                "quantity" => 1,
            ];
        }

        session()->put('cart', $cart);

        return redirect()->back()->with('success', "{$menuItem->name} added to cart.");
    }


    /**
     * View cart contents.
     */
    public function viewCart()
    {
        $cart = session()->get('cart', []);
        return view('orders.cart', compact('cart'));
    }


    /**
     * Update item quantity in cart.
     */
    public function updateCart(Request $request, $id)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id]['quantity'] = $request->quantity;
            session()->put('cart', $cart);
            return redirect()->back()->with('success', 'Cart updated.');
        }

        return redirect()->back()->with('error', 'Item not found in cart.');
    }

    /**
     * Remove item from cart.
     */
    public function removeFromCart($id)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]);
            session()->put('cart', $cart);
            return redirect()->back()->with('success', 'Item removed from cart.');
        }

        return redirect()->back()->with('error', 'Item not found in cart.');
    }

    /**
     * Confirm order and save to DB.
     */

    public function confirmOrder(Request $request, Generator $qrCode)
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('orders.create')
                            ->with('error', 'Cart is empty.');
        }

        // Generate unique order number
        $orderNumber = 'ORD-' . strtoupper(Str::random(6));

        // âœ… Persistent sequential table number
        $setting = Setting::firstOrCreate(
            ['key' => 'last_table_number'],
            ['value' => 0]
        );

        $lastTableNumber = (int) $setting->value;
        $newTableNumber = $lastTableNumber + 1;

        if ($newTableNumber > 999) {
            $newTableNumber = 1;
        }

        // Save new last number back to DB
        $setting->update(['value' => $newTableNumber]);

        // Format with leading zeros
        $tableNumber = str_pad($newTableNumber, 3, '0', STR_PAD_LEFT);

        // Compute total
        $totalAmount = collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']);

        // Save order
        $order = Order::create([
            'order_number' => $orderNumber,
            'table_number' => $tableNumber,
            'total_amount' => $totalAmount,
            'status'       => 'confirmed',
        ]);

        foreach ($cart as $menuItemId => $item) {
            OrderItem::create([
                'order_id'     => $order->id,
                'menu_item_id' => $menuItemId,
                'quantity'     => $item['quantity'],
                'price'        => $item['price'],
            ]);
        }

        $order->load('items.menuItem');

        // Build QR
        $qrContent = "Order: {$order->order_number}\n";
        $qrContent .= "Table: {$order->table_number}\n";
        $qrContent .= "-------------------------\n";

        foreach ($order->items as $item) {
            $lineTotal = $item->price * $item->quantity;
            $qrContent .= "{$item->quantity}x {$item->menuItem->name} - â‚±"
                        . number_format($lineTotal, 2) . "\n";
        }

        $qrContent .= "-------------------------\n";
        $qrContent .= "TOTAL: â‚±" . number_format($order->total_amount, 2);

        $qrPath = "qrcodes/{$order->order_number}.svg";
        $svgData = $qrCode->encoding('UTF-8')->format('svg')->size(300)->generate($qrContent);
        Storage::disk('public')->put($qrPath, $svgData);

        $order->update(['qr_code' => $qrPath]);

        session()->forget('cart');

        return view('orders.confirm', compact('order'));
    }


}
