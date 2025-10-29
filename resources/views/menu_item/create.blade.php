@extends('layouts.app')

@section('title', 'Add New Menu Item - McDonald\'s Management')

@section('content')
<div class="page-header">
    <h1 class="page-title">Add New Menu Item</h1>
    <a href="{{ route('menu_items.index') }}" class="btn btn-secondary">← Back to Menu</a>
</div>

<div class="form-container">
    @if ($errors->any())
        <div class="error-list">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('menu_items.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="form-row">
            <div class="form-group">
                <label for="name">Item Name *</label>
                <input type="text"
                       id="name"
                       name="name"
                       class="form-control"
                       value="{{ old('name') }}"
                       required
                       placeholder="e.g. Big Mac">
            </div>

            <div class="form-group">
                <label for="price">Price *</label>
                <input type="number"
                       id="price"
                       name="price"
                       class="form-control"
                       step="0.01"
                       min="0"
                       value="{{ old('price') }}"
                       required
                       placeholder="0.00">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="category_id">Category</label>
                <select name="category_id" id="category_id" class="form-control">
                    <option value="">Select Category</option>
                    @foreach($categories as $category)
                        <option value="{{ $category->id }}" {{ old('category_id') == $category->id ? 'selected' : '' }}>
                            {{ $category->name }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="status">Status *</label>
                <select name="status" id="status" class="form-control" required>
                    <option value="">Select Status</option>
                    <option value="Available" {{ old('status') == 'Available' ? 'selected' : '' }}>Available</option>
                    <option value="Not Available" {{ old('status') == 'Not Available' ? 'selected' : '' }}>Not Available</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="image">Menu Item Image</label>
            <input type="file"
                   id="image"
                   name="image"
                   class="form-control"
                   accept="image/jpeg,image/png,image/jpg">
            <small style="color: var(--gray); font-size: 0.875rem; margin-top: 0.5rem; margin-bottom: 0.5rem; display: block;">
                Supported formats: JPEG, PNG, JPG. Maximum size: 4MB
            </small>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap;">
            <button type="submit" class="btn btn-primary">Save Menu Item</button>
            <a href="{{ route('menu_items.index') }}" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script>
    // Additional form enhancements
    document.addEventListener('DOMContentLoaded', function() {
        // Format price input
        const priceInput = document.getElementById('price');
        if (priceInput) {
            priceInput.addEventListener('input', function(e) {
                let value = e.target.value;
                if (value && !isNaN(value)) {
                    // Ensure two decimal places
                    if (value.includes('.') && value.split('.')[1].length > 2) {
                        e.target.value = parseFloat(value).toFixed(2);
                    }
                }
            });
        }

        // Auto-capitalize item name
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('input', function(e) {
                // Capitalize first letter of each word
                e.target.value = e.target.value.replace(/\b\w/g, l => l.toUpperCase());
            });
        }
    });
</script>
@endpush
