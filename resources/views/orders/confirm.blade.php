@extends('user_mode.app')

@section('content')
<div class="confirm-container">
    <div class="success-header">
        <div class="success-icon">✓</div>
        <h1 class="success-title">Order Confirmed!</h1>
    </div>

    <div class="order-details">
        <div class="detail-card">
            <div class="detail-row">
                <span class="detail-label">Order Number</span>
                <span class="detail-value">{{ $order->order_number }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Table Number</span>
                <span class="detail-value">{{ $order->table_number }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Amount</span>
                <span class="detail-value">₱{{ number_format($order->total_amount, 2) }}</span>
            </div>

        </div>
    </div>

    <div class="qr-section">
        <h3 class="qr-title">Your Order QR Code</h3>
        <div class="qr-container">
            <img src="{{ asset('storage/' . $order->qr_code) }}" alt="Order QR Code" class="qr-code">
        </div>
        <p class="qr-instruction">Please keep this QR code for your order reference</p>
    </div>

    <div class="confirm-actions">
        <div class="thank-message">Thank you for ordering at McDollibee!</div>
        <a href="{{ route('orders.create') }}" class="new-order-btn">Place Another Order</a>
    </div>
</div>
@endsection
