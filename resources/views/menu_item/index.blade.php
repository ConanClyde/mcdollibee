@extends('layouts.app')

@section('title', 'Menu Items - McDonald\'s Management')

@section('content')
<div class="page-header">
    <h1 class="page-title">Menu Items</h1>
    <a href="{{ route('menu_items.create') }}" class="btn btn-primary">+ Add Menu Item</a>
</div>

<!-- Filter Section -->
<div class="filter-section">
    <form method="GET" action="{{ route('menu_items.index') }}" class="filter-form">
        <div class="form-group">
            <label for="category_id">Category</label>
            <select name="category_id" id="category_id" class="form-control">
                <option value="">All Categories</option>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}" {{ $categoryId == $category->id ? 'selected' : '' }}>
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="status">Status</label>
            <select name="status" id="status" class="form-control">
                <option value="">All Status</option>
                <option value="Available" {{ $status == 'Available' ? 'selected' : '' }}>Available</option>
                <option value="Not Available" {{ $status == 'Not Available' ? 'selected' : '' }}>Not Available</option>
            </select>
        </div>

        {{-- <div class="form-group">
            <button type="submit" class="btn btn-secondary">Filter</button>
            <a href="{{ route('menu_items.index') }}" class="btn btn-secondary">Reset</a>
        </div> --}}
    </form>
</div>

<!-- Menu Items Display -->
@if($menuItems->count() > 0)
    <!-- Card View for smaller screens -->
    <div class="menu-grid d-md-none">
        @foreach($menuItems as $item)
            <div class="menu-item-card">
                @if($item->image)
                    <img src="{{ asset('storage/' . $item->image) }}" alt="{{ $item->name }}" class="menu-item-image">
                @else
                    <div class="menu-item-image">No Image Available</div>
                @endif

                <div class="menu-item-content">
                    <h3 class="menu-item-name">{{ $item->name }}</h3>
                    <div class="menu-item-price">${{ number_format($item->price, 2) }}</div>
                    <div class="menu-item-status {{ $item->status == 'Available' ? 'status-available' : 'status-unavailable' }}">
                        {{ $item->status }}
                    </div>
                    <div class="menu-item-category">{{ $item->category->name ?? 'Uncategorized' }}</div>

                    <div class="menu-item-actions">
                        <a href="{{ route('menu_items.show', $item) }}" class="btn btn-secondary btn-small">View</a>
                        <a href="{{ route('menu_items.edit', $item) }}" class="btn btn-primary btn-small">Edit</a>
                        <form action="{{ route('menu_items.destroy', $item) }}" method="POST" style="display:inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-small delete-btn">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    <!-- Table View for larger screens -->
    <div class="table-container d-none d-md-block">
        <table class="menu-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($menuItems as $item)
                <tr>
                    <td>
                        @if($item->image)
                            <img src="{{ asset('storage/' . $item->image) }}" alt="{{ $item->name }}" class="table-image">
                        @else
                            <div class="table-image" style="background: var(--light-gray); display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">No Image</div>
                        @endif
                    </td>
                    <td><strong>{{ $item->name }}</strong></td>
                    <td><span style="color: var(--mcdonalds-red); font-weight: bold;">₱{{ number_format($item->price, 2) }}</span></td>
                    <td>
                        <span class="menu-item-status {{ $item->status == 'Available' ? 'status-available' : 'status-unavailable' }}">
                            {{ $item->status }}
                        </span>
                    </td>
                    <td>{{ $item->category->name ?? 'Uncategorized' }}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <a href="{{ route('menu_items.show', $item) }}" class="btn btn-secondary btn-small">View</a>
                            <a href="{{ route('menu_items.edit', $item) }}" class="btn btn-primary btn-small">Edit</a>
                            <form action="{{ route('menu_items.destroy', $item) }}" method="POST" style="display:inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-small delete-btn">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <!-- FIXED PAGINATION -->
    <div class="pagination-container">
        <nav class="pagination" role="navigation" aria-label="Pagination Navigation">
            {{-- Previous Page Link --}}
            @if ($menuItems->onFirstPage())
                <span class="disabled dprev"><span>Previous</span></span>
            @else
                <a href="{{ $menuItems->previousPageUrl() }}" rel="prev" aria-label="Previous Page">Previous</a>
            @endif

            {{-- Pagination Elements --}}
            @foreach ($menuItems->getUrlRange(1, $menuItems->lastPage()) as $page => $url)
                @if ($page == $menuItems->currentPage())
                    <span class="active" aria-current="page"><span>{{ $page }}</span></span>
                @else
                    <a href="{{ $url }}">{{ $page }}</a>
                @endif
            @endforeach

            {{-- Next Page Link --}}
            @if ($menuItems->hasMorePages())
                <a href="{{ $menuItems->nextPageUrl() }}" rel="next" aria-label="Next Page">Next</a>
            @else
                <span class="disabled dnext"><span>Next</span></span>
            @endif
        </nav>
    </div>
@else
    <!-- Empty State -->
    <div class="empty-state">
        <div class="empty-state-icon">🍔</div>
        <h3 class="empty-state-title">No Menu Items Found</h3>
        <p class="empty-state-message">
            @if($categoryId || $status)
                No items match your current filters. Try adjusting your search criteria.
            @else
                Get started by adding your first menu item to the system.
            @endif
        </p>
        <a href="{{ route('menu_items.create') }}" class="btn btn-primary">Add Your First Menu Item</a>
    </div>
@endif

<!-- Floating Action Button -->
<a href="{{ route('menu_items.create') }}" class="fab" title="Add Menu Item">+</a>

@endsection

@push('scripts')
<style>
    @media (max-width: 768px) {
        .d-md-none { display: block !important; }
        .d-none { display: none !important; }
    }
    @media (min-width: 769px) {
        .d-md-none { display: none !important; }
        .d-none { display: block !important; }
    }
</style>
@endpush
