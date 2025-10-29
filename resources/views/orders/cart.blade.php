@extends('user_mode.app')

@section('content')
<div class="cart-container">
    <div class="cart-header">
        <h1 class="page-title">Your Order</h1>
    </div>

    @if(empty($cart))
        <div class="empty-cart">
            <div class="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <a href="{{ route('orders.create') }}" class="back-btn">Start Ordering</a>
        </div>
    @else
        <div class="cart-items">
            @php $grandTotal = 0; @endphp
            @foreach($cart as $id => $item)
                @php $total = $item['price'] * $item['quantity']; $grandTotal += $total; @endphp
                <div class="cart-item">
                    <div class="item-image">
                        @if($item['image'])
                            <img src="{{ asset('storage/' . $item['image']) }}" alt="{{ $item['name'] }}">
                        @endif
                    </div>
                    <div class="item-details">
                        <h3 class="item-name">{{ $item['name'] }}</h3>
                        <div class="item-price">₱{{ number_format($item['price'], 2) }}</div>
                    </div>
                    <div class="item-controls">
                        <form action="{{ route('orders.update', $id) }}" method="POST" class="qty-form">
                            @csrf
                            <div class="quantity-controls">
                                <button type="button" class="qty-btn minus" onclick="updateCartQty(this, -1)">-</button>
                                <input type="number" name="quantity" value="{{ $item['quantity'] }}" min="1" class="qty-input"
                                    oninput="handleCartQuantityChange(this)">
                                <button type="button" class="qty-btn plus" onclick="updateCartQty(this, 1)">+</button>
                            </div>
                            {{-- <button type="submit" class="update-btn">Update</button> --}}
                        </form>
                    </div>
                    <div class="item-total">
                        ₱{{ number_format($total, 2) }}
                    </div>
                    <form action="{{ route('orders.remove', $id) }}" method="POST" class="remove-form">
                        @csrf
                        <button type="submit" class="remove-btn">Remove</button>
                    </form>
                </div>
            @endforeach
        </div>

        <div class="cart-summary">
            <div class="total-section">
                <div class="total-label">Total Amount</div>
                <div class="total-amount">₱{{ number_format($grandTotal, 2) }}</div>
            </div>

            <div class="cart-actions">
                <a href="{{ route('orders.create') }}" class="continue-btn">Back</a>
                <form action="{{ route('orders.confirm') }}" method="POST" class="confirm-form">
                    @csrf
                    <button type="submit" class="confirm-btn">Confirm Order</button>
                </form>
            </div>
        </div>
    @endif
</div>
@endsection
