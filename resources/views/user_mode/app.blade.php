<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'McDollibee - Kiosk')</title>
    <link rel="icon" href="{{ asset('images/logo.png') }}" type="image/x-icon">
    <link rel="stylesheet" href="{{ asset('css/usermode.css') }}">
</head>
<body>
    <header>
        <div class="header-content">
            <a href="{{ route('orders.create') }}" class="logo">
                <img src="{{ asset('images/logo.png') }}" alt="McDollibee Logo">
                McDollibee
            </a>
            <nav>
                <a href="{{ route('orders.create') }}">Place Order</a>
                <a href="{{ route('orders.cart') }}">
                    View Cart
                    @if(!empty(session()->get('cart', [])))
                        <span style="
                            background: var(--mcdonalds-yellow);
                            color: var(--mcdonalds-red);
                            border-radius: 50%;
                            padding: 0.25rem 0.5rem;
                            font-size: 0.8rem;
                            margin-left: 0.5rem;
                            min-width: 20px;
                            height: 20px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                        ">{{ count(session()->get('cart', [])) }}</span>
                    @endif
                </a>
            </nav>
        </div>
    </header>

    <main class="main-content">
        @yield('content')
    </main>

    <!-- Flash Messages Script -->
    <script>
        window.flashMessages = {
            @if(session('success'))
                success: "{{ session('success') }}",
            @endif
            @if(session('error'))
                error: "{{ session('error') }}",
            @endif
            @if(session('warning'))
                warning: "{{ session('warning') }}",
            @endif
            @if(session('info'))
                info: "{{ session('info') }}",
            @endif
        };

        // Laravel flash messages for notification system
        window.laravelFlash = window.flashMessages;
    </script>

    <script src="{{ asset('js/kiosk-app.js') }}"></script>

    @stack('scripts')
</body>
</html>
