@extends('layouts.master')

@section('title', 'Create Order & Purchase Bill')

@section('content')
<div class="container">
    <div class="row">
        <!-- Order Creation Form -->
        <div class="col-md-6">
            <h3>Create Order</h3>
            <form id="orderForm">
                @csrf
                <div class="form-group">
                    <label for="product_id">Product</label>
                    <select id="product_id" name="product_id" class="form-control">
                        <option value="">Select Product</option>
                        @foreach($products as $product)
                            <option value="{{ $product->id }}" data-price="{{ $product->purchase_price }}" data-supplier="{{ $product->supplier->name }}">
                                {{ $product->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="form-group">
                    <label for="supplier_name">Supplier</label>
                    <input type="text" id="supplier_name" class="form-control" readonly>
                </div>
                <div class="form-group">
                    <label for="purchase_price">Purchase Price</label>
                    <input type="number" id="purchase_price" class="form-control" readonly>
                </div>
                <div class="form-group">
                    <label for="quantity">Quantity</label>
                    <input type="number" id="quantity" name="quantity" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="total_price">Total Price</label>
                    <input type="number" id="total_price" class="form-control" readonly>
                </div>
                <button type="button" class="btn btn-primary" id="addOrder">Add Order</button>
            </form>
        </div>

        <!-- Purchase Bill Section -->
        <div class="col-md-6">
            <h3>Purchase Bill</h3>
            <form id="purchaseForm" method="POST" action="{{ route('orders.store') }}">
                @csrf
                <table class="table table-bordered" id="orderSummary">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Dynamic order rows will go here -->
                    </tbody>
                </table>

                <div class="form-group">
                    <label for="total_purchase">Total Purchase</label>
                    <input type="number" id="total_purchase" name="total_purchase" class="form-control" readonly>
                </div>
                <div class="form-group">
                    <label for="amount_given">Amount Given</label>
                    <input type="number" id="amount_given" name="amount_given" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="amount_return">Amount Returned</label>
                    <input type="number" id="amount_return" name="amount_return" class="form-control" readonly>
                </div>
                <input type="hidden" id="orderData" name="order_data"> <!-- Hidden field for order data -->
                <button type="submit" class="btn btn-success" id="submitOrder">Submit Purchase</button>
            </form>
        </div>
    </div>
</div>

<script>
    const orderSummary = document.getElementById('orderSummary').getElementsByTagName('tbody')[0];
    const totalPurchaseInput = document.getElementById('total_purchase');
    const amountGivenInput = document.getElementById('amount_given');
    const amountReturnInput = document.getElementById('amount_return');
    const orderDataInput = document.getElementById('orderData');

    let totalPurchaseAmount = 0;
    let orders = []; // This will hold the created orders

    document.getElementById('product_id').addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        const supplier = selectedOption.getAttribute('data-supplier');

        document.getElementById('supplier_name').value = supplier;
        document.getElementById('purchase_price').value = price;
        calculateTotalPrice();
    });

    document.getElementById('quantity').addEventListener('input', calculateTotalPrice);

    document.getElementById('amount_given').addEventListener('input', calculateAmountReturn);

    document.getElementById('addOrder').addEventListener('click', function () {
        const productSelect = document.getElementById('product_id');
        const productName = productSelect.options[productSelect.selectedIndex].text;
        const productId = productSelect.value;
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('purchase_price').value;
        const totalPrice = document.getElementById('total_price').value;

        if (!productId || !quantity || !price) {
            alert('Please select a product and enter quantity.');
            return;
        }

        // Add order to summary
        const newRow = orderSummary.insertRow();
        newRow.innerHTML = `
            <td>${productName}</td>
            <td>${quantity}</td>
            <td>${price}</td>
            <td>${totalPrice}</td>
        `;

        // Update total purchase amount
        totalPurchaseAmount += parseFloat(totalPrice);
        totalPurchaseInput.value = totalPurchaseAmount;

        // Add order to orders array
        orders.push({
            product_id: productId,
            quantity: quantity,
            price: price,
            total_price: totalPrice
        });

        // Reset form for the next order
        document.getElementById('product_id').value = '';
        document.getElementById('supplier_name').value = '';
        document.getElementById('purchase_price').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('total_price').value = '';

        calculateAmountReturn();
    });

    document.getElementById('purchaseForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Set the order data into the hidden input field
    orderDataInput.value = JSON.stringify(orders);

    // Check if any orders are added before submission
    if (orders.length === 0) {
        alert('Please add at least one order before submitting.');
        return;
    }

    // Submit the form after setting the order data
    this.submit();
});


    function calculateTotalPrice() {
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('purchase_price').value;
        const totalPrice = quantity * price;

        document.getElementById('total_price').value = totalPrice;
    }

    function calculateAmountReturn() {
        const amountGiven = amountGivenInput.value;
        const amountReturn = amountGiven - totalPurchaseAmount;
        amountReturnInput.value = amountReturn >= 0 ? amountReturn : 0;
    }
</script>
@endsection
