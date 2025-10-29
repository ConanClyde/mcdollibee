<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Category;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    /**
     * Display a listing of the menu items (with filters).
     */
    public function index(Request $request)
    {
        $categories = Category::all();

        $categoryId = $request->input('category_id');
        $status = $request->input('status');

        $menuItems = MenuItem::with('category')
            ->when($categoryId, fn($query) => $query->where('category_id', $categoryId))
            ->when($status, fn($query) => $query->where('status', $status))
            ->paginate(5);

        return view('menu_item.index', compact('menuItems', 'categories', 'categoryId', 'status'));
    }

    /**
     * Show the form for creating a new menu item.
     */
    public function create()
    {
        $categories = Category::all();
        return view('menu_item.create', compact('categories'));
    }

    /**
     * Store a newly created menu item in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric',
            'status'      => 'required|in:Available,Not Available',
            'category_id' => 'nullable|exists:categories,id',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('menu_images', 'public');
        }

        MenuItem::create($validated);

        return redirect()->route('menu_items.index')->with('success', 'Menu item created successfully.');
    }

    /**
     * Display the specified menu item.
     */
    public function show(MenuItem $menuItem)
    {
        return view('menu_item.show', compact('menuItem'));
    }

    /**
     * Show the form for editing the specified menu item.
     */
    public function edit(MenuItem $menuItem)
    {
        $categories = Category::all();
        return view('menu_item.edit', compact('menuItem', 'categories'));
    }

    /**
     * Update the specified menu item in storage.
     */
    public function update(Request $request, MenuItem $menuItem)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric',
            'status'      => 'required|in:Available,Not Available',
            'category_id' => 'nullable|exists:categories,id',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('menu_images', 'public');
        }

        $menuItem->update($validated);

        return redirect()->route('menu_items.index')->with('success', 'Menu item updated successfully.');
    }

    /**
     * Remove the specified menu item from storage.
     */
    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();
        return redirect()->route('menu_items.index')->with('success', 'Menu item deleted successfully.');
    }
}
