@extends('user_mode.app')

@section('content')
<div class="order-container">
    <div class="order-header">
        <h1 class="page-title">Choose Your Items</h1>
    </div>

    <div class="categories-section">
        @foreach($categories as $cat)
            <a href="{{ route('orders.create', $cat->id) }}"
               class="category-btn {{ $selectedCategory && $selectedCategory->id === $cat->id ? 'active' : '' }}">
                {{ $cat->name }}
            </a>
        @endforeach
    </div>

    <div class="menu-grid">
        @forelse($menuItems as $item)
            <div class="menu-card">
                @if($item->image)
                    <div class="menu-image">
                        <img src="{{ asset('storage/'.$item->image) }}" alt="{{ $item->name }}">
                    </div>
                @endif
                <div class="menu-info">
                    <h3 class="menu-name">{{ $item->name }}</h3>
                    <div class="menu-price">₱{{ number_format($item->price, 2) }}</div>
                </div>
                <form action="{{ route('orders.add', $item->id) }}" method="POST" class="add-form">
                    @csrf
                    {{-- <div class="quantity-controls">
                        <button type="button" class="qty-btn minus" onclick="decreaseQty(this)">-</button>
                        <input type="number" name="quantity" value="1" min="1" class="qty-input">
                        <button type="button" class="qty-btn plus" onclick="increaseQty(this)">+</button>
                    </div> --}}
                    <button type="submit" class="add-btn">Add to Orders</button>
                </form>
            </div>
        @empty
            <div class="empty-message">
                <p>No items available in this category</p>
            </div>
        @endforelse
    </div>

    @if(!empty(session()->get('cart', [])))
        <div class="cart-summary">
            <a href="{{ route('orders.cart') }}" class="view-cart-btn">
                View Cart ({{ count(session()->get('cart', [])) }} items)
            </a>
        </div>
    @endif
</div>
@endsection
