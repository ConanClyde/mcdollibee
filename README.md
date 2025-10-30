# McDollibee Restaurant Ordering System

## Description / Overview

**McDollibee** is a comprehensive restaurant ordering and management system built with Laravel 12 and PHP 8.2. This web application serves as a dual-purpose platform that enables restaurant administrators to manage menu items while providing customers with an intuitive ordering interface. The system features a complete CRUD (Create, Read, Update, Delete) functionality for menu management, a session-based shopping cart, and automated QR code generation for order confirmations.

The application streamlines the restaurant ordering process by allowing customers to browse menu items by category, add items to their cart, and receive a unique order number with a QR code receipt upon confirmation. Each order is assigned a sequential table number, making it easy for restaurant staff to track and manage customer orders efficiently.

## Objectives

The main goals and learning outcomes of this project include:

- **Master Laravel MVC Architecture**: Implement a full-stack web application using Laravel's Model-View-Controller pattern
- **Database Design & Relationships**: Create and manage complex database relationships including one-to-many and many-to-many associations
- **CRUD Operations**: Develop complete Create, Read, Update, and Delete functionality for menu item management
- **Session Management**: Implement shopping cart functionality using Laravel's session handling
- **File Upload Handling**: Manage image uploads for menu items with proper validation and storage
- **QR Code Integration**: Generate dynamic QR codes for order confirmations using the SimpleSoftwareIO QR Code library
- **User Interface Design**: Create responsive and user-friendly interfaces for both admin and customer-facing pages
- **Form Validation**: Implement robust server-side validation for data integrity
- **Routing & Navigation**: Design clean and RESTful routing structures for application navigation

## Features / Functionality

### Admin Features
- **Menu Item Management**
  - Create new menu items with name, price, category, status, and image
  - Edit existing menu items
  - Delete menu items from the system
  - View all menu items with pagination (5 items per page)
  - Filter menu items by category and availability status
  - Upload and manage menu item images

### Customer Features
- **Browse Menu**
  - View available menu items organized by categories
  - Filter items by category (e.g., Burgers, Drinks, Desserts)
  - See item details including name, price, and image

- **Shopping Cart**
  - Add items to cart with automatic quantity tracking
  - Update item quantities in cart
  - Remove items from cart
  - View cart summary with total amount calculation
  - Session-based cart persistence

- **Order Management**
  - Confirm orders with automatic order number generation (format: ORD-XXXXXX)
  - Sequential table number assignment (001-999, auto-reset)
  - QR code generation containing order details, items, and total
  - Order confirmation page with complete order summary

### System Features
- **Database Models**: User, Category, MenuItem, Order, OrderItem, Setting
- **Relationships**: Proper Eloquent relationships between models
- **Image Storage**: Public disk storage for menu images and QR codes
- **Validation**: Comprehensive form validation for all inputs
- **Flash Messages**: Success and error notifications for user actions
- **Responsive Design**: Mobile-friendly interface

## Installation Instructions

Follow these steps to set up and run the McDollibee Restaurant Ordering System on your local machine:

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL Server

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd mcdollibee
```

### Step 2: Install PHP Dependencies
```bash
composer install
```

### Step 3: Install JavaScript Dependencies
```bash
npm install
```

### Step 4: Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 5: Database Setup
```bash
# Create a MySQL database named 'mcdollibee'
# You can do this via phpMyAdmin, MySQL Workbench, or command line:
# mysql -u root -p
# CREATE DATABASE mcdollibee;
# EXIT;

# Update your .env file with MySQL credentials:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=mcdollibee
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations to create tables
php artisan migrate

# (Optional) Seed the database with sample data
php artisan db:seed
```

### Step 6: Storage Link
```bash
# Create symbolic link for public storage
php artisan storage:link
```

### Step 7: Run the Application
```bash
# Option 1: Using Laravel's built-in server
php artisan serve

# Option 2: Using the custom dev script (runs server, queue, logs, and vite)
composer dev
```

The application will be available at `http://localhost:8000`

## Usage

### For Administrators

1. **Access Admin Dashboard**
   - Navigate to `http://localhost:8000`
   - You'll see the menu items management page

2. **Create a New Menu Item**
   - Click "Create New Menu Item" button
   - Fill in the form:
     - Name: Enter the item name (e.g., "Cheeseburger")
     - Price: Enter the price (e.g., 150.00)
     - Category: Select from dropdown (Burgers, Drinks, etc.)
     - Status: Choose "Available" or "Not Available"
     - Image: Upload an image file (JPG, JPEG, PNG, max 4MB)
   - Click "Save" to create the item

3. **Edit Menu Item**
   - Click "Edit" button next to any menu item
   - Update the desired fields
   - Click "Update" to save changes

4. **Delete Menu Item**
   - Click "Delete" button next to any menu item
   - Confirm the deletion

5. **Filter Menu Items**
   - Use the category dropdown to filter by category
   - Use the status dropdown to filter by availability

### For Customers

1. **Browse Menu**
   - Navigate to `http://localhost:8000/order`
   - Click on category tabs to view items by category

2. **Add Items to Cart**
   - Click "Add to Cart" button on any available menu item
   - Item will be added with quantity of 1
   - Clicking again will increment the quantity

3. **View Cart**
   - Click "View Cart" or navigate to `/order/cart`
   - See all items in your cart with quantities and prices

4. **Update Cart**
   - Change quantity using the input field
   - Click "Update" to apply changes
   - Click "Remove" to delete an item from cart

5. **Confirm Order**
   - Review your cart items and total
   - Click "Confirm Order" button
   - You'll receive:
     - Unique order number (e.g., ORD-A1B2C3)
     - Table number (e.g., 001)
     - QR code with order details
     - Order summary with all items and total amount

## Screenshots or Code Snippets

### Database Schema

**Menu Items Table Migration**
```php
Schema::create('menu_items', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->decimal('price', 8, 2);
    $table->enum('status', ['Available', 'Not Available']);
    $table->string('image')->nullable();
    $table->foreignId('category_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
```

### Key Code Examples

**Adding Item to Cart (OrderController.php)**
```php
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
            "image"    => $menuItem->image,
            "quantity" => 1,
        ];
    }

    session()->put('cart', $cart);
    return redirect()->back()->with('success', "{$menuItem->name} added to cart.");
}
```

**QR Code Generation**
```php
public function confirmOrder(Request $request, Generator $qrCode)
{
    // ... order creation logic ...
    
    $qrContent = "Order: {$order->order_number}\n";
    $qrContent .= "Table: {$order->table_number}\n";
    $qrContent .= "-------------------------\n";
    
    foreach ($order->items as $item) {
        $lineTotal = $item->price * $item->quantity;
        $qrContent .= "{$item->quantity}x {$item->menuItem->name} - ₱"
                    . number_format($lineTotal, 2) . "\n";
    }
    
    $qrContent .= "-------------------------\n";
    $qrContent .= "TOTAL: ₱" . number_format($order->total_amount, 2);
    
    $qrPath = "qrcodes/{$order->order_number}.svg";
    $svgData = $qrCode->encoding('UTF-8')->format('svg')->size(300)->generate($qrContent);
    Storage::disk('public')->put($qrPath, $svgData);
    
    $order->update(['qr_code' => $qrPath]);
}
```

**Eloquent Relationships (MenuItem Model)**
```php
class MenuItem extends Model
{
    protected $fillable = [
        'name', 'price', 'status', 'image', 'category_id',
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'Available');
    }
}
```

### Routes Configuration
```php
// Admin side - Menu item management
Route::get('/', [MenuItemController::class, 'index']);
Route::resource('menu_items', MenuItemController::class);

// Customer side - Ordering
Route::get('/order/{category?}', [OrderController::class, 'create'])->name('orders.create');
Route::get('/order/cart', [OrderController::class, 'viewCart'])->name('orders.cart');
Route::post('/order/add/{id}', [OrderController::class, 'addToCart'])->name('orders.add');
Route::post('/order/update/{id}', [OrderController::class, 'updateCart'])->name('orders.update');
Route::post('/order/remove/{id}', [OrderController::class, 'removeFromCart'])->name('orders.remove');
Route::post('/order/confirm', [OrderController::class, 'confirmOrder'])->name('orders.confirm');
```

## Contributors

- **Alvin de Mesa** - Lead Developer & Project Creator
- **Delysha Grace Paz** - Project Partner & Collaborator

---

### Technologies Used

- **Backend**: Laravel 12, PHP 8.2
- **Database**: MySQL
- **Frontend**: Blade Templates, TailwindCSS (via Vite)
- **Libraries**: 
  - SimpleSoftwareIO QR Code Generator
  - Laravel IDE Helper
  - Faker (for testing)
- **Tools**: Composer, NPM, Vite

### Project Structure
```
mcdollibee/
├── app/
│   ├── Http/Controllers/
│   │   ├── MenuItemController.php
│   │   ├── OrderController.php
│   │   └── CategoryController.php
│   └── Models/
│       ├── MenuItem.php
│       ├── Order.php
│       ├── OrderItem.php
│       ├── Category.php
│       └── Setting.php
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   └── views/
│       ├── menu_item/
│       └── orders/
├── routes/
│   └── web.php
└── public/
    └── images/
```

---

**Developed as a Midterm Examination Project**  
*Demonstrating proficiency in Laravel framework, database design, and full-stack web development*
