@extends('layouts.app')

@section('title', $menuItem->name . ' - McDonald\'s Management')

@section('content')
<div class="page-header">
    <h1 class="page-title">Menu Item Details</h1>
    <div class="action-btn">
        <a href="{{ route('menu_items.edit', $menuItem) }}" class="btn btn-primary">Edit Item</a>
        <a href="{{ route('menu_items.index') }}" class="btn btn-secondary">← Back to Menu</a>
    </div>
</div>

<div class="detail-container">
    <div class="detail-grid">
        <div class="detail-image-section">
            @if($menuItem->image)
                <img src="{{ asset('storage/' . $menuItem->image) }}"
                     alt="{{ $menuItem->name }}"
                     class="detail-image">
            @else
                <div class="detail-image" style="
                    background: var(--light-gray);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--gray);
                    font-size: 1.1rem;
                    font-weight: 500;
                    height: 300px;
                ">
                    No Image Available
                </div>
            @endif
        </div>

        <div class="detail-info">
            <div class="detail-field">
                <span class="detail-label">Item Name</span>
                <span class="detail-value">{{ $menuItem->name }}</span>
            </div>

            <div class="detail-field">
                <span class="detail-label">Price</span>
                <span class="detail-value" style="
                    color: var(--mcdonalds-red);
                    font-weight: bold;
                    font-size: 1.5rem;
                ">₱{{ number_format($menuItem->price, 2) }}</span>
            </div>

            <div class="detail-field">
                <span class="detail-label">Status</span>
                <span class="menu-item-status {{ $menuItem->status == 'Available' ? 'status-available' : 'status-unavailable' }}">
                    {{ $menuItem->status }}
                </span>
            </div>

            <div class="detail-field">
                <span class="detail-label">Category</span>
                <span class="detail-value">
                    @if($menuItem->category)
                        <span style="
                            background: var(--mcdonalds-yellow);
                            color: var(--mcdonalds-red);
                            padding: 0.25rem 0.75rem;
                            border-radius: 15px;
                            font-weight: 600;
                            font-size: 0.9rem;
                        ">{{ $menuItem->category->name }}</span>
                    @else
                        <span style="color: var(--gray);">Uncategorized</span>
                    @endif
                </span>
            </div>

            <div class="detail-field">
                <span class="detail-label">Created</span>
                <span class="detail-value">{{ $menuItem->created_at->format('M d, Y at h:i A') }}</span>
            </div>

            @if($menuItem->updated_at != $menuItem->created_at)
            <div class="detail-field">
                <span class="detail-label">Last Updated</span>
                <span class="detail-value">{{ $menuItem->updated_at->format('M d, Y at h:i A') }}</span>
            </div>
            @endif
        </div>
    </div>

    <!-- Action Buttons -->
    <div style="
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid var(--light-gray);
        flex-wrap: wrap;
    ">
        <a href="{{ route('menu_items.edit', $menuItem) }}" class="btn btn-primary">
            Edit This Item
        </a>

        <form action="{{ route('menu_items.destroy', $menuItem) }}" method="POST" style="display:inline">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger delete-btn">
                Delete Item
            </button>
        </form>

        <a href="{{ route('menu_items.create') }}" class="btn btn-secondary">
            Add New Item
        </a>
    </div>
</div>

{{-- <!-- Quick Stats -->
<div style="
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
">
    <div style="
        background: var(--white);
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 4px 12px var(--shadow);
        text-align: center;
    ">
        <div style="
            font-size: 1.8rem;
            font-weight: bold;
            color: var(--mcdonalds-red);
        ">₱{{ number_format($menuItem->price, 2) }}</div>
        <div style="color: var(--gray); font-size: 0.9rem;">Current Price</div>
    </div>

    <div style="
        background: var(--white);
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 4px 12px var(--shadow);
        text-align: center;
    ">
        <div style="
            font-size: 1.8rem;
            font-weight: bold;
            color: {{ $menuItem->status == 'Available' ? 'var(--success)' : 'var(--error)' }};
        ">{{ $menuItem->status == 'Available' ? 'Active' : 'Inactive' }}</div>
        <div style="color: var(--gray); font-size: 0.9rem;">Current Status</div>
    </div>

    <div style="
        background: var(--white);
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 4px 12px var(--shadow);
        text-align: center;
    ">
        <div style="
            font-size: 1.8rem;
            font-weight: bold;
            color: var(--mcdonalds-yellow);
        ">{{ $menuItem->created_at->diffForHumans() }}</div>
        <div style="color: var(--gray); font-size: 0.9rem;">Added to Menu</div>
    </div>
</div> --}}
@endsection
