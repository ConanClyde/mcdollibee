<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'McDollibee\'s Menu Management')</title>
    <link rel="icon" href="{{ asset('images/logo.png') }}" type="image/x-icon">
    <link rel="stylesheet" href="{{ asset('css/menuitems.css') }}">
</head>
<body>
    <header>
        <div class="header-content">
            <a href="{{ route('menu_items.index') }}" class="logo">
                <img src="{{ asset('images/logo.png') }}" alt="McDollibee's Logo">
                McDollibee
            </a>
            {{-- <nav>
                <a href="{{ route('menu_items.index') }}">Menu Items</a>
                <a href="{{ route('menu_items.create') }}">Add Item</a>
            </nav> --}}
        </div>
    </header>

    <main>
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

    <script src="{{ asset('js/app.js') }}"></script>

    @stack('scripts')
</body>
</html>
